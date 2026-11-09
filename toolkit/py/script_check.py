"""Check an episode's script table against the season's ledger, card by card, before anything is voiced.
python3 script_check.py checks.json        (paths inside are relative to checks.json; exit code 1 on any problem)

The script is the plan doc's table: rows `| <id> | on screen | narration | flags |`, id matching "id" (other tables in the doc
must not start with an id). checks.json:
  {"script": "ep02-script.md", "ledger": "../ledger/ledger.json", "id": "c2_\\\\d\\\\d",
   "max_spoken": 2,                      at most this many numbers in one narration line
   "small_ints": 10,                     whole numbers up to this (no decimal point) are words, not data
   "cards": {"c2_17": {"screen": ["f2:ep2.p_correct", "f2:ep2.L1"], "spoken": ["f2:ep2.p_correct", "f2:ep2.L1"]}},
   "phrases": [["c2_17", "minus ln of {{f2:ep2.p_correct}}"]],     the narration must contain this (ledger values filled in)
   "terms": [["cross-entropy", "c2_14"]]}                          first said in this card, and not before
Each card must carry exactly the numbers its entry lists (a card with no entry: none), on screen and in the narration,
compared at two decimals; a percent counts as its whole number (11% = 11). Logic a table can't express (a claim that needs
a comparison) belongs in the season's own checker, which can import ledger.get / ledger.fill.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ledger as LG


def cards(md, idrx):
    out = {}
    for ln in open(md, encoding='utf-8'):
        c = [x.strip() for x in ln.strip().strip('|').split('|')]
        if ln.startswith('|') and len(c) >= 3 and re.fullmatch(idrx, c[0]):
            out[c[0]] = (c[1], c[2], c[3] if len(c) > 3 else '')
    return out


def nums(s, small):
    s = s.replace('`', '').replace('−', '-')
    got = []
    for m in re.finditer(r'(?<![A-Za-z_\d.])(-?\d+(?:,\d{3})*(?:\.\d+)?)(\s?%| percent)?', s):
        tok = m.group(1).replace(',', '')
        if not m.group(2) and '.' not in tok and abs(float(tok)) <= small:
            continue
        got.append(round(abs(float(tok)), 2))
    return sorted(got)


def expect(L, exprs):
    out = []
    for e in exprs:
        v = e if isinstance(e, (int, float)) else LG.value(L, e)
        for x in (v if isinstance(v, list) else [v]):
            out.append(round(abs(float(str(x).replace('−', '-'))), 2))
    return sorted(out)


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    cf = os.path.abspath(sys.argv[1]); base = os.path.dirname(cf)
    C = LG.load(cf)
    L = LG.load(os.path.join(base, C['ledger']))
    K = cards(os.path.join(base, C['script']), C['id'])
    small, most = C.get('small_ints', 10), C.get('max_spoken', 2)
    bad = []
    if not K:
        raise SystemExit(f'no rows matching {C["id"]!r} in {C["script"]}')
    unknown = sorted(set(C.get('cards', {})) - set(K))
    if unknown: bad.append(f'checks.json lists cards that are not in the script: {unknown}')
    for cid, (screen, narr, flags) in K.items():
        e = C.get('cards', {}).get(cid, {})
        gs, gn = nums(screen, small), nums(narr, small)
        es, en = expect(L, e.get('screen', [])), expect(L, e.get('spoken', []))
        if gs != es: bad.append(f'{cid} on screen: {gs} but the ledger gives {es}')
        if gn != en: bad.append(f'{cid} narration: {gn} but the ledger gives {en}')
        if len(gn) > most: bad.append(f'{cid} speaks {len(gn)} numbers (at most {most})')
    for cid, ph in C.get('phrases', []):
        want = LG.fill(L, ph)
        if want not in K.get(cid, ('', ''))[1]: bad.append(f'{cid} narration should contain {want!r}')
    order = list(K)
    for term, cid in C.get('terms', []):
        first = next((k for k in order if re.search(r'\b' + re.escape(term) + r'\b', K[k][1], re.I)), None)
        if first != cid: bad.append(f'"{term}" should first be said in {cid}, but is first said in {first}')
    ids = [int(re.sub(r'\D', '', k)[-2:]) for k in order]
    if ids != list(range(ids[0], ids[0] + len(ids))): bad.append('card ids are not sequential')
    words = sum(len(v[1].split()) for v in K.values())
    print(f'{len(K)} cards, {words} narration words; checked against {C["ledger"]}')
    print('\n'.join(bad) if bad else 'each card carries exactly its ledger numbers; phrases and terms in place; no line speaks more than ' + str(most) + ' numbers')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
