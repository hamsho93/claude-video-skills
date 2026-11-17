"""Content gaps: stretches where a page shows only its frame (the map, the step strip, the episode tab) and nothing the line
is about. scan.py cannot see these, because it counts the frame as ink.
python3 gaps.py EPDIR [min=0.75] [--frame REGEX]   -> exit code 1 if any stretch after the opening is longer than `min` seconds
Every 0.25 s it counts visible mobs whose grp name does not match the frame REGEX (default: the names the toolkit's map and
strip helpers create: frame_<line>, lit<n>_, sw<n>_, rg<n>_, mapb<n>, mapl<n>, maph<n>, mbuild<n>, sl<n>_, sch<n>, slb<n>,
sar<n>, sc<n>, shl<n>). Give the frame's own parts those grp names, or pass --frame.
A page arriving with the camera often shows its frame for half a second before the line's first picture; that is fine.
"""
import json, os, re, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, out
from page import open_page

COUNT = """([rx, step]) => { const R = new RegExp(rx), out = [], SC = window.__SC;
  for (let t = 0; t < window.__total; t += step) { window.__frame(t); let n = 0;
    for (const m of SC.mobs) { const g = m.grp; if (typeof g === 'string' && R.test(g)) continue; const el = m.g || m.el; if (!el) continue;
      const cs = getComputedStyle(el), op = +(el.getAttribute('opacity') ?? cs.opacity), bb = el.getBoundingClientRect();
      if (op > 0.05 && cs.display !== 'none' && bb.width > 2 && bb.right > 0 && bb.left < innerWidth && bb.bottom > 0 && bb.top < innerHeight) n++; }
    out.push([+t.toFixed(2), n]); } return out; }"""


def main():
    d = epdir()
    args = sys.argv[2:]
    rx = args[args.index('--frame') + 1] if '--frame' in args else r'^(frame_|lit\d|sw\d|rg\d|map[blh]\d|mbuild|sl\d|sch\d|slb\d|sar\d|sc\d|shl\d)'
    rest = [a for i, a in enumerate(args) if a != '--frame' and (i == 0 or args[i - 1] != '--frame')]
    mn = float(rest[0]) if rest else 0.75
    T = json.load(open(out(d, 'timing.json')))
    first = min(v['t'] for v in T['beats'].values())
    beat = lambda t: max(((v['t'], k) for k, v in T['beats'].items() if v['t'] <= t), default=(0, '-'))[1]
    with sync_playwright() as pw:
        b, p = open_page(pw, out(d, 'page.html'))
        r = p.evaluate(COUNT, [rx, 0.25])
        b.close()
    gaps, cur = [], None
    for t, n in r:
        if n <= 1:                                     # 1: the episode tab, which every page shows
            if cur and t - cur[1] <= 0.26: cur[1] = t
            else: cur = [t, t]; gaps.append(cur)
        else:
            cur = None
    bad = [(a, z) for a, z in gaps if z - a + 0.25 > mn and a > first + 1.0]
    print(f"{len(bad)} stretches longer than {mn} s with only the frame on screen (after the opening)")
    for a, z in bad:
        print(f'  {a:7.2f} - {z + 0.25:7.2f}s  ({z - a + 0.25:.2f}s, line {beat(a)})')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
