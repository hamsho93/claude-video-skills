"""Animatic: the recorded voice over one plain card per line (chapter, line id, narration, and the beat's `see` note
if it has one), so the person can hear the episode before any animation is built. Needs only tts.py's output.
python3 animatic.py EPDIR   -> out/<slug>-animatic.mp4 (1280x720, a few MB)
"""
import json, os, subprocess, sys, textwrap
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, config, beats, out, plain

W, H = 1280, 720
PAPER, INK, GREEN, SOFT, ORANGE = '#F6F6EA', '#1A1A1A', '#1E5631', '#7A7F80', '#F2A33A'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'


def font(p, s):
    try:
        return ImageFont.truetype(p, s)
    except OSError:
        return ImageFont.load_default()


def card(path, chapter, b):
    im = Image.new('RGB', (W, H), PAPER)
    d = ImageDraw.Draw(im)
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill='#E3E9EA')
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill='#E3E9EA')
    d.text((60, 40), chapter, font=font(BOLD, 30), fill=GREEN)
    tags = [b['id']] + (['slow'] if b.get('speed') else []) + (['think'] if b.get('think') else [])
    d.text((60, 86), ' · '.join(tags), font=font(FONT, 22), fill=SOFT)
    y = 150
    for line in textwrap.wrap(plain(b['cap']), 52):
        d.text((60, y), line, font=font(FONT, 36), fill=INK); y += 50
    if b.get('see'):
        y = max(y + 30, 470)
        d.rectangle([50, y - 14, W - 50, H - 40], outline=ORANGE, width=3)
        d.text((70, y), 'on screen', font=font(BOLD, 22), fill=ORANGE)
        for line in textwrap.wrap(b['see'], 70)[:5]:
            y += 34; d.text((70, y), line, font=font(FONT, 26), fill=INK)
    im.save(path)


def main():
    d = epdir()
    c = config(d)
    T = json.load(open(out(d, 'timing.json')))
    B = beats(d, c)
    tmp = out(d, 'animatic'); os.makedirs(tmp, exist_ok=True)
    lines, cur = [], 'Intro'
    times = [T['beats'][b['id']]['t'] for b in B] + [T['total']]
    for i, b in enumerate(B):
        t0 = 0 if i == 0 else times[i]
        if b.get('ch'):
            cur = b['ch']
        p = os.path.join(tmp, f'{i:04d}.png'); card(p, cur, b)
        lines.append(f"file '{p}'\nduration {times[i + 1] - t0:.3f}\n")
    lines.append(f"file '{p}'\n")
    open(os.path.join(tmp, 'list.txt'), 'w').write(''.join(lines))
    dst = out(d, c['slug'] + '-animatic.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', os.path.join(tmp, 'list.txt'),
                    '-i', out(d, 'voice.wav'), '-vf', 'fps=10,format=yuv420p', '-c:v', 'libx264', '-crf', '28',
                    '-c:a', 'aac', '-b:a', '96k', '-t', f"{T['total']:.3f}", '-movflags', '+faststart', dst], check=True)
    print(dst)


if __name__ == '__main__':
    main()
