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

## Structure

- `index.html`: document metadata and React mount point.
- `src/main.jsx` and `src/App.jsx`: startup and page composition.
- `src/components/`: header and footer.
- `src/features/`: introduction, explorer, and project information.
- `src/styles/site.css`: existing design and responsive sticky header.
- `src/data/`: one-time loading and boundary validation.
- `public/data/`: three unchanged frozen JSON exports, served at `/data/`.
- `tests/`: frozen-data integrity, loader failures, and association-selection contracts.

## Current checkpoint

Frontend migration Step 3 is complete. The application loads the three exports once at startup and validates them before showing 20 themes, 48 directional rules, 34 curated pairs, and 506 pair-specific puzzle entries. Support, confidence, lift, and training counts come directly from the frozen exports. Missing or invalid files show an accessible error and a page-reload action.

The JSON files moved byte-for-byte from `data/` to `public/data/`; Vite serves them at the same `/data/*.json` URLs and copies them unchanged into `dist/data/`. Keep them out of source imports and never reformat or regenerate them. The lockfile and dependency versions are unchanged.

The initial/reset selection is Fork and its first curated recommendation, with minimum support 0.20% and curated export order. Existing association controls work with the real values. Rating controls are explicitly disabled while puzzle previews are pending. Synthetic practice cards and their demo associations have been removed. The hero retains its explicitly labeled decorative board until the approved real-preview step.

Step 4 will complete rating-based example filtering and selection behavior; Step 5 will add genuine static `preview_fen` boards and unchanged Lichess links. Neither step, Git commits, pushes, nor deployment is authorized by Step 3.

See [Development documentation](docs/DEVELOPMENT_DOCUMENTATION.md) for completed checks and remaining approval gates. No backend, accounts, database, or environment secrets are required.
