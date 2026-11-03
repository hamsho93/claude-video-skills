"""Shared helpers for the Margin Notes pipeline.

An episode lives in its own folder (EPDIR) with:
  episode.json   slug, title, label, description, aria, mp4_title, scene, script, kits_extra, lead, tail
  script.py      BEATS (see examples/demo/script.py)
  scene.js       function build(host) {...}; see examples/demo/scene.js and examples/ep06-scene.js
Outputs go to EPDIR/out/.
"""
import importlib.util, json, os, re, sys

TK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # toolkit root
WEB = os.path.join(TK, 'web')
DEPS = os.path.join(TK, '.deps')                                      # npm deps (setup.sh)
MODELS = os.path.join(TK, 'models')                                   # kokoro model files (tts.py downloads)

ANCHOR = re.compile(r'\{(\w+)\}')


def epdir(argv=None):
    argv = argv if argv is not None else sys.argv
    if len(argv) < 2:
        raise SystemExit(f'usage: python3 {os.path.basename(argv[0])} EPDIR [...]')
    d = os.path.abspath(argv[1])
    os.makedirs(os.path.join(d, 'out'), exist_ok=True)
    return d


def config(d):
    c = json.load(open(os.path.join(d, 'episode.json'), encoding='utf-8'))
    c.setdefault('scene', 'scene.js')
    c.setdefault('script', 'script.py')
    c.setdefault('kits_extra', [])
    c.setdefault('lead', 1.6)     # silence before the first beat
    c.setdefault('tail', 3.0)     # TM.total = last beat end + tail (the scene can run longer; the player uses the max)
    c.setdefault('voice', 'af_heart')
    c.setdefault('speed', 1.0)
    for k in ('slug', 'title', 'label', 'description', 'aria', 'mp4_title'):
        if k not in c:
            raise SystemExit(f'episode.json is missing "{k}"')
    return c


def beats(d, c):
    p = os.path.join(d, c['script'])
    spec = importlib.util.spec_from_file_location('mn_script', p)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    B = m.BEATS
    names = [n for b in B for n in ANCHOR.findall(b['cap'])]
    dup = sorted({n for n in names if names.count(n) > 1})
    if dup:
        raise SystemExit(f'duplicate anchors: {dup}')
    for b in B:
        if 'say' in b and ANCHOR.findall(b['cap']) != ANCHOR.findall(b['say']):
            raise SystemExit(f'beat {b["id"]}: cap and say must carry the same anchors in the same order')
    return B


def plain(s):
    """Strip {anchor} markers."""
    return ANCHOR.sub('', s)


def out(d, *p):
    return os.path.join(d, 'out', *p)


def ts(t, sep=','):
    t = max(0.0, t)
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    ms = int(round((s - int(s)) * 1000))
    if ms == 1000:
        ms = 999
    return f'{int(h):02d}:{int(m):02d}:{int(s):02d}{sep}{ms:03d}'


def write_timing(d, tm, cap_name):
    json.dump(tm, open(out(d, 'timing.json'), 'w'), indent=0)
    open(out(d, 'timing.js'), 'w').write('const TM = ' + json.dumps(tm, separators=(',', ':')) + ';\n')
    cues = tm['cues']
    open(out(d, cap_name + '.srt'), 'w', encoding='utf-8').write(
        ''.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{c}\n\n' for i, (a, b, c) in enumerate(cues)))
    open(out(d, cap_name + '.vtt'), 'w', encoding='utf-8').write(
        'WEBVTT\n\n' + ''.join(f'{ts(a, ".")} --> {ts(b, ".")}\n{c}\n\n' for a, b, c in cues))


SENT = re.compile(r'(?<=[.!?])\s+')


def sentences(s):
    return [x for x in SENT.split(s.strip()) if x]
