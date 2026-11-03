"""YouTube cover, 1280x720: a clean frame of the main picture on the left, the title in Patrick Hand on the right,
the series tag and the episode tab.
python3 cover.py EPDIR T "Title line" ["second line"]  -> out/<slug>-cover.png
T = a time when the episode's main picture is on screen and no labels are mid-write.
Optional in episode.json: "cover_crop": [x, y, w, h] in page pixels (default the middle 1280x1080 of the frame).
"""
import base64, html, os, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, config, out
from page import open_page, _route


def main():
    d = epdir()
    c = config(d)
    t = float(sys.argv[2])
    lines = sys.argv[3:] or [c['title']]
    with sync_playwright() as pw:
        b, p = open_page(pw, out(d, 'page.html'))
        p.evaluate(f'window.__frame({t})')
        x, y, w, h = c.get('cover_crop', [320, 0, 1280, 1080])
        png = p.screenshot(clip={'x': x, 'y': y, 'width': w, 'height': h})
        b.close()
        img = 'data:image/png;base64,' + base64.b64encode(png).decode()
        tag = html.escape(c['mp4_title'].split('·')[0].strip())
        tab = html.escape(c['label'].upper())
        title = '<br>'.join(html.escape(s) for s in lines)
        doc = f"""<!doctype html><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Patrick+Hand" rel="stylesheet">
<style>body{{margin:0;width:1280px;height:720px;background:#F6F6EA;font-family:'Patrick Hand';overflow:hidden;position:relative;
background-image:linear-gradient(#D9E3E6 1px,transparent 1px),linear-gradient(90deg,#D9E3E6 1px,transparent 1px);background-size:27px 27px}}
.pic{{position:absolute;left:28px;top:40px;width:{int(640 * w / h)}px;height:640px;object-fit:cover;border-radius:10px;box-shadow:0 8px 28px rgba(40,36,20,.25)}}
.r{{position:absolute;left:{28 + int(640 * w / h) + 44}px;right:36px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center}}
.tag{{color:#7A8F1C;font-size:40px}} .t{{color:#1E5631;font-size:{92 if len(lines) > 1 else 104}px;line-height:1.02;margin-top:10px}}
.u{{height:6px;background:#1E5631;border-radius:3px;width:70%;margin-top:14px;transform:rotate(-.6deg)}}
.tab{{position:absolute;right:30px;top:26px;background:rgba(142,230,238,.55);border:3px solid #1A1A1A;border-radius:6px;padding:4px 16px;font-size:30px;transform:rotate(3deg)}}</style>
<img class="pic" src="{img}"><div class="r"><div class="tag">{tag}</div><div class="t">{title}</div><div class="u"></div></div><div class="tab">{tab}</div>"""
        open(out(d, '_cover.html'), 'w', encoding='utf-8').write(doc)
        b = pw.chromium.launch()
        q = b.new_page(viewport={'width': 1280, 'height': 720})
        q.route('**/*', _route)
        q.goto('file://' + out(d, '_cover.html'))
        q.evaluate('document.fonts.ready')
        q.wait_for_timeout(300)
        f = out(d, c['slug'] + '-cover.png')
        q.screenshot(path=f)
        b.close()
    print(f)


if __name__ == '__main__':
    main()
