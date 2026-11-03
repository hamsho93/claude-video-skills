---
name: "notes-to-animated-lesson"
description: "Turn notes, research or a repo into a narrated Margin Notes animated lesson that makes the key ideas intuitive: one spine, guided numbers, apt analogies; fact-checked, voice-first, YouTube-ready."
---

# Notes to animated lesson

Use this when someone shares study notes (a Goodnotes link, PDF or photos), research write-ups or a repo and asks for an animated explainer, lesson or video: Margin Notes episodes, deep dives, extended cuts, "3Blue1Brown-style" requests.

The goal: a viewer leaves able to explain the idea to someone else, not able to recite its numbers.

This file is the map. Read a reference file only when you reach its step; don't load them all up front. They sit in `references/` beside this file; in a session without this repo, read them from the toolkit artifact's `skill/references/` folder.

| step | read |
|---|---|
| gather sources, fact-check | `references/sources-and-facts.md` |
| plan the series, find the episode's story | `references/series-and-story.md` |
| write the script (the teaching rules) | `references/teaching.md` |
| script doc, approvals, animatic, plan-doc editing | `references/script-and-review.md` |
| look, inks, motion | `references/look-and-motion.md` |
| voice, build, check, render, deliver | `references/build-check-deliver.md` and the toolkit's `TOOLKIT.md` |

## Start of every session

- **Toolkit:** this repo's `toolkit/` folder (copy it to a working folder and run `setup.sh`). Sessions without the repo load it from the Margin Notes Toolkit artifact (https://claude.ai/artifact/7GZp8w4w2bjXu2YxQH2q9c); when the toolkit or this skill changes, republish that artifact to the same URL. Never rebuild the engine from scratch.
- **Plan doc first** (the series plan in Claude Docs): its status block says what's built, open and next; its tabs hold the approved scripts; its season **review rules** bind every episode of the season. No plan doc yet: create one (see `script-and-review.md`).
- **The workspace can be wiped between sessions.** Anything not in an artifact, the plan doc, the repo or a delivered file is lost. Send deliverables as soon as they're checked.
- **One toy model per season, in one file** (e.g. `toy.py`); every number on screen comes from it. Before changing toy values, check what later episodes depend on them; fix readability by how the toy is explained first.
- **This skill is shared.** Improve it in a branch and a pull request so the other maintainers review it. Keep it lean: a new rule replaces or merges with an old one where it can, detail goes in the reference file for its step, and series-specific choices (names, inks) stay marked as choices.

## The workflow (gates in bold)

1. Gather the sources and fact-check every claim and number.
2. Plan the series order, then the episode: one question, one spine picture, 2 to 4 concepts.
3. Write the script as tables in the plan doc. **The person approves the script before anything is voiced.**
4. Voice it (`tts.py`) and make the animatic (`animatic.py`): the voice over one card per line. **The person listens before the build.** Pacing and "doesn't stick" problems are cheap to fix here.
5. Build the scene against the voice's timing.
6. Check: contact sheets, clutter, overlap, every number, then one viewer pass.
7. Render, mux, cover, YouTube text; publish the player; update the plan doc's status block.

When the person's notes on a built episode point at structure ("it doesn't stick", "concepts don't blend"), propose a rebuild of the script, not a patch.

## Core rules

These hold on every episode. Each is explained, with examples, in the reference for its step.

- **Understanding over coverage.** Pick the few key concepts; everything else goes to the description, the deep dive or the fact notes.
- **One spine per episode.** One question and one picture that each chapter changes (one table told three ways). An idea that doesn't change the spine picture belongs elsewhere.
- **Show the natural wrong guess first, then let it fail.** For each key concept, stage the obvious first try a smart newcomer would make, show where it breaks, then fix it. Clear explanation alone leaves viewers confident without learning.
- **Make the viewer predict, with real silence.** Ask on screen, leave at least 2.5 s (`think=True`), then answer. After one example worked aloud, give the viewer the next one as "your turn" before filling it in.
- **Turn a dial.** Once per episode, at the key concept, change one input and let every number after it update on screen.
- **Label each part of a formula by its job,** in plain words, while the formula is on screen as the map.
- **Picture, then name, then number. Real size, then the toy.**
- **Guide the eye through the numbers, and slow down for them.** Work in full only the calculations that carry the argument; one working line at a time; at most two numbers spoken per line; number lines voiced slower (`slow=True`).
- **The analogy and the math meet:** say the numbers in the analogy's words.
- **Label a thing by what made it** (x(word) until a matrix makes it q or k). Toy columns have no names or meanings.
- **Say training or inference up front,** and which step; keep the step strip lit.
- **One thing moving at a time; the screen forgets.** When the next idea arrives, the last one's labels leave.
- **The voice sets the clock.** Narration first, visuals timed to its words, each visual starting about 0.3 s before its word.
- **Made for public viewers.** Never show corrections of the source on screen; credits to the person's notes go in the plan doc only. Where the sources differ from the facts, say so privately.
- **Hook within 30 seconds, keep it near 9 minutes.** By 0:30 the viewer knows why to care. An episode much past ten minutes usually has two spines.

## Done means

- Every number matches the fact-check, and the worked examples run in code at screen precision.
- Overlap and clutter checks are clean, and the contact sheets show no residue, clipped text or labels on drawings.
- The viewer pass passes: each chapter changes the spine picture; each number could be predicted before it appears; there's a wrong guess, a prediction pause and a dial; and you can name the one image a viewer will remember in a month.
- Deliverables sent, player published to the episode's existing artifact, plan doc status updated.
