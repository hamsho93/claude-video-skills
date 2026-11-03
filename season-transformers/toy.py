"""Margin Notes: Transformers. One toy model, three numbers wide, carried through all eight episodes.
Running example: the reader reads "the river bank", the writer replies "flooded again".
Contrast: "the bank loan" (same row for bank, same weights, the other meaning).
Columns of every vector: (money, water, unsure). Column vectors: q = Wq @ x.
Toy simplifications (fact notes): one layer per stack, one head (so W_O is left out), no LayerNorm,
positions left out of the numbers, the decoder's self-attention reuses the encoder's three matrices,
the decoder's own FFN is left out."""
import numpy as np, math, json
R = lambda v, n=3: np.round(np.asarray(v, float), n).tolist()
def softmax(s):
    s = np.asarray(s, float); e = np.exp(s - s.max()); return e / e.sum()
relu = lambda v: np.maximum(v, 0)
D = 3; SQ = math.sqrt(D)

P = dict(  # every hand-set number in one place
    the=(0.1, 0.1, 0.0), river=(0.0, 0.9, 0.1), loan=(0.9, 0.0, 0.1), bank=(0.1, 0.1, 0.9),
    flooded=(-0.4, 1.0, 0.0), approved=(1.0, -0.4, 0.0), again=(0.0, 0.0, -0.5), end=(0.0, 0.0, -0.8), start=(0.0, 0.0, 0.8),
    q_scale=4.0, vc=(3.0, -1.5, -0.5), ffn_th=1.1, ffn_w=(0.5, -1.0),
)

def build(P):
    E = {'the': P['the'], 'river': P['river'], 'loan': P['loan'], 'bank': P['bank'], 'flooded': P['flooded'],
         'approved': P['approved'], 'again': P['again'], '<end>': P['end'], '<start>': P['start']}
    E = {k: np.array(v, float) for k, v in E.items()}
    M = {}
    M['E'] = E
    M['OUT'] = ['the', 'river', 'bank', 'loan', 'flooded', 'approved', 'again', '<end>']
    M['Eout'] = np.stack([E[w] for w in M['OUT']])              # tied output layer (Vaswani 3.4)
    s = P['q_scale']
    M['Wq'] = np.array([[0, 0, s], [0, 0, 0], [0, 0, 0.]])      # unsure -> a loud request
    M['Wk'] = np.array([[1, 1, 0], [0, 0, 0], [0, 0, 0.]])      # label: how clear a word's meaning is (money + water)
    M['Wv'] = np.diag([1, 1, 0.])                              # contents: what it means, not how unsure it is
    M['Wq_c'] = np.array([[0, 0, s], [0, 0, 0], [0, 0, 0.]])    # the writer, still unsure, asks loudly
    M['Wk_c'] = M['Wk'].copy()                                 # readers advertise how clear they are
    a, b, c = P['vc']
    M['Wv_c'] = np.array([[a, b, 0], [b, a, 0], [c, c, 0.]])    # hands over the meaning, sharpened against the other sense; clarity settles the writer
    th = P['ffn_th']; up, down = P['ffn_w']
    # FFN, 3 -> 4 -> 3. Units: 1 unsure but heard water, 2 unsure but heard money, 3 a water word, 4 a money word
    M['W1'] = np.array([[0, 1, 1], [1, 0, 1], [0, 1, 0], [1, 0, 0.]]); M['b1'] = np.array([-th, -th, -0.5, -0.5])
    M['W2'] = np.array([[0, up, down], [up, 0, down], [0, 0.2, 0], [0.2, 0, 0]]).T   # settle: more of that sense, less unsure
    return M

def attend(Q, K, V, mask=None):
    S = Q @ K.T; Sm = S / SQ
    if mask is not None: Sm = np.where(mask, Sm, -np.inf)
    Pm = np.stack([softmax(r) for r in Sm]); return S, Pm, Pm @ V

