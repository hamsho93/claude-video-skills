"""Record the narration with Kokoro (kokoro-onnx), one beat at a time.
python3 tts.py EPDIR      -> out/voice.wav, out/timing.json, out/timing.js, out/<slug>.srt/.vtt

Anchor times: Kokoro gives no word timings, so the beat's text up to each {anchor} is synthesized on its own
and its length (trailing silence trimmed) is the anchor's offset into the beat. Sentence cues use the same trick.
Every synthesis is cached by (voice, speed, text) in out/clips/, so re-running after an edit only re-voices
the changed lines. Run it in the background; build visuals against fake_timing.py meanwhile.
"""
import hashlib, os, sys, time, urllib.request, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, config, beats, plain, out, write_timing, sentences, MODELS, ANCHOR, SENT

URLS = {'kokoro-v1.0.onnx': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx',
        'voices-v1.0.bin': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin'}
SR = 24000
THR = 0.012      # amplitude treated as silence when trimming
EDGE = 0.03      # seconds of silence kept at each trimmed edge


def models():
    os.makedirs(MODELS, exist_ok=True)
    for f, u in URLS.items():
        p = os.path.join(MODELS, f)
        if not os.path.exists(p):
            print('downloading', f, flush=True)
            urllib.request.urlretrieve(u, p + '.part')
            os.replace(p + '.part', p)
    return os.path.join(MODELS, 'kokoro-v1.0.onnx'), os.path.join(MODELS, 'voices-v1.0.bin')


def trim(x):
    idx = np.where(np.abs(x) > THR)[0]
    if len(idx) == 0:
        return x[:0]
    a = max(0, idx[0] - int(EDGE * SR))
    b = min(len(x), idx[-1] + int(EDGE * SR))
    return x[a:b]


def main():
    d = epdir()
    c = config(d)
    B = beats(d, c)
    from kokoro_onnx import Kokoro
    k = Kokoro(*models())
    cache = out(d, 'clips')
    os.makedirs(cache, exist_ok=True)

    def synth(text, speed=None):
        speed = c['speed'] if speed is None else speed
        text = ' '.join(text.split())
        h = hashlib.sha1(f"{c['voice']}|{speed}|{text}".encode()).hexdigest()[:16]
        p = os.path.join(cache, h + '.npy')
        if os.path.exists(p):
            return np.load(p)
        s, sr = k.create(text, voice=c['voice'], speed=speed, lang='en-us')
        assert sr == SR, sr
        x = trim(np.asarray(s, dtype=np.float32))
        np.save(p, x)
        return x

    t0 = time.time()
    tm = {'total': 0, 'beats': {}, 'a': {}, 'chapters': [], 'cues': []}
    audio = [np.zeros(int(c['lead'] * SR), dtype=np.float32)]
    t = c['lead']
    for i, b in enumerate(B):
        say = b.get('say', b['cap'])
        sp = b.get('speed', c['speed'])          # per-line speed (number walkthroughs run slower)
        gap = b.get('gap', 0.0)                   # silence between the line's sentences, so each step can land
        pieces = [q for q in SENT.split(say.strip()) if q] if gap > 0 else [say]
        clips = [synth(plain(q), sp) for q in pieces]
        starts, acc = [], 0.0
        for j, q in enumerate(clips):
            starts.append(acc); acc += len(q) / SR + (gap if j < len(clips) - 1 else 0)
        parts = []
        for j, q in enumerate(clips):
            parts.append(q)
            if j < len(clips) - 1:
                parts.append(np.zeros(int(gap * SR), dtype=np.float32))
        x = np.concatenate(parts)
        dur = len(x) / SR
        tm['beats'][b['id']] = {'t': round(t, 3), 'dur': round(dur, 3), 'end': round(t + dur, 3)}
        # anchors: synthesize the text up to each marker, within its sentence
        for j, q in enumerate(pieces):
            for m in ANCHOR.finditer(q):
                pre = plain(q[:m.start()]).strip()
                off = starts[j] + (len(synth(pre, sp)) / SR - EDGE if pre else 0.0)
                tm['a'][m.group(1)] = round(t + max(0.0, min(off, dur)), 3)
        if b.get('ch'):
            tm['chapters'].append([round(t, 2), b['ch']])
        # cues: one per sentence of the caption, timed by the spoken sentences
        cs, ss_ = sentences(plain(b['cap'])), sentences(plain(say))
        if len(cs) != len(ss_):
            cs, ss_ = [' '.join(cs)], [' '.join(ss_)]
        if len(pieces) > 1 and len(cs) == len(pieces):
            cst = [t + v for v in starts]
        else:
            cst = [t]
            for j in range(1, len(ss_)):
                cst.append(t + min(dur, len(synth(' '.join(ss_[:j]), sp)) / SR - EDGE))
        ends = cst[1:] + [t + dur]
        tm['cues'] += [[round(a_, 2), round(e, 2), txt] for a_, e, txt in zip(cst, ends, cs)]
        audio += [x, np.zeros(int(b['pause'] * SR), dtype=np.float32)]
        t += dur + b['pause']
        print(f"{i + 1}/{len(B)} {b['id']} {dur:.2f}s  ({time.time() - t0:.0f}s elapsed)", flush=True)
    last = B[-1]['id']
    tm['total'] = round(tm['beats'][last]['end'] + c['tail'], 2)
    if not tm['chapters'] or tm['chapters'][0][0] > 0.5:
        tm['chapters'].insert(0, [0, 'Intro'])
    else:
        tm['chapters'][0][0] = 0
    y = np.concatenate(audio)
    y = np.concatenate([y, np.zeros(int(max(0.0, tm['total'] - len(y) / SR) * SR), dtype=np.float32)])
    with wave.open(out(d, 'voice.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
    write_timing(d, tm, c['slug'])
    print(f"done: {tm['total']:.1f}s of narration, {len(B)} beats, {len(tm['a'])} anchors, {len(tm['cues'])} cues", flush=True)


if __name__ == '__main__':
    main()
