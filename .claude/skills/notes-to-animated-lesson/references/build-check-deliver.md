# Voice, build, check, render, deliver

Commands, the engine's API and its gotchas are in the toolkit's `TOOLKIT.md`; this file says what to do and why.

## Voice (narration first)

- `tts.py`: Kokoro (kokoro-onnx), voice `af_heart`, speed 1.0, one line at a time with its pause (0.45 s default, 0.8 to 1.1 s after a key idea, up to 1.4 s at a chapter end; `think` lines at least 2.5 s; `slow` lines at least 1.2 s). Every synthesis is cached per (voice, speed, text), so a re-run only re-voices what changed.
- Kokoro has no word timings: the text up to each `{anchor}` is synthesized on its own and its length is the anchor's time. Subtitle cues are timed the same way, per sentence.
- Spoken forms that work: Qwen → "Chwen", KL → "K L", LoRA → "Lora", DAgger → "dagger", 0.4 → "zero point four", T01 → "T zero one", Wq → "W q", 512 → "five hundred twelve"; big numbers spelled out in words. Captions keep the written form.
- Run TTS in the background and build against `fake_timing.py` meanwhile. Run one TTS at a time (a stale run once overwrote timing.js mid-test).
- Then make the animatic and get the person's go-ahead (`script-and-review.md`).

## Build

- One self-contained HTML page per episode from `build.py`. Start from `examples/demo/`; `examples/t02-scene.js` shows the guided-number helpers (per-cell `matrix()`, `wline()`, `flyIn()`/`flyC()`, `setVal()`, `stepTag()`, `fHl()`, `dot()`, trackers); `examples/ep06-scene.js` shows every drawing kit.
- Write a long scene in parts (one file per page under `parts/`, each with its own variable prefix), concatenated into `scene.js`. Before building: `node --check`, and confirm every `a('name')` and `bt('id')` exists in the script.
- Extend the scene 3 to 4 s past the voice for the zoom-out over the spread.

## Check

- **Contact sheets** (`shots.py`, one frame per line; `--full` for full-size and mid-motion frames of every new animation): labels on drawings, residue from earlier lines, off-page camera views, invisible objects, clipped text.
- **Overlap** (`overlap.py`): every visible label at each line's end, measured from the page; it reports label-on-label overlaps and labels running off the frame. Fix every hit. It doesn't see labels on drawings: that stays a job for the contact sheets.
- **Clutter** (`clutter.py`): windows with more than 2 movers; fix by staggering or grouping parts that move as one.
- **Density:** per chapter, each number arrives after its picture and its prediction; only the calculations that carry the argument are worked in full.
- **Numbers:** every number on screen matches the fact-check; run the worked examples in code at screen precision, rounding at each step as the screen does.
- **Flow:** every callback points to an earlier episode or chapter, matching the spine table.
- **Player:** play, a chapter chip, clock and voice agree, no page errors.
- **Extended cuts:** frames around every join, the takeaway readable 2 s before each cut, chapters, about −16 LUFS, cues never overlapping.

## Render

- `render.py EP k K` renders frame ranges in parallel. On 2 CPUs use 2 parts (about 4 frames/s each): a 15-minute episode takes about 50 minutes. Don't run TTS alongside. After a fix, re-render only the part whose frames changed.
- Wait on background jobs with a notification or an until-loop on a file, never on a self-matching `pgrep`.
- `mux.py`: voice through loudnorm (−16 LUFS), soft subtitles, chapters (the Intro merges into chapter 1), cut with `-t <video duration>`, never `-shortest`. Verify with ffprobe and ebur128, and pull two or three frames from the finished MP4.
- `cover.py`: 1280×720, a clean frame of the main picture on the left (`cover_crop`), the title on the right. Pick a moment with no label mid-write.
- **Extended cut** (`ext_cut.py`): each deep dive is its own scene ("DEEP DIVE" tab), rendered to its own MP4, joined after the chapter it extends: cut the main episode just before the camera leaves that chapter (next chapter's first line − 0.95 s), add a 1.5 s hold, resume at the same point. Drop the dive's Intro, prefix its chapters "Deep dive: <topic> · ", merge any under 10 s. A dive that comes last carries the end card.
- **File names:** each episode's outputs get their own slug (`margin-notes-NN-<title-slug>`, `-extended`, `-deep-dive-<topic>`), so renumbering never overwrites older files. Back up the previous version's script, scene and episode.json before a rebuild.

## Deliver

- The narrated player (`build.py EP --voice`) as an Artifact, republished to the episode's existing URL.
- The MP4 (soft subtitles, chapters) and .srt; the extended cut and its .srt when there is one; the cover.
- A YouTube text file per video: title, description, chapters (first at 0:00), and "the numbers on screen" (every worked value, with the toy's conventions), the supporting numbers and citations the main cut left out.
- Update the plan doc: build notes, deep-dive table, status block.
- **Delivery message:** what it is and how long; what to upload where; what changed from the approved script; anything that differs from the sources and why; one next step.
