"""Overlap check: at the end of every beat, measure every visible text label (handwriting, mono, MathJax) in screen
space and report (a) labels that overlap another label and (b) labels that run off the page. Exact, from the SVG
itself, so it catches what a contact sheet is too small to show. Labels sitting on drawings still need the eye.
python3 overlap.py EPDIR [min_overlap_px=6]   -> out/overlap.json, and a list on stdout
"""
import json, os, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, out
from page import open_page

JS = r"""(minpx) => {
  const vb = document.querySelector('svg.stage, svg').getBoundingClientRect();
  const sx = 1920 / vb.width, sy = 1080 / vb.height;
  const eff = g => { let o = 1; for (let n = g; n && n.tagName !== 'svg'; n = n.parentElement) { if (n.style.display === 'none') return 0; const a = n.getAttribute('opacity'); if (a !== null) o *= +a; } return o; };
  const boxes = [];
  for (const m of window.__SC.mobs) {
    if (eff(m.g) < 0.5) continue;
    const nodes = [...m.g.querySelectorAll('text, svg.mj')].filter(n => m.own(n.closest('[data-mob]') ? n : n) && !n.closest('svg.mj svg'));
    for (const n of nodes) {
      if (n.tagName === 'text' && !n.textContent.trim()) continue;
      if (n.tagName === 'text' && +(n.style.fillOpacity || 1) < 0.5) continue;
      const r = n.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
      boxes.push({ x: (r.left - vb.left) * sx, y: (r.top - vb.top) * sy, w: r.width * sx, h: r.height * sy,
                   s: (n.textContent || n.getAttribute('aria-label') || 'math').trim().slice(0, 40), id: boxes.length });
    }
  }
  // only what the camera sees: a label wholly outside the frame is on another page of the spread
  const seen = boxes.filter(b => b.x + b.w > 0 && b.y + b.h > 0 && b.x < 1920 && b.y < 1080);
  const over = [], off = [];
  for (const b of seen) if (b.x < -2 || b.y < -2 || b.x + b.w > 1922 || b.y + b.h > 1082) off.push(b.s);
  for (let i = 0; i < seen.length; i++) for (let j = i + 1; j < seen.length; j++) {
    const a = seen[i], b = seen[j];
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (w > minpx && h > minpx) over.push([a.s, b.s, Math.round(w), Math.round(h)]);
  }
  return { n: seen.length, over, off };
}"""


def main():
    d = epdir()
    minpx = float(sys.argv[2]) if len(sys.argv) > 2 else 6
    T = json.load(open(out(d, 'timing.json')))
    beats = sorted(T['beats'].items(), key=lambda kv: kv[1]['t'])
    rep = {}
    with sync_playwright() as pw:
        b, p = open_page(pw, out(d, 'page.html'))
        for bid, v in beats:
            p.evaluate(f"window.__frame({v['end'] - 0.05})")
            r = p.evaluate(JS, minpx)
            if r['over'] or r['off']:
                rep[bid] = r
        b.close()
    json.dump(rep, open(out(d, 'overlap.json'), 'w'), indent=1)
    print(f'{len(rep)} of {len(beats)} beats with label overlaps or off-page labels')
    for bid, r in rep.items():
        for a, c, w, h in r['over']:
            print(f'  {bid:8s} overlap {w}x{h}px: "{a}" / "{c}"')
        for s in r['off']:
            print(f'  {bid:8s} off page: "{s}"')


if __name__ == '__main__':
    main()
