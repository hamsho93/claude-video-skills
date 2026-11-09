# Episode 1 script (excerpt, for the number tools)

| ID | On screen | Narration | Flags |
|---|---|---|---|
| c1_01 | After "the river bank", a list of possible next words appears, each with a bar, all bars adding to 100%. A label: "a probability for every word". | The answer is not one word. It is a probability for every word it knows. Each one is between zero and one, and together they add up to 100 percent. | |
| c1_02 | Under the words, a row of blank slots labeled "logits". An arrow labeled "softmax" leads to the bars. | Inside, the last layer first produces one raw number for each word. Those are called logits. A function called softmax turns the logits into probabilities. We do that arithmetic in Episode 2. | |
| c1_03 | Two labels appear: "1 · a loss: one number for how wrong" and "2 · gradient descent: turn the dials to make it smaller". | To fix that we need two things. A loss function: one number that says how wrong an answer is. And a rule that turns the dials to make that number smaller. The usual rule is gradient descent, and using it on the dials is called training. | |
