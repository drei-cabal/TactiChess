# TactiChess website prototype

A responsive frontend demo for an ECLAT-powered chess tactics discovery website. The HTML entry point contains document metadata and page landmarks. `src/main.js` assembles the page from native JavaScript modules and starts the explorer. Styles remain in `src/styles/site.css`. No package installation or build tooling is required at this step.

## Open the prototype

See [Run TactiChess locally](docs/RUNNING.md) for prerequisites, VS Code instructions, and troubleshooting.

From the repository root, start a local HTTP server:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/` in a modern browser. Keep `index.html` and the entire `src/` directory together; native module imports require the local HTTP server. Opening the HTML directly as `file://` is unsupported. Stop the server with Ctrl+C.

## Working demo interactions

For frontend conventions shared by developers and AI agents, see [Code style](docs/CODE_STYLE.md).

- Select a chess tactic to change related patterns.
- Sort associations by lift, support, or confidence.
- Set a minimum support threshold.
- Filter sample puzzle positions by difficulty.
- Select associations and open modal chessboard previews.

## Important: sample data only

The association values in JavaScript `pairs`, and all board previews in `boards`, are illustrative and not the output of an ECLAT training run. The boards have not been validated as solvable chess puzzles.

## Integration status

Stages 1–5 are complete, and the genuine exports are already in `data/associations.json`, `data/puzzles.json`, and `data/metadata.json`. The website does **not** load them yet; ECLAT runs offline in Colab.

Asset extraction, readability cleanup, and a responsibility-based native-module split are complete. Navigation, introduction, explorer, project information, and preview markup are separate; demo data, board rendering, and dialog behavior have clear owners. See the [module map](docs/CODE_STYLE.md#current-module-map). The next separately approved step introduces Vite + React. Real associations, filtering, and static `preview_fen` boards follow in later approved steps.
