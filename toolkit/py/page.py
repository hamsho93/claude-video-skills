"""Open a built page in headless Chromium with fonts and MathJax served from local packages (setup.sh installs them),
so renders never depend on the network.
    from page import open_page
    with sync_playwright() as pw:
        b, p = open_page(pw, 'EPDIR/out/page.html')          # render mode: one 1920x1080 page, no UI
        p.evaluate('window.__frame(12.5)'); p.screenshot(path='f.png')
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import DEPS

NM = os.path.join(DEPS, 'node_modules')
FONTS = {
    'patrick-hand-400.woff2': 'patrick-hand/files/patrick-hand-latin-400-normal.woff2',
    'jetbrains-mono-400.woff2': 'jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2',
    'jetbrains-mono-700.woff2': 'jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2',
}
CSS = """@font-face{font-family:'Patrick Hand';font-style:normal;font-weight:400;font-display:block;src:url(https://local.fonts/patrick-hand-400.woff2) format('woff2')}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:400;font-display:block;src:url(https://local.fonts/jetbrains-mono-400.woff2) format('woff2')}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:700;font-display:block;src:url(https://local.fonts/jetbrains-mono-700.woff2) format('woff2')}
"""
MJ_PREFIX = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/'


def _route(route):
    u = route.request.url
    if u.startswith('https://fonts.googleapis.com/'):
        return route.fulfill(status=200, content_type='text/css', body=CSS)
    if u.startswith('https://local.fonts/'):
        f = FONTS.get(u.rsplit('/', 1)[-1])
        if f:
            return route.fulfill(status=200, content_type='font/woff2', body=open(os.path.join(NM, '@fontsource', f), 'rb').read())
    if u.startswith(MJ_PREFIX):
        p = os.path.join(NM, 'mathjax', u[len(MJ_PREFIX):].split('?')[0])
        if os.path.exists(p):
            return route.fulfill(status=200, content_type='application/javascript', body=open(p, 'rb').read())
    if u.startswith('file://') or u.startswith('data:'):
        return route.continue_()
    return route.abort()


def open_page(pw, html_path, render=True, size=(1920, 1080), timeout=90000):
    if not os.path.isdir(os.path.join(NM, 'mathjax')):
        raise SystemExit(f'missing {NM}: run setup.sh first')
    b = pw.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    p = b.new_page(viewport={'width': size[0], 'height': size[1]}, device_scale_factor=1)
    errors = []
    p.on('pageerror', lambda e: errors.append(str(e)))
    p.route('**/*', _route)
    p.goto('file://' + os.path.abspath(html_path) + ('#render' if render else ''))
    try:
        p.wait_for_function('window.__ready === true', timeout=timeout)
    except Exception:
        raise SystemExit('page never became ready; page errors: ' + ' | '.join(errors[:5]))
    p._mn_errors = errors
    return b, p
