# TactiChess

A static chess tactic association explorer built with Vite, React, JavaScript/JSX, and ordinary CSS. ECLAT runs offline in Colab; this website does not run mining or a chess engine.

## Run locally

Install Node.js matching `^20.19.0 || >=22.12.0` (verified with 24.13.0), then run from the repository root:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173/`. On macOS/Linux, use `npm` instead of `npm.cmd`. See [Running the project](docs/RUNNING.md) for production-preview commands and troubleshooting.

## Check changes

```powershell
npm.cmd test
npm.cmd run build
```

Tests use Node's built-in test runner. There is no separate lint command. Follow [Code style](docs/CODE_STYLE.md) for formatting, component responsibilities, and browser checks.

Follow [Version control](docs/VERSION_CONTROL.md) for branches, staged reviews, commits, pull requests, and safe recovery.

## Structure

- `index.html`: document metadata and React mount point.
- `src/main.jsx` and `src/App.jsx`: startup and page composition.
- `src/components/`: header and footer.
- `src/features/`: introduction, explorer, static previews, and project information.
- `src/styles/`: site design, page layout, and static chessboard styles.
- `src/data/`: one-time loading and boundary validation.
- `public/data/`: three unchanged frozen JSON exports, served at `/data/`.
- `public/chess/` and `public/licenses/`: the unchanged Wikimedia sprite and its attribution/license notices.
- `tests/`: frozen-data integrity, loader failures, and association-selection contracts.

## Current checkpoint

Frontend migration Steps 1-6 are complete locally. The application loads the three exports once at startup and validates them before showing 20 themes, 48 directional rules, 34 curated pairs, and 506 pair-specific puzzle entries. Support, confidence, lift, and training counts come directly from the frozen exports. Missing or invalid files show an accessible error and a page-reload action.

The JSON files moved byte-for-byte from `data/` to `public/data/`; Vite serves them at the same `/data/*.json` URLs and copies them unchanged into `dist/data/`. Keep them out of source imports and never reformat or regenerate them. Dependency versions are pinned in the retained lockfile.

The initial/reset selection is Fork and its first curated recommendation, with minimum support 0.20% and curated export order. Association controls and rating filters use the real values. All/Easy/Medium/Hard filter examples only, and the matching IDs, ratings, and bands appear in export order. Genuine static boards use `preview_fen` exclusively, with the side to move at the bottom. Each card offers a larger native-dialog preview, a readable piece-location description, and the unchanged Lichess practice link. The hero features the first exported example for Fork's first curated recommendation.

Difficulty bands are Easy at 1200 or below, Medium at 1201-1800, and Hard above 1800. Selection stays on a visible association; otherwise it falls back to the first visible rule. Reset restores every control. Final local QA covered navigation, filters, genuine boards, keyboard/dialog behavior, error recovery, and responsive layouts. No playable board or chess engine is included. Git mutations and deployment remain separately gated.

The final check passed 38 unit tests, the production build, and 26 axe-core accessibility scans with no reported violations. Browser checks used isolated headless Chrome; manual screen-reader, physical-device, and other-engine checks remain unverified. See [Development documentation](docs/DEVELOPMENT_DOCUMENTATION.md) for the evidence and remaining approval gates. No backend, accounts, database, or environment secrets are required.

## Chessboard and artwork

`cm-chessboard` **8.15.4** renders static SVG positions with move input and animations disabled. Its code is MIT licensed. The copied `standard.svg` is the Wikimedia artwork by Cburnett and Rfc1394, adapted by Stefan Haack, under **CC BY-SA 3.0**. Its original embedded attribution is retained. The About page links to the [artwork notices](public/licenses/chess-artwork.txt) and [renderer license](public/licenses/cm-chessboard-MIT.txt). The Staunty artwork is not used.

If artwork cannot load, the page keeps an accessible position description and the real practice link. Restore the supplied asset and reload; never substitute a fabricated position.
