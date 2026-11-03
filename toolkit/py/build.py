"""Assemble the self-contained player page.
python3 build.py EPDIR            -> out/page.html (no voice; for checks and rendering)
python3 build.py EPDIR --voice    -> out/<slug>.html (voice embedded as an MP3 data URI; publish this one)

Order inside the one script: engine (+ kit 4), TM, kits (6, 9, 10), the episode's extra kits, EP_LABEL, scene, player.
Every page declares <meta charset="utf-8"> (file:// renders without it come out Latin-1: "Â·").
"""
import base64, html, os, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, config, out, WEB

MATHJAX = '<script src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js" async></script>'


def read(p):
    return open(p, encoding='utf-8').read()


def main():
    d = epdir()
    c = config(d)
    voice = '--voice' in sys.argv
    head = read(os.path.join(WEB, 'head.html'))
    for k, v in (('{{TITLE}}', c['title']), ('{{DESCRIPTION}}', c['description']), ('{{ARIA}}', c['aria'])):
        head = head.replace(k, html.escape(v, quote=True))
    assert '<meta charset="utf-8">' in head
    if not os.path.exists(out(d, 'timing.js')):
        raise SystemExit('no out/timing.js: run fake_timing.py or tts.py first')
    parts = ["(() => {\n'use strict';", read(os.path.join(WEB, 'engine.js')), read(out(d, 'timing.js')),
             read(os.path.join(WEB, 'kits.js'))]
    parts += [read(os.path.join(d, k)) for k in c['kits_extra']]
    parts += [f'const EP_LABEL = {c["label"]!r};', read(os.path.join(d, c['scene'])), read(os.path.join(WEB, 'player.js')), '})();']
    js = '\n'.join(p.rstrip('\n') for p in parts) + '\n'
    if '</script' in js:
        raise SystemExit('the script contains "</script": escape it in the scene')
    src = '__VOICE__'
    if voice:
        wav = out(d, 'voice.wav')
        if not os.path.exists(wav):
            raise SystemExit('no out/voice.wav: run tts.py first')
        with tempfile.TemporaryDirectory() as td:
            mp3 = os.path.join(td, 'v.mp3')
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
                            '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '96k', mp3], check=True)
            src = 'data:audio/mpeg;base64,' + base64.b64encode(open(mp3, 'rb').read()).decode()
    page = (head.rstrip('\n') + '\n' + f'<audio id="vo" preload="auto" src="{src}"></audio>\n\n'
            + '<script>\n' + read(os.path.join(WEB, 'mathjax-config.js')) + '</script>\n' + MATHJAX + '\n'
            + '<script>\n' + js + '</script>\n')
    dst = out(d, c['slug'] + '.html') if voice else out(d, 'page.html')
    open(dst, 'w', encoding='utf-8').write(page)
    print(dst, f'{len(page) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
