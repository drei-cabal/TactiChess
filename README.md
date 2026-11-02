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
- `src/features/`: introduction, explorer, demo previews, and project information.
- `src/styles/site.css`: existing design and responsive sticky header.
- `data/`: three frozen JSON exports, unchanged and not yet connected.
- `tests/`: demo selection and filtering contracts.

## Current checkpoint

Frontend migration Step 2 is complete: Vite + React now owns the existing design and interactions, including theme selection, sorting, support and difficulty filters, reset, and board previews. Exact dependency versions and transitive versions are recorded in `package.json` and `package-lock.json`.

The interface still displays explicitly labeled demo metrics and board layouts, including its preserved prototype branding. Genuine exports contain 20 themes, 48 directional rules, 34 pairs, and 506 puzzle entries. JSON loading and TactiChess branding belong to the separately approved Step 3; real filtering and static `preview_fen` boards follow later. The exports are not included in the current production bundle.

See [Development documentation](docs/DEVELOPMENT_DOCUMENTATION.md) for completed checks and remaining approval gates. No backend, accounts, database, or environment secrets are required.
