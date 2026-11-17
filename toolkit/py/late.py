"""Late labels: text that is still being written when its line ends. On a contact sheet (taken just before each line ends)
these show up half-written, and a viewer reads them over the next line's voice.
python3 late.py EPDIR [grace=0.15]   -> exit code 1 if any
A write counts as late when it starts during a line and finishes more than `grace` seconds after that line's voice ends.
Fix by starting it earlier, writing it faster, or clamping it in the scene, e.g.
  const Wb = (m, t, d, id) => W(m, Math.min(t, bt(id).end - d - 0.25), d);   // lands before line `id` ends
"""
import json, os, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, out
from page import open_page

WRITES = """() => window.__SC.tw.filter(w => w.k === 'draw' && w.dur > 0).map(w => [w.t0, w.dur,
  (((w.m.g || w.m.el || {}).textContent) || '').trim().slice(0, 40), w.m.grp || ''])"""


def main():
    d = epdir()
    grace = float(sys.argv[2]) if len(sys.argv) > 2 else 0.15
    T = json.load(open(out(d, 'timing.json')))
    beats = sorted(((v['t'], v['end'], k) for k, v in T['beats'].items()))
    with sync_playwright() as pw:
        b, p = open_page(pw, out(d, 'page.html'))
        W = p.evaluate(WRITES)
        b.close()
    late = []
    for t0, dur, txt, g in W:
        if not txt:
            continue                                   # strokes and shapes; only text is read
        cur = [x for x in beats if x[0] <= t0 + 1e-6]
        if not cur:
            continue
        bt, be, bid = cur[-1]
        if t0 < be and t0 + dur > be + grace:
            late.append((bid, t0 + dur - be, txt))
    seen, rows = set(), []
    for bid, over, txt in late:
        if (bid, txt) in seen:
            continue
        seen.add((bid, txt)); rows.append((bid, over, txt))
    print(f'{len(rows)} labels still being written when their line ends')
    for bid, over, txt in rows:
        print(f'  {bid}  +{over:.2f}s  "{txt}"')
    sys.exit(1 if rows else 0)


if __name__ == '__main__':
    main()
