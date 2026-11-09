"""The season's ledger: one JSON file that holds every number an episode shows or says (made by the season's toy, e.g. toy.py).
The scene, the script checks, the series check and the YouTube text all read it, so a number is never typed twice.

Paths: dot-separated keys; list indices (negative allowed); * maps over a list ('ep2.surprise_table.*.p').
Forms, written 'form:path': f2 (two decimals, minus as −: '0.11'), abs (two decimals, no sign, for "minus 0.89" in words),
pct (whole percent: 11), int, raw (as stored). A list joins
with ', '. Without a form, a path gives the raw value.

In episode.json:
  "ledger": {"file": "../ledger/ledger.json",          the ledger, relative to the episode folder
             "js": "ledger_js.js",                     written by `ledger.py js`; list it in kits_extra
             "pick": {"day_one_P": "ep1.P_pos1",       name -> path, or a nested object of the same
                      "ep2": {"p_correct": "ep2.p_correct"}},
             "audit_also": ["robustness.n_runs"],      more paths whose numbers may be drawn (besides everything picked)
             "audit_allow": [100],                     literal numbers that may be drawn (a sum shown as 100%)
             "audit_small_ints": 10,                   whole numbers up to this are labels, not data (episode number, "2 decimals")
             "audit_round": 2}                         also accept each picked value rounded to this many decimals (stored 2.452, shown 2.45)

python3 ledger.py js EPDIR                  -> EPDIR/<js>: const LED = {...}, the scene's only source of numbers
python3 ledger.py audit EPDIR               every number drawn in out/page.html is a picked value (or its percent); run after build.py
python3 ledger.py fill EPDIR TEMPLATE [OUT] fills {{form:path}} and {{chapters}} (from out/timing.json) -> OUT (default EPDIR/youtube.md)
"""
import json, os, re, sys


def load(path):
    return json.load(open(path, encoding='utf-8'))


def get(L, path):
    seg = path.split('.')

    def walk(c, i):                     # a key may itself contain dots ('frac_max_p1_below_0.5'): the longest match wins
        if i == len(seg):
            return [c]
        if seg[i] == '*':
            return [x for v in c for x in walk(v, i + 1)]
        if isinstance(c, list):
            return walk(c[int(seg[i])], i + 1)
        for j in range(len(seg), i, -1):
            k = '.'.join(seg[i:j])
            if isinstance(c, dict) and k in c:
                return walk(c[k], j)
        raise KeyError(f'ledger has no {path!r} (stopped at {seg[i]!r})')
    out = walk(L, 0)
    return out if '*' in seg else out[0]


def f2(v):
    return ('−' if v < 0 else '') + f'{abs(v):.2f}'


FORMS = {'f2': f2, 'abs': lambda v: f'{abs(v):.2f}', 'pct': lambda v: round(v * 100), 'int': lambda v: int(round(v)), 'raw': lambda v: v}


def value(L, expr):
    """'form:path' -> the formatted value (a list for list values)."""
    form, _, path = expr.rpartition(':')
    v = get(L, path)
    fn = FORMS[form or 'raw']
    return [fn(x) for x in v] if isinstance(v, list) and form else (v if not form else fn(v))


def text(L, expr):
    v = value(L, expr)
    return ', '.join(str(x) for x in v) if isinstance(v, list) else str(v)


def fill(L, s, extra=None):
    """Replace every {{form:path}} (and {{name}} from extra) in s."""
    extra = extra or {}
    return re.sub(r'\{\{([^}]+)\}\}', lambda m: extra[m.group(1)] if m.group(1) in extra else text(L, m.group(1)), s)


def half_away(v, d):
    """Round half away from zero, the way the screen and people round (Python's round() goes to even)."""
    from decimal import Decimal, ROUND_HALF_UP
    return float(Decimal(repr(v)).quantize(Decimal(1).scaleb(-d), rounding=ROUND_HALF_UP))


