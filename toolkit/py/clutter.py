"""Clutter probe: sample window.__stats(t) every 0.1 s and list the windows where more than `limit` things move at once
(the camera is counted separately; fades/dims count as one). Fix real pile-ups by staggering, or group parts that
move as one with grp([...], 'name') in the scene.
python3 clutter.py EPDIR [limit=2] [--why]   -> out/clutter.json
--why names what moves in each window (its grp name, or the start of its text, with the tween's kind and timing), so a fix
targets the real culprit: usually a label still being written when the next page's frame arrives, or two parts of one
thing that need one grp name.
"""
import json, os, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, out
from page import open_page


MOVERS = """t => { const out = new Set(); for (const w of window.__SC.tw) { if (w.dur <= 0 || t < w.t0 || t >= w.t0 + w.dur) continue;
  if (w.m.constructor.name === 'Cam' || w.k === 'color' || w.from === w.to) continue;
  const g = w.k === 'o' && w.to <= 0.3 ? 'fade/dim' : (w.m.grp || ('"' + (((w.m.g || w.m.el || {}).textContent) || '?').trim().slice(0, 28) + '"'));
  out.add(g + ' (' + w.k + ' ' + w.t0.toFixed(2) + '+' + w.dur.toFixed(2) + ')'); } return [...out]; }"""


def main():
    d = epdir()
    args = [a for a in sys.argv[2:] if not a.startswith('--')]
    limit = int(args[0]) if args else 2
    why = '--why' in sys.argv
    with sync_playwright() as pw:
        b, p = open_page(pw, out(d, 'page.html'))
        S = p.evaluate('(() => { const r = []; for (let t = 0; t < window.__total; t += 0.1) { const s = window.__stats(t); r.push([+t.toFixed(1), s.movers, s.cam]); } return r; })()')
        b.close()
    wins, cur = [], None
    for t, n, cam in S:
        if n > limit:
            if cur and t - cur[1] <= 0.11:
                cur[1] = t; cur[2] = max(cur[2], n)
            else:
                cur = [t, t, n]; wins.append(cur)
        else:
            cur = None if not cur or t - cur[1] > 0.11 else cur
    json.dump({'samples': S, 'windows': wins}, open(out(d, 'clutter.json'), 'w'))
    T = json.load(open(out(d, 'timing.json')))
    beat_at = lambda t: max(((v['t'], k) for k, v in T['beats'].items() if v['t'] <= t), default=(0, '-'))[1]
    print(f'{len(wins)} windows with more than {limit} movers')
    for a, z, n in wins:
        print(f'  {a:7.1f} - {z:7.1f}s  max {n}  ({z - a + 0.1:.1f}s, beat {beat_at(a)})')
    if why and wins:
        with sync_playwright() as pw:
            b, p = open_page(pw, out(d, 'page.html'))
            for a, z, n in wins:
                r = p.evaluate(MOVERS, (a + z) / 2)
                print(f'  {a:7.1f}s: ' + '; '.join(r))
            b.close()


if __name__ == '__main__':
    main()
