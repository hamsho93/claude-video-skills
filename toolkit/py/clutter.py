"""Clutter probe: sample window.__stats(t) every 0.1 s and list the windows where more than `limit` things move at once
(the camera is counted separately; fades/dims count as one). Fix real pile-ups by staggering, or group parts that
move as one with grp([...], 'name') in the scene.
python3 clutter.py EPDIR [limit=2]   -> out/clutter.json
"""
import json, os, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, out
from page import open_page


def main():
    d = epdir()
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 2
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


if __name__ == '__main__':
    main()