def numbers(x, out=None, rnd=None):
    """Every number in a ledger value, with its percent when it is a share (|v| <= 1); with rnd, also each one rounded to rnd decimals."""
    out = set() if out is None else out
    if isinstance(x, bool):
        return out
    if isinstance(x, (int, float)):
        out.add(round(abs(float(x)), 6))
        if rnd is not None: out.add(round(abs(half_away(float(x), rnd)), 6))
        if abs(x) <= 1:
            out.add(round(abs(float(x)) * 100, 6))
    elif isinstance(x, list):
        for v in x: numbers(v, out, rnd)
    elif isinstance(x, dict):
        for v in x.values(): numbers(v, out, rnd)
    return out


def picked(L, pick):
    return {k: picked(L, v) if isinstance(v, dict) else get(L, v) for k, v in pick.items()}


def episode(d):
    c = load(os.path.join(d, 'episode.json'))
    if 'ledger' not in c:
        raise SystemExit('episode.json has no "ledger" block (see ledger.py)')
    g = c['ledger']
    return c, g, load(os.path.normpath(os.path.join(d, g['file'])))


def cmd_js(d):
    c, g, L = episode(d)
    led = picked(L, g['pick'])
    f = os.path.join(d, g.get('js', 'ledger_js.js'))
    open(f, 'w', encoding='utf-8').write('const LED = ' + json.dumps(led, ensure_ascii=False) + ';\n')
    if os.path.basename(f) not in c.get('kits_extra', []):
        print(f'note: add "{os.path.basename(f)}" to kits_extra in episode.json')
    print(f'{os.path.relpath(f)} written: {len(json.dumps(led))} bytes from {g["file"]}')


def cmd_audit(d):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from playwright.sync_api import sync_playwright
    from page import open_page
    c, g, L = episode(d)
    rd = g.get('audit_round')
    allowed = numbers(picked(L, g['pick']), None, rd)
    for p in g.get('audit_also', []): numbers(get(L, p), allowed, rd)
    allowed |= {round(float(v), 6) for v in g.get('audit_allow', [])}
    small = g.get('audit_small_ints', 10)
    with sync_playwright() as pw:
        b, p = open_page(pw, os.path.join(d, 'out', 'page.html'))
        texts = p.evaluate("[...new Set([...document.querySelectorAll('svg text')].map(t => t.textContent))]")
        b.close()
    bad, n = [], 0
    for t in texts:
        if t.startswith('EPISODE') or (c.get('label') and t.startswith(c['label'].upper())):
            continue                                      # the tab
        for tok in re.findall(r'−?\d+(?:,\d{3})*(?:\.\d+)?', t):
            n += 1
            v = abs(float(tok.replace('−', '-').replace(',', '')))
            if v <= small and '.' not in tok:
                continue
            if round(v, 6) not in allowed:
                bad.append(f'{tok!r} in {t!r}')
    print(f'{n} numbers on screen checked against {g["file"]}: ' + ('all from the ledger' if not bad else f'{len(bad)} not in the ledger'))
    for x in bad: print('  ' + x)
    sys.exit(1 if bad else 0)


def cmd_fill(d, tmpl, dest=None):
    c, g, L = episode(d)
    tf = os.path.join(d, 'out', 'timing.json')
    ch = [x for x in load(tf)['chapters'] if x[1] != 'Intro'] if os.path.exists(tf) else []
    if ch: ch[0] = [0, ch[0][1]]
    chapters = '\n'.join(f'{int(t) // 60}:{int(t) % 60:02d} {n}' for t, n in ch) or '(chapters: run tts.py first)'
    s = fill(L, open(tmpl, encoding='utf-8').read(), {'chapters': chapters})
    dest = dest or os.path.join(d, 'youtube.md')
    open(dest, 'w', encoding='utf-8').write(s)
    print(f'{os.path.relpath(dest)} written ({len(s.split())} words)')


if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] not in ('js', 'audit', 'fill'):
        raise SystemExit(__doc__)
    d = os.path.abspath(sys.argv[2])
    {'js': lambda: cmd_js(d), 'audit': lambda: cmd_audit(d), 'fill': lambda: cmd_fill(d, *sys.argv[3:5])}[sys.argv[1]]()
