# Margin Notes

A shared skill and build kit for narrated, hand-drawn animated lessons ("Margin Notes" episodes): one spine per episode, guided numbers, apt analogies; fact-checked, voice-first, YouTube-ready.

## What's here

| path | what it is |
|---|---|
| `.claude/skills/notes-to-animated-lesson/` | the skill: `SKILL.md` (the map and the core rules, read every session) and `references/` (one file per step, read only at that step). Loads automatically in any Claude session that has this repo attached. |
| `toolkit/` | the build kit: the SVG engine and drawing kits, the player, and the Python pipeline (voice, build, checks, render, mux, cover, extended cuts). `toolkit/TOOLKIT.md` is its guide. |
| `toolkit/examples/` | a starter episode (`demo/`), the full episode 06 scene, and the T02 scene and script (the guided-number style). |
| `season-transformers/` | the Transformers season's toy model (`toy.py`, one ledger for all eight episodes) and the T02 sources. |

## Using it

1. Attach this repo to a Claude session (Claude Code, or "add repository" in the Claude app). The skill loads on its own; say what you want to make and it takes over.
2. The session copies `toolkit/` to a working folder and runs `setup.sh` (Kokoro voice model, fonts, MathJax, Playwright). Chromium must be available.
3. Scripts are approved in a plan doc before anything is voiced or built. The skill says how.

## Maintaining it together

- The skill folder is the single source. Change it in a branch and open a pull request; a one-line summary of what the session learned and why is enough.
- Keep it lean, so a session's context isn't spent on the skill: `SKILL.md` holds only the workflow and the rules that apply to every episode (aim to stay under about 1,500 words); detail goes in the reference file for its step; a new rule replaces or merges with an old one where it can.
- Pipeline fixes go in `toolkit/py` or `toolkit/web`, with the gotcha noted in `toolkit/TOOLKIT.md` (commands and engine notes live there, not in the skill).
- The season review rules in `references/script-and-review.md` are a template; a new series writes its own list in its plan doc.
- Don't commit rendered video, voice caches or `out/` folders (see `.gitignore`).