def encoder(M, words, causal=False):
    X = np.stack([M['E'][w] for w in words]); n = len(words)
    Q, K, V = X @ M['Wq'].T, X @ M['Wk'].T, X @ M['Wv'].T
    S, Pm, Z = attend(Q, K, V, np.tril(np.ones((n, n), bool)) if causal else None)
    A = X + Z
    pre = A @ M['W1'].T + M['b1']; U = relu(pre); F = U @ M['W2'].T
    return dict(X=X, Q=Q, K=K, V=V, S=S, P=Pm, Z=Z, A=A, pre=pre, U=U, F=F, Eo=A + F)

def decoder(M, inp, enc):
    Y = np.stack([M['E'][w] for w in inp]); n = len(inp)
    S, Pm, Z = attend(Y @ M['Wq'].T, Y @ M['Wk'].T, Y @ M['Wv'].T, np.tril(np.ones((n, n), bool)))
    A = Y + Z
    Sc, Pc, C = attend(A @ M['Wq_c'].T, enc['Eo'] @ M['Wk_c'].T, enc['Eo'] @ M['Wv_c'].T)
    H = A + C; L = H @ M['Eout'].T
    return dict(Y=Y, S=S, P=Pm, A=A, Sc=Sc, Pc=Pc, C=C, H=H, L=L, Pw=np.stack([softmax(l) for l in L]))

MAIN = ['the', 'river', 'bank']; ALT = ['the', 'bank', 'loan']
RIN = ['<start>', 'flooded', 'again']; TGT = ['flooded', 'again', '<end>']

def step(M, X, lr=0.01):
    """T02 ch3: one illustrative step of size lr up the bank->river score (paper layout, rows = input dims)."""
    Wq, Wk = M['Wq'].T, M['Wk'].T; xb, xr = X[2], X[1]; q, k = xb @ Wq, xr @ Wk
    dWq, dWk = np.outer(xb, k), np.outer(xr, q); q2, k2 = xb @ (Wq + lr * dWq), xr @ (Wk + lr * dWk)
    return dict(dWq_col1=R(dWq[:, 0]), dWk_col1=R(dWk[:, 0]), q2=round(float(q2[0]), 5), k2=round(float(k2[0]), 5), score2=round(float(q2 @ k2), 4))

