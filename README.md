# TacticPair website prototype

A responsive, self-contained frontend demo for an ECLAT-powered chess tactics discovery website. No build tools, server, dependencies, or authentication are required.

## Open the prototype

Open `index.html` in a modern browser. Deploy the same file using GitHub Pages if you wish.

## Working demo interactions

- Select a chess tactic to change related patterns.
- Sort associations by lift, support, or confidence.
- Set a minimum support threshold.
- Filter sample puzzle positions by difficulty.
- Select associations and open modal chessboard previews.

## Important: sample data only

The association values in JavaScript `pairs`, and all board previews in `boards`, are illustrative and not the output of an ECLAT training run. The boards have not been validated as solvable chess puzzles.

## Connect your Google Colab work

1. In Colab, parse the Lichess puzzle data and build transactions from the puzzle theme tags.
2. Execute ECLAT, validate itemset supports and derive rule confidence and lift.
3. Export a JSON with selected themes, pattern metrics, and real puzzle IDs/FEN positions.
4. Replace the `pairs` demo object with the generated association data.
5. Replace `boards` with data parsed from real Lichess FENs and connect verified practice links.
6. Make the UI show the actual dataset size, sampling method, thresholds, and mining date.

The current prototype is purely a UI demonstration. A trained model has **not** been connected.
