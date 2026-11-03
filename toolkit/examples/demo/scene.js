/* ================= Margin Notes 99 · Toolkit test: one scene on a 2 x 2 spread =================
   Starter scene: copy this file for a new episode, then change EPN/EPT/NEXT, the spread size and the pages.
   pages: (0,1) title · (0,0) ch1 · (1,0) ch2 · (1,1) end card. The camera visits them in story order and the
   video ends by zooming out over the whole spread. Every time comes from TM (beats / anchors), never hard-coded. */
const EPN = '99', EPT = 'Toolkit test', NEXT = 'next · 100 · A real episode', TAB = 'EPISODE ' + EPN;
const COLS = 2, ROWS = 2;
const SPREAD_C = { x: (COLS * PW + (COLS - 1) * GUT) / 2, y: (ROWS * PH + (ROWS - 1) * GUT) / 2 };
const ZOOM_OUT = 1 / Math.max(COLS * 1.17, ROWS * 1.24);   /* fits the whole spread with a margin */

function build(host) {
  const S = new Scene(host);
  const world = E('g', {}, S.root), fixed = E('g', {}, S.root);
  const [cx0, cy0] = pageC(0, 1);
  const cam = S.add(new Cam(world), cx0, cy0, { s: 1, o: 1 }, fixed);
  /* ---------- helpers (same set as episodes 05 and 06) ---------- */
  const a = n => { const v = TM.a[n]; if (v === undefined) throw new Error('anchor ' + n); return v; };
  const bt = id => { const v = TM.beats[id]; if (!v) throw new Error('beat ' + id); return v; };
  const W = (m, t, d) => S.create(m, t, d), F = (m, t, d = 0.5, sh) => S.fadeIn(m, t, d, sh), O = (ms, t, d = 0.4) => S.out([].concat(ms).filter(Boolean), t, d);
  const H = (s, z, c, o) => hand(s, z, c, o);
  const pg = (c, r) => { const [ox, oy] = pageO(c, r); const f = (m, x, y, o) => S.add(m, ox + x, oy + y, o, world); f.ox = ox; f.oy = oy; f.mv = (m, t, d, x, y, e) => S.move(m, t, d, ox + x, oy + y, e); return f; };
  const dim = (ms, t, o = 0.28, d = 0.35) => [].concat(ms).forEach(m => m && S.set(m, t, d, { o }));
  const trk = init => S.add(new Trk(init), 0, 0, { ...init }, fixed);
  const go = (c, r, t, d = 1.1, dip = 0, s = 1) => { const [x, y] = pageC(c, r); camTo(S, cam, t, d, x, y, s, dip); };
  const grp = (ms, name) => ms.forEach(m => { if (m) { m.grp = name; if (m.T) m.T.grp = name; } });   /* moves as one in the clutter probe */
  const pulse = (m, t, k = 1.18) => { const s = m.cur.s; S.set(m, t, 0.25, { s: s * k }); S.set(m, t + 0.25, 0.35, { s }); };
  const pageTitle = (p, text, t) => {
    const tag = p(H(`${SERIES} · ${EPN} · ${EPT}`, 24, P.olive, { anchor: 'start', w: 700 }), 150, 60);
    const ti = p(H(text, 46, P.green, { anchor: 'start', w: 700 }), 148, 110);
    const un = p(ink(rl(146, 142, 158 + ti.textEl.getComputedTextLength(), 140, { bow: 0.003 }), P.green, 4), 0, 0);
    W(tag, t, 0.4); W(ti, t + 0.1, 0.9); W(un, t + 0.9, 0.35);
    grp([tag, ti, un], 'title' + t);
  };
  const label = (p, s, x, y, c = P.ink, z = 32, anchor = 'middle') => p(H(s, z, c, { anchor, w: 700 }), x, y);
  const arrowM = (p, x1, y1, x2, y2, c = P.ink, w = 4, o = {}) => p(ink(rarrow(x1, y1, x2, y2, { head: o.head ?? 18, bow: o.bow }), c, w, o.dash ? { dash: o.dash } : {}), 0, 0);
  const gm = (p, g, col = P.ink, x = 0, y = 0, o) => p(new Mob(g, col), x, y, o);
  const take = (p, lines, x, y, w = 700, t) => { const m = gm(p, takeG(lines, w), P.ink, x, y); F(m, t, 0.6, { dy: 14 }); return m; };
  const T = (p, src, x, y, z = 40, col = P.ink) => p(tex(src, z, col), x, y);   /* MathJax, centred at (x, y) */
  const tick = (p, x, y, s = 16, c = C_OK) => p(ink(checkD(x, y, s), c, 5), 0, 0);

  /* ---------- paper: a COLS x ROWS spread of graph-paper pages on a desk ---------- */
  const pat = E('pattern', { id: 'gp40', width: 40, height: 40, patternUnits: 'userSpaceOnUse' }, DEFS);
  E('path', { d: 'M40 0H0V40', fill: 'none', stroke: '#D9E3E6', 'stroke-width': 1.2 }, pat);
  const pat2 = E('pattern', { id: 'gp200', width: 200, height: 200, patternUnits: 'userSpaceOnUse' }, DEFS);
  E('path', { d: 'M200 0H0V200', fill: 'none', stroke: '#D3DEE2', 'stroke-width': 2.2 }, pat2);
  E('rect', { x: -4000, y: -4000, width: 20000, height: 12000, fill: '#E3DFCB' }, world);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const [ox, oy] = pageO(c, r);
    E('rect', { x: ox + 8, y: oy + 10, width: PW, height: PH, fill: '#000', 'fill-opacity': 0.06 }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: P.paper }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: 'url(#gp40)' }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: 'url(#gp200)' }, world);
  }
  /* the fixed tab: "EPISODE NN" (or "DEEP DIVE" in a dive) */
  const tg = E('g'); E('rect', { x: -96, y: -30, width: 192, height: 60, fill: P.hlC, 'fill-opacity': 0.55, stroke: 'none' }, tg); pathEl(tg, rrect(-96, -30, 192, 60), 3, P.ink); txtEl(tg, 0, -1, TAB, 28, P.ink, 700);
  const tab = S.add(new Mob(tg, P.ink), 1750, 74, { r: 3 }, fixed); F(tab, 0.2, 0.4);

  /* ================= title page (0,1) ================= */
  const pT = pg(0, 1);
  const iTag = label(pT, SERIES + ' · ' + EPN, 960, 330, P.olive, 40);
  const iTi = pT(H(EPT, 120, P.green, { w: 700 }), 960, 455);
  const iUn = pT(ink(rl(560, 540, 1360, 536, { bow: 0.004 }), P.green, 5), 0, 0);
  W(iTag, 0.3, 0.6); W(iTi, a('title') - 1.1, 1.3); W(iUn, a('title') + 0.3, 0.4);
  grp([iTag, iTi, iUn], 'intro');

  /* ================= (0,0) · chapter 1 · scores become probabilities ================= */
  const p1 = pg(0, 0), t1 = bt('c1_01').t;
  go(0, 0, t1 - 1.2, 1.1);
  pageTitle(p1, '1 · Scores become probabilities', t1 - 0.3);
  const NAMES = ['land', 'rotate', 'move', 'hold'], SC = [2.0, 1.1, 0.6, 0.2];
  const ex = SC.map(Math.exp), Z = ex.reduce((x, y) => x + y), PR = ex.map(v => v / Z);   /* real softmax of the scores */
  const rows = NAMES.map((n, i) => {
    const y = 330 + i * 90;
    const nm = p1(mono(`"${n}"`, 26, P.ink), 220, y);
    const sc = label(p1, SC[i].toFixed(1), 470, y, P.soft, 30);
    const bar = growBar(S, p1, trk, 600, y, 520, 36, P.magenta, { op: 0.55 });
    const pct = label(p1, Math.round(PR[i] * 100) + '%', 600 + 520 * PR[i] + 20, y, P.magenta, 30, 'start');
    return { nm, sc, bar, pct };
  });
  const scH = label(p1, 'raw score', 470, 260, P.soft, 26), prH = label(p1, 'probability', 760, 260, P.magenta, 26);
  rows.forEach((r, i) => { W(r.nm, a('score') - 0.4 + i * 0.12, 0.4); W(r.sc, a('score') + i * 0.12, 0.4); });
  W(scH, a('score') + 0.5, 0.4);
  rows.forEach((r, i) => { F(r.bar, a('softmax') - 0.1 + i * 0.15, 0.2); r.bar.grow(a('softmax') + i * 0.15, 0.8, PR[i]); });   /* added with draw: 1, so it still needs a fade-in */
  W(prH, a('softmax') + 0.2, 0.5);
  rows.forEach((r, i) => F(r.pct, a('addup') - 0.2 + i * 0.1, 0.3));
  grp(rows.map(r => r.bar), 'bars'); grp(rows.map(r => r.pct), 'pcts'); grp(rows.map(r => r.nm), 'names'); grp(rows.map(r => r.sc), 'scores');
  const fSm = T(p1, 'p_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}', 1500, 400, 48);
  W(fSm, a('softmax') + 0.6, 0.9);
  /* the loss: minus the log of the right piece's probability */
  const fL = T(p1, 'L = -\\log p_{\\text{land}} = ' + (-Math.log(PR[0])).toFixed(2), 1500, 620, 44, P.green);
  const hlR = p1(hlBar(170, 1130, 330, 64, P.hlL), 0, 0);   /* hlBar already returns a mob */
  S.behind(hlR, rows[0].nm);
  F(hlR, a('right') - 0.2, 0.4); W(fL, a('log') - 0.2, 1.0);
  take(p1, ['The loss only asks: how sure was it of the right piece?'], 960, 960, 1000, bt('c1_03').end - 0.2);

  /* ================= (1,0) · chapter 2 · the code ================= */
  const p2 = pg(1, 0), t2 = bt('c2_01').t;
  go(1, 0, t2 - 1.2, 1.1);
  pageTitle(p2, '2 · The code', t2 - 0.3);
  const cc = codeCard(S, p2, 420, 340, [
    'logits = model(inputs)',
    'ce = nn.losses.cross_entropy(logits, targets)   # minus log p(right piece)',
    'loss = (ce * mask).sum() / mask.sum()'], { file: 'example.py', tag: 'comments added for the video', z: 24, lh: 44 });
  cc.show(a('line') - 0.6).light(1, a('line') + 0.1);
  take(p2, ['One line of code, one idea.'], 960, 760, 700, a('whole') - 0.2);

  /* ================= (1,1) · end card ================= */
  const p3 = pg(1, 1), tE = bt('c2_02').end + 0.6;
  go(1, 1, tE, 1.1);
  const eTag = label(p3, `${SERIES} · ${EPN} · ${EPT}`, 960, 330, P.olive, 34);
  const eCard = gm(p3, endCardG(NEXT), C_OK, 960, 520);
  W(eTag, tE + 0.6, 0.6); F(eCard, tE + 0.9, 0.6, { dy: 14 });
  /* outro: zoom out over the whole spread (scene runs past the voice; the player uses the longer of the two) */
  const tZ = Math.max(TM.total - 0.4, tE + 3.0);
  camTo(S, cam, tZ, 3.2, SPREAD_C.x, SPREAD_C.y, ZOOM_OUT);
  S.end(tZ + 3.8);
  return S;
}
