"""Empty-page scan: how much ink is on screen over time; reports each stretch of 0.75 s or more with an empty page
(the voice talks over blank paper). Contact sheets, overlap and clutter can't see this: they look at the end of each line,
and an empty page happens at its start, while the camera lands and before the first label is written.
python3 scan.py EPDIR              the built page (out/page.html), every 0.25 s; run after build.py, before rendering
python3 scan.py EPDIR --mp4 [f]    the finished video (default out/<slug>.mp4), every 0.1 s; run after mux.py, before delivering
A stretch's length is samples x step, so the page scan can read a gap up to 0.25 s long; the MP4 scan is the precise one.
Exit code 1 if any stretch other than the opening is found. Ink = pixels darker than the paper and its grid;
the episode tab (top right) is masked, page titles count.
"""
import io, json, os, subprocess, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, config, out

MIN, EMPTY = 0.75, 0.0004                 # shortest stretch reported (s); ink fraction below which a page is empty
W, H = 1920, 1080


def ink(a):
    a = a[:, :1900].astype(np.int16)          # the right edge can show the next page's border mid-move
    a[:130, 1620:] = 255                       # the episode tab
    return float((a.sum(axis=2) < 450).mean())


def page_rows(d, STEP=0.25):
    from playwright.sync_api import sync_playwright
    from page import open_page
    rows = []
    with sync_playwright() as pw:
        b, p = open_page(pw, out(d, 'page.html'))
        total, t = p.evaluate('window.__total'), 0.0
        while t < total - 0.5:
            p.evaluate(f'window.__frame({t})')
            rows.append((t, ink(np.asarray(Image.open(io.BytesIO(p.screenshot())).convert('RGB')))))
            t = round(t + STEP, 4)
        b.close()
    return rows


def mp4_rows(f, STEP=0.1):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', f, '-vf', f'fps={1 / STEP:g}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    rows, n = [], 0
    while len(buf := p.stdout.read(W * H * 3)) == W * H * 3:
        rows.append((n * STEP, ink(np.frombuffer(buf, dtype=np.uint8).reshape(H, W, 3)))); n += 1
    return rows


def main():
    d = epdir()
    c = config(d)
    if '--mp4' in sys.argv:
        i = sys.argv.index('--mp4')
        f = sys.argv[i + 1] if len(sys.argv) > i + 1 else out(d, c['slug'] + '.mp4')
        rows, what, STEP = mp4_rows(f), os.path.basename(f), 0.1
    else:
        rows, what, STEP = page_rows(d), 'out/page.html', 0.25
    T = json.load(open(out(d, 'timing.json')))
    first = min(b['t'] for b in T['beats'].values())
    runs, cur = [], []
    for t, v in rows:
        if v < EMPTY:
            if cur and t - cur[-1] > STEP + 0.01:
                runs.append(cur); cur = []
            cur.append(t)
    if cur: runs.append(cur)
    runs = [(r[0], r[-1] + STEP) for r in runs if len(r) * STEP >= MIN]
    print(f'{what}: {len(rows)} frames every {STEP} s; empty stretches of {MIN} s or more: {len(runs)}')
    bad = 0
    for a, z in runs:
        opening = a <= first and z <= first + 1.5
        card = next((k for k, b in T['beats'].items() if b['t'] - 1.2 <= a <= b['end']), '?')
        print(f'  {a:7.2f} s to {z:7.2f} s ({z - a:.2f} s)  ' + ('the opening, before the first line' if opening else f'line {card}'))
        bad += not opening
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
