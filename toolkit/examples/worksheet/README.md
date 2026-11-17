# Worksheet kit: math worked by hand that a viewer can follow

For any episode that works a computation by hand (a matrix product, attention, a layer). It came out of a viewer's notes on a rendered episode: "I can't tell where this value came from", "it makes the viewer memorize each value to figure out where in the process the row is coming from", and "formulas are hard to read, with underscores and no subscripts, and divisions on one line". Paste `worksheet.js` inside the scene's `build()`, after the standard helpers.

## What it gives you

| helper | what it does |
|---|---|
| `block(p, name, M, y0, o)` | a matrix in the worksheet column at the left: a typeset title (`X`, `Q`, `X_1`), its shape, one row per word in the word's colour. `.show(t)` writes it; `.hl(i, t, d, gname)` lights row `i` while a number made from it is written |
| `wsCol(fr, blocks)` | the column arrives with the page's frame as one thing (one grp), so it doesn't count as extra motion |
| `shapeStrip` / `frame3` | a strip of shapes under the loop strip (X 3 × 4 → … → M 3 × 4) that lights the current matrix, so the viewer always knows where in the process they are |
| `tx(p, src, x, y, z, c)` | typeset math (MathJax): real subscripts, stacked fractions, Kᵀ. Show it with `F()`, not `W()` |
| `Wb(m, t, d, id)` | writes a label so it has landed before line `id` ends (`late.py` checks this) |
| `ringM` | a clean outline to mark a number (a hand-drawn loop over digits is hard to read) |

`WCOL` and `SHAPES` are this series' choices: set your own.

## The rules it serves

- **Every computed number shows where it came from, on the same page.** The matrices so far stand in the column; when a number is written, the rows (and table column) it was made from light up. Nothing appears that the viewer has to remember from an earlier page.
- **One colour per word, everywhere:** its row of X, Q, K, V, its weights, its outputs.
- **Formulas are typeset, numbers are text.** `tx()` for anything with a subscript, a fraction or a transpose; plain digits stay in `label()`/`monoL()` so `ledger.py audit` can read them. `parts.py` fails a build that types `W_q`, `s_ij`, "/ √2" or "ᵀ" as plain text.
- **Put the column in the frame group** (`wsCol`), and give a row highlight the same grp as the number it explains: then `clutter.py` counts each as one thing.
- Leave the column off pages that compute nothing (an analogy, a sketch): it crowds the picture.
