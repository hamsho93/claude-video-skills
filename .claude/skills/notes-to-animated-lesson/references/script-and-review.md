# Script, review and the plan doc

## The plan doc

- One Claude Docs doc per series: a **status block** (built, open, next, where the toolkit lives), the season map, how the season builds, the spine table, arcs, the season's **review rules** (template below), episode outlines, and one tab per episode script.
- Update the status block at the end of every session, so a fresh session can pick up.
- Credits to the person's notes, and where the script differs from them, live here, never on screen.

## The script, as tables

- One table per chapter: line #, narration, on screen. Head each chapter with its key concept, its picture or analogy, its yardstick, its natural wrong guess, and which numbers are worked in full versus named.
- Mark with `{anchor}` the word each visual lands on; give a spoken form when it differs from the caption. Mark number lines **slow**, question lines **think**, and give each line a few words of "on screen" (it becomes the beat's `see` and shows on the animatic).
- Per version (v1, v2, ...), add a **what changed and why** table (change, the note that caused it, the lines), a **checked against your notes** table (page, what it says, where the script carries it, where it differs on purpose), and a **season rules in this episode** table.
- **The person approves the script before anything is voiced.** For a new style or a big rewrite, build one chapter as a pilot first (a two-page pilot settled the T02 guided-number style in one round).
- A rebuild replaces the tab's script sections and keeps earlier build notes under an "Earlier builds" heading.

## The animatic checkpoint

After approval, voice the script (`tts.py`) and run `animatic.py`: the voice over one card per line (chapter, line, narration, on-screen note), about 1.5 minutes to make for a 15-minute episode. Send it and ask the person to listen before the build. Listen for: a chapter that drags, numbers that come too fast, a question with no pause, a line that's hard to follow by ear. Fix the script and re-voice (only changed lines are re-synthesized); then build.

## After a build

Add build notes to the tab: where the screen differs from the approved tables, and what was checked.

## Editing Claude Docs

- Read a long tab once, save the JSON result, and extract block ids and hashes with a script. Find-by-quote fails on text that carries markdown markers, so target blocks by id with `ifHash` and `ifRev` from that read.
- Use an outline read to see the tab's top-level blocks before a restructure; delete and insert by block id.
- Replacing a paragraph drops its bold; re-apply `**...**` in the new text.

## Season review rules (template; copy into a new season's plan doc and adapt)

1. Say training or inference, and which step.
2. Real size first, then the toy.
3. Work in full the calculations that carry the argument; name the rest and point to where they were worked.
4. Name things before using them, and label a thing by what made it (x(word) until a matrix has made it q or k).
5. Show where every number comes from.
6. Guide the eye through the numbers: one row of boxes changing in place, one example aloud then "your turn", the formula on top as the map with each part labelled by its job, zeros greyed, one working line at a time, at most two numbers spoken per line, number lines slowed.
7. No meanings for toy columns; the toy stands for a model partway through training; read meaning against rows the viewer knows.
8. One spine per episode; the natural wrong guess before the fix; predict before you compute, with a real pause; one dial.
