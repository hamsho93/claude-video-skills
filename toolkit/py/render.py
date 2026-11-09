"""Render frames k of K into out/part{k}.mp4 (30 fps, 1920x1080).
python3 render.py EPDIR k K
Run the K parts in parallel in the background, one per spare core (2 CPUs: K = 2, about 4 frames/s each;
12 CPUs: K = 4, about 20 frames/s each). Don't run TTS alongside. Each part overwrites its own out/part{k}.mp4,
so nothing needs deleting first. After a fix, re-render only the parts whose frames changed (same K), then mux.py.
"""
import os, subprocess, sys, time
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, out
from page import open_page

FPS = 30


def main():
    d = epdir()
    k, K = int(sys.argv[2]), int(sys.argv[3])
    with sync_playwright() as pw:
        b, p = open_page(pw, out(d, 'page.html'))
        total = p.evaluate('window.__total')
        n = int(round(total * FPS))
        a, z = k * n // K, (k + 1) * n // K
        ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'png', '-i', '-',
                               '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', str(FPS),
                               out(d, f'part{k}.mp4')], stdin=subprocess.PIPE)
        t0 = time.time()
        for i in range(a, z):
            p.evaluate(f'window.__frame({i / FPS:.4f})')
            ff.stdin.write(p.screenshot(type='png'))
            if (i - a) % 300 == 0:
                print(k, i - a, z - a, round(time.time() - t0), flush=True)
        ff.stdin.close(); ff.wait(); b.close()
        if p._mn_errors:
            print('page errors:', p._mn_errors[:5], flush=True)
    print(k, 'done', flush=True)


if __name__ == '__main__':
    main()
