"""Margin Notes NN · <title>. Narration exactly as approved in the script doc.
{anchor} marks the word a visual lands on (unique across the episode). `say` = the spoken form when it differs from
the caption (pronunciations: Qwen -> "Chwen", KL -> "K L", LoRA -> "Lora", DAgger -> "dagger", DEXI 3 -> "Dexy three",
0.4 -> "zero point four"); cap and say must carry the same anchors in the same order.
pause: 0.45 default; 0.6 after an ordinary line, 0.8-1.1 after a key idea, 1.2-1.4 at a chapter end.
ch: starts a YouTube chapter at this beat (each chapter >= 10 s). A first beat without ch becomes the Intro,
which mux.py merges into chapter 1.
"""
B = lambda id, cap, say=None, pause=0.45, ch=None: dict(id=id, cap=cap, **({'say': say} if say else {}), pause=pause, **({'ch': ch} if ch else {}))
BEATS = [
    B('c0', "Margin Notes, a {title}toolkit test.", pause=1.2),
    B('c1_01', "A model gives every word piece a raw {score}score. A {softmax}softmax turns the scores into probabilities that {addup}add up to one.",
      pause=0.8, ch='Scores become probabilities'),
    B('c1_02', "The loss looks up the probability of the {right}right piece, and takes minus its {log}log.", pause=1.2),
    B('c2_01', "In code, that's one {line}line.", pause=0.6, ch='The code'),
    B('c2_02', "That's the {whole}whole test. Next: a real episode.", pause=1.4),
]

if __name__ == '__main__':
    import re, collections
    names = [n for b in BEATS for n in re.findall(r'\{(\w+)\}', b['cap'])]
    d = [n for n, c in collections.Counter(names).items() if c > 1]
    print(len(BEATS), 'beats', len(names), 'anchors', 'DUPLICATES:' if d else 'no duplicates', d)
