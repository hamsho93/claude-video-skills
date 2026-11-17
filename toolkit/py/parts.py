"""Join a scene written in parts: EPDIR/parts/*.js (in name order) -> the episode's scene file, then check it.
python3 parts.py EPDIR
- Every literal a('name') and bt('id') must exist in script.py (a typo otherwise fails silently at render time).
- The scene is checked with node inside the same single script build.py makes (engine, timing, kits, scene, player), so a name
  declared twice, or a top-level name that clashes with the engine or a kit, is reported with the part file and line it came from.
- A name declared above build() and declared again inside it is reported: the inner one silently hides the outer, so the
  scene reads the wrong value (a data matrix `O` hidden by the fade-out helper `O` drew "undefined").
- Math typed as plain text is reported: an underscore subscript (W_q, s_ij), a one-line fraction over a root ("/ √2"), or a
  typed ᵀ in a label() / monoL() / plainText() / hand() string. Typeset it with tex() (MathJax: real subscripts, stacked
  fractions); keep plain digits as text so the number audit can read them. Add /* text-ok */ to a line that means it.
"""
import glob, json, os, re, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, config, beats, out, WEB, ANCHOR


def main():
    d = epdir()
    c = config(d)
    files = sorted(glob.glob(os.path.join(d, 'parts', '*.js')))
    if not files:
        raise SystemExit(f'no parts in {os.path.join(d, "parts")}')
    src = [(f, (lambda s: s if s.endswith('\n') else s + '\n')(open(f, encoding='utf-8').read())) for f in files]
    scene = ''.join(s for _, s in src)
    open(os.path.join(d, c['scene']), 'w', encoding='utf-8').write(scene)

    B = beats(d, c)
    ids = {b['id'] for b in B}
    anchors = {n for b in B for n in ANCHOR.findall(b['cap'])}
    bad = []
    for f, s in src:
        for i, ln in enumerate(s.split('\n'), 1):
            for n in re.findall(r"\ba\(\s*'(\w+)'\s*\)", ln):
                if n not in anchors: bad.append(f'{os.path.basename(f)}:{i}: a({n!r}) is not an anchor in {c["script"]}')
            for n in re.findall(r"\bbt\(\s*'(\w+)'\s*\)", ln):
                if n not in ids: bad.append(f'{os.path.basename(f)}:{i}: bt({n!r}) is not a line id in {c["script"]}')

    # names declared above build() and again inside it: the inner one hides the outer
    def declared(text):
        names = set()
        for m in re.finditer(r'\b(?:const|let|var)\s+\{([^}]*)\}\s*=', text):
            for part in m.group(1).split(','):
                part = part.strip()
                if part: names.add(part.split(':')[-1].strip().split('=')[0].strip())
        for ln in text.split('\n'):
            st = ln.strip()
            if not re.match(r'(?:const|let|var)\s', st): continue
            body = re.sub(r'^(?:const|let|var)\s+', '', st)
            depth, cur, parts_ = 0, '', []
            for ch in body:
                if ch in '([{': depth += 1
                elif ch in ')]}': depth -= 1
                if ch == ',' and depth == 0: parts_.append(cur); cur = ''
                else: cur += ch
            parts_.append(cur)
            for q in parts_:
                m = re.match(r'\s*([A-Za-z_$][\w$]*)\s*=(?!=)', q)
                if m: names.add(m.group(1))
        return names
    k0 = scene.find('function build(')
    if k0 > 0:
        outer, inner = declared(scene[:k0]), declared(scene[k0:])
        for n in sorted(outer & inner):
            bad.append(f'{n!r} is declared above build() and again inside it: the inner one hides the outer (rename one)')
    # math typed as plain text
    TXT = re.compile(r"\b(?:label|monoL|plainText|hand)\(\s*[\w.]+\s*,\s*(['\"])((?:(?!\1).)*)\1")
    MATH = re.compile(r'[A-Za-z][_][A-Za-z0-9{]|/\s*√|ᵀ')
    for f, s_ in src:
        for i, ln in enumerate(s_.split('\n'), 1):
            if 'text-ok' in ln: continue
            for m in TXT.finditer(ln):
                if MATH.search(m.group(2)):
                    bad.append(f'{os.path.basename(f)}:{i}: math typed as text in {m.group(2)[:50]!r}: typeset it with tex()')

    # the same order as build.py, so top-level clashes with the engine and kits show up
    seg = [('engine.js', open(os.path.join(WEB, 'engine.js'), encoding='utf-8').read())]
    tj = out(d, 'timing.js')
    seg.append(('timing.js', open(tj, encoding='utf-8').read() if os.path.exists(tj) else 'const TM = {total: 1, beats: {}, a: {}, chapters: [], cues: []};'))
    seg.append(('kits.js', open(os.path.join(WEB, 'kits.js'), encoding='utf-8').read()))
    seg += [(k, open(os.path.join(d, k), encoding='utf-8').read()) for k in c['kits_extra']]
    seg.append(('EP_LABEL', f'const EP_LABEL = {c["label"]!r}, SERIES = {json.dumps(c["series"])};'))
    seg += [(os.path.basename(f), s) for f, s in src]
    seg.append(('player.js', open(os.path.join(WEB, 'player.js'), encoding='utf-8').read()))
    lines, where = ["(() => {", "'use strict';"], [('wrapper', 1), ('wrapper', 2)]
    for name, s in seg:
        for i, ln in enumerate(s[:-1].split('\n') if s.endswith('\n') else s.split('\n'), 1):
            lines.append(ln); where.append((name, i))
    lines.append('})();'); where.append(('wrapper', 0))
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as t:
        t.write('\n'.join(lines) + '\n')
    r = subprocess.run(['node', '--check', t.name], capture_output=True, text=True)
    os.unlink(t.name)
    if r.returncode:
        m = re.search(r':(\d+)\n', r.stderr)
        loc = where[int(m.group(1)) - 1] if m and int(m.group(1)) <= len(where) else ('?', 0)
        msg = next((l for l in r.stderr.splitlines() if 'Error' in l), r.stderr.strip())
        bad.append(f'{loc[0]}:{loc[1]}: {msg}')
    print('\n'.join(bad) if bad else f'{c["scene"]} ok: {len(files)} parts, {scene.count(chr(10))} lines; every a() and bt() exists; node --check passes with the engine and kits')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
