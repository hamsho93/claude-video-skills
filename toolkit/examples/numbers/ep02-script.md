# Episode 2 script (excerpt, for the number tools)

| ID | On screen | Narration | Flags |
|---|---|---|---|
| c2_01 | The sentence is written: "the river bank flooded". The word "flooded" is boxed, with an arrow to its bar. The bar is marked 0.11. | In our example sentence, the word that really came next was flooded. The model gave it 11 percent. | slow |
| c2_02 | Text: "last time: probability · the number softmax gives each word". The flooded bar is highlighted. | Last time we named that percent. It is the word's probability, the number the softmax gives it. | |
| c2_03 | Episode 1's two labels as a strip: "1 · a loss: one number for how wrong (today)" lit, "2 · gradient descent: turn the dials to make it smaller (Episode 3)" grey. | Last time we said a model needs two things: a loss function, and a rule that turns the dials to make it smaller. Today we build the first, and we choose it so that it works for the second. | |
| c2_04 | Back to the day-one flooded bar. Worked on screen: −ln(0.11) = 2.21. | On day one, that's minus ln of 0.11. The loss is 2.21. | slow |
| c2_05 | A yardstick: seven equal bars. Text: "an even guess: ln 7 = 1.95" and "perplexity 7: as unsure as a fair seven-way choice". | To read a loss, you need a reference. A model that spreads its probability evenly over all seven words scores ln 7, which is 1.95. Its perplexity, e to the loss, is 7: as unsure as a fair seven-way choice. | slow |

Build notes use other row starts, so the checker skips them:

| Card | What differs on screen |
|---|---|
| Card c2_04 | the minus sign is drawn, not written |