def ledger(P=P):
    M = build(P); OUT = M['OUT']; L = {}
    e = encoder(M, MAIN); ea = encoder(M, ALT); bi, bj = 2, 1      # bank's index in each
    L['T01'] = dict(q_bank=R(e['Q'][bi][0]), keys=R(e['K'][:, 0]), scores=R(e['S'][bi]), shares=R(100 * e['P'][bi], 1),
                    blend=R(e['Z'][bi]), alt_shares=R(100 * ea['P'][bj], 1), alt_blend=R(ea['Z'][bj]),
                    added=R(e['A'][bi]), alt_added=R(ea['A'][bj]))
    X = e['X']; raw = X @ X.T; Praw = np.stack([softmax(r / SQ) for r in raw])
    L['T02'] = dict(raw_bank_river=round(raw[2, 1], 3), raw_river_bank=round(raw[1, 2], 3), raw_bank_shares=R(100 * Praw[2], 1),
                    table=R(e['S']), shares=R(100 * e['P'], 1),
                    dWq_bank_river=R(np.outer(e['K'][1], X[2])), dWk_bank_river=R(np.outer(e['Q'][2], X[1])),
                    raw_table=R(raw), raw_bank_chain=dict(scaled=R(raw[2] / SQ), exp=R(np.exp(raw[2] / SQ)), shares=R(Praw[2])),
                    raw_bank_blend=R(Praw[2] @ X), river_chain=dict(scaled=R(e['S'][1] / SQ), exp=R(np.exp(e['S'][1] / SQ)), shares=R(e['P'][1])),
                    keys_as_contents=dict(main=R(e['P'][bi] @ e['K']), alt=R(ea['P'][bj] @ ea['K'])),
                    step_001=step(M, X))
    d = decoder(M, RIN, e); da = decoder(M, RIN, ea)
    L['T03'] = dict(a=R(e['A']), pre=R(e['pre']), relu=R(e['U']), ffn=R(e['F']), enc_out=R(e['Eo']),
                    alt_bank_relu=R(ea['U'][bj]), alt_bank_out=R(ea['Eo'][bj]),
                    writer_q=R(d['A'][0] @ M['Wq_c'].T), cross_keys=R((e['Eo'] @ M['Wk_c'].T)[:, 0]), cross_shares=R(100 * d['Pc'][0], 1),
                    handed=R(e['Eo'] @ M['Wv_c'].T), cross_blend=R(d['C'][0]), h1=R(d['H'][0]))
    p = d['Pw'][0]; y = np.eye(len(OUT))[OUT.index('flooded')]
    L['T04'] = dict(h1=R(d['H'][0]), logits=dict(zip(OUT, R(d['L'][0], 2))), shares=dict(zip(OUT, R(100 * p, 1))),
                    loss=round(-math.log(p[OUT.index('flooded')]), 3), grad=dict(zip(OUT, R(p - y, 3))),
                    alt_h1=R(da['H'][0]), alt_shares=dict(zip(OUT, R(100 * da['Pw'][0], 1))), loss_at_1pct=round(-math.log(0.01), 2))
    pt = [d['Pw'][t][OUT.index(w)] for t, w in enumerate(TGT)]
    seq = ['<start>']
    for _ in range(3):
        dd = decoder(M, seq, e); seq.append(OUT[int(dd['L'][-1].argmax())])
    L['T05'] = dict(self_scores=R(d['S']), self_shares=R(100 * d['P'], 1), right_word=dict(zip(TGT, R(100 * np.array(pt), 1))),
                    losses=dict(zip(TGT, R(-np.log(pt), 3))), total=round(float(-np.log(pt).sum()), 3),
                    argmax=[OUT[i] for i in d['L'].argmax(1)], free_running=seq[1:])
    top2 = lambda pre: sorted((np.argsort(-pre)[:2] + 1).tolist())
    L['T06'] = dict(main=dict(zip(MAIN, [top2(r) for r in e['pre']])), alt=dict(zip(ALT, [top2(r) for r in ea['pre']])),
                    fired_main=dict(zip(MAIN, [[i + 1 for i in range(4) if u[i] > 0] for u in e['U']])),
                    fired_alt=dict(zip(ALT, [[i + 1 for i in range(4) if u[i] > 0] for u in ea['U']])))
    ec = encoder(M, MAIN, causal=True); eac = encoder(M, ALT, causal=True); dac = decoder(M, RIN, eac)
    app = MAIN + ['flooded', 'again']; eb = encoder(M, app); ebc = encoder(M, app, causal=True)
    L['T07'] = dict(main_causal_bank_shares=R(100 * ec['P'][bi], 1), alt_causal_bank_shares=R(100 * eac['P'][bj], 1),
                    alt_causal_bank_blend=R(eac['Z'][bj]), alt_causal_bank_out=R(eac['Eo'][bj]), alt_bidir_bank_out=R(ea['Eo'][bj]),
                    alt_causal_writer_shares=R(100 * dac['Pc'][0], 1), alt_causal_bet=dict(zip(OUT, R(100 * dac['Pw'][0], 1))),
                    append_bidir_bank_shares=R(100 * eb['P'][bi], 1), append_causal_bank_shares=R(100 * ebc['P'][bi], 1),
                    append_bidir_change=R(eb['Eo'][:3] - e['Eo']), append_causal_change=R(ebc['Eo'][:3] - ec['Eo']))
    # T08: an illustrative running state: each token sets how much to keep and how much to write
    st = []
    for words, X_ in (('main', e['X']), ('alt', ea['X'])):
        s = np.zeros(3); steps = []
        for w, x in zip(MAIN if words == 'main' else ALT, X_):
            wr = round(float(x[0] + x[1]), 2); kp = round(1 - 0.5 * wr, 2); s = kp * s + wr * (M['Wv'] @ x)
            steps.append(dict(tok=w, keep=kp, write=wr, state=R(s)))
        st.append(steps)
    L['T08'] = dict(main=st[0], alt=st[1])
    return L

if __name__ == '__main__':
    L = ledger(); json.dump(L, open('ledger.json', 'w'), indent=1)
    for k, v in L.items():
        print('=====', k)
        for kk, vv in v.items(): print('  ', kk, vv)
