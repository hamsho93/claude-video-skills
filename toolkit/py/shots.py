"""Contact sheets: 6-up sheets of 640x360 thumbnails, labelled with time and beat.
python3 shots.py EPDIR                 one frame per beat, taken just before the beat ends (everything has landed)
python3 shots.py EPDIR 12.5 40 61.2    specific times
python3 shots.py EPDIR --full 12.5     one full-size frame -> out/shots/full_12.5.png
Look for labels on drawings, residue from earlier beats, off-page camera views, invisible objects, clipped text.
"""
import json, os, sys
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, out
from page import open_page


def main():
    d = epdir()
    os.makedirs(out(d, 'shots'), exist_ok=True)
    args = sys.argv[2:]
    full = '--full' in args
    args = [a for a in args if a != '--full']
    T = json.load(open(out(d, 'timing.json')))
    if args:
        marks = [(float(a), f'{float(a):.1f}s') for a in args]
    else:
        marks = [(max(v['t'], v['end'] - 0.2), k) for k, v in T['beats'].items()]
    with sync_playwright() as pw:
        b, p = open_page(pw, out(d, 'page.html'))
        if full:
            for t, _ in marks:
                p.evaluate(f'window.__frame({t})')
                p.screenshot(path=out(d, 'shots', f'full_{t:g}.png'))
                print(out(d, 'shots', f'full_{t:g}.png'))
        else:
            tiles = []
            for t, lab in marks:
                p.evaluate(f'window.__frame({t})')
                p.screenshot(path=out(d, 'shots', '_t.png'))
                im = Image.open(out(d, 'shots', '_t.png')).convert('RGB').resize((640, 360), Image.LANCZOS)
                dr = ImageDraw.Draw(im)
                dr.rectangle([0, 0, 200, 22], fill=(0, 0, 0))
                dr.text((6, 5), f'{t:.1f}s {lab}', fill=(255, 255, 255))
                tiles.append(im)
            os.remove(out(d, 'shots', '_t.png'))
            for s in range(0, len(tiles), 6):
                sheet = Image.new('RGB', (1280 + 4, 1080 + 8), (60, 60, 60))
                for j, im in enumerate(tiles[s:s + 6]):
                    sheet.paste(im, ((j % 2) * 644, (j // 2) * 364))
                f = out(d, 'shots', f'sheet{s // 6:02d}.png')
                sheet.save(f)
                print(f)
        if p._mn_errors:
            print('page errors:', p._mn_errors[:5])
        b.close()


if __name__ == '__main__':
    main()
