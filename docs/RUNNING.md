# Run TactiChess locally

The frontend uses Vite + React. Development requires Node.js and npm; Python/PHP static servers cannot compile the source JSX. The built `dist/` folder contains static files and does not require a backend.

## Requirements

- Node.js `^20.19.0 || >=22.12.0`, matching the pinned Vite and React plugin requirements. Step 2 was checked with Node 24.13.0 and npm 11.6.2.
- A modern web browser.
- Internet access for the first dependency installation. No accounts, API keys, or `.env` file are needed.

Check the installed tools:

```powershell
node --version
npm.cmd --version
```

The commands below use `npm.cmd` to avoid PowerShell execution-policy problems with `npm.ps1`. On macOS/Linux, use `npm`.

## Install and start

Open the repository folder in VS Code, then open **Terminal > New Terminal**. Run from the folder containing `package.json`:

```powershell
npm.cmd ci
npm.cmd run dev
```

`npm ci` installs the exact lockfile versions. Repeat it after pulling dependency changes, rather than changing versions manually. Keep the lockfile; no global Vite installation is needed.

Open the local URL Vite prints, normally `http://127.0.0.1:5173/`. Keep the terminal running. Saving source files updates the page automatically. Stop the server with **Ctrl+C** in that terminal.

To choose a different port:

```powershell
npm.cmd run dev -- --port 5174 --strictPort
```

Without `--strictPort`, Vite chooses another available port when its default is busy. Always use the URL it prints. The scripts bind to the loopback address for local use.

## Test and build

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

- `test` runs data-integrity, loader, and association-selector tests using Node's built-in test runner.
- `build` writes the production assets to `dist/`.
- `preview` serves the most recent build, normally at `http://127.0.0.1:4173/`. Rebuild after source changes; preview does not rebuild automatically.

A successful build checks module imports and JSX compilation. Also exercise filters, reset, navigation, preview opening/dismissal and focus, loading/errors, and desktop/narrow layouts in the browser. There is no separate lint command at this checkpoint.

Do not open `index.html` using `file://`. To host a completed build elsewhere, serve the contents of `dist/`, not the source folder. Deployment and access protection remain separately approved steps; `vite preview` is for local verification.

## Current content

The design and responsive sticky header are preserved. The explorer fetches `/data/associations.json`, `/data/puzzles.json`, and `/data/metadata.json` once at startup. Their source files live in `public/data/`; production builds copy them byte-for-byte to `dist/data/`. Vite handles these static assets automatically, so there is no extra copying command or API server.

The explorer shows 20 themes and 48 frozen training-derived rules. The puzzle gallery now leads the page: a larger two-column gallery on desktop, with tactic selection, pair choices, evidence, and the pair explanation in a right-hand rail. Narrow layouts put the gallery first. Change tactics focuses the menu; Back to puzzles and each View puzzles action return focus to the gallery heading. Difficulty and example counts stay above the boards; longer help text follows the gallery. Initial/reset state is Fork, its first exported recommendation, and All difficulties. A labelled tactic menu lists all 20 themes with the selected definition directly below. The site uses the original ranking and fixed 0.20% minimum support; Explorer no longer exposes frequency or sorting controls. The selected pair offers optional evidence under Why are these tactics paired?, with original counts, support to three decimal places, confidence to two, and lift to two with a multiplier sign. Difficulty controls sit beside the puzzles and never recalculate metrics.

Matching examples explain the selected pair using genuine tags and existing theme definitions, with a short side-to-move task on each card. These are tag-based descriptions, not authored explanations of the solution moves. Examples retain their genuine puzzle IDs, ratings, and difficulty labels. All/Easy/Medium/Hard filters preserve export order and show the matching count against the full pair total. Easy includes ratings up to 1200, Medium includes 1201-1800, and Hard starts at 1801. These filters never change association support, confidence, lift, or counts. Each card now renders its genuine `preview_fen` as a static SVG board and keeps its original Lichess URL. The moving side is at the bottom. Enlarge board opens a native dialog with a larger board and an expandable piece-location list; Escape, Close, Back to explorer, or a backdrop click dismisses it and restores focus. The hero uses a real exported position and matching caption. Puzzle details reveals the original ID and readable tag labels. Cards emphasize difficulty and side to move; Solve on Lichess retains the original external link. How to use explains the beginner path, with optional research/statistics details. No fabricated associations or positions are used as a loading/error fallback. Moves are disabled; solve puzzles on Lichess.

If a JSON file is missing, malformed, or fails validation, Home, Explorer, and About show an error with **Reload page**. Restore the original export and reload. Do not repair counts or metrics by editing the JSON. The tests protect the original SHA-256 hashes. A production build can compile even when data is missing, so run both tests and browser checks.

How to use follows the current gallery-first interface: choose an example, enlarge the preview, and solve on Lichess. Separate guidance covers Change tactics, View puzzles, Back to puzzles, Reset to Fork, and puzzle-card labels. Statistics and research formulas stay in an optional native disclosure. Open Explorer links lead to the existing gallery without resetting its selection.

Themes opens `#/themes`, a scrollable library of all 20 exported themes. Every beginner explanation and recognition prompt is visible immediately, grouped into Tactical motifs, Advanced ideas, Checkmate patterns, and Special moves using Lichess category membership. Category buttons jump to the corresponding heading without filtering or hiding descriptions. Cards use two columns on desktop and one on narrow screens. Each card offers an optional View 2 board examples disclosure; boards are mounted only while that disclosure is open. Examples remain two distinct lower-rated exported puzzles for the theme's curated pairs. Enlarge board opens a larger static preview with position details and Back to theme library. Theme tags may describe later moves in the solution; the guide does not annotate or reveal solution moves. Original board positions, puzzle links, and research metrics remain unchanged.

About introduces the project and Lichess source first, explains the four genuine dataset counts, and keeps practical limitations visible. View the research details expands the original sample/split counts, method, thresholds, and metadata limitations. Chessboard and artwork credits remain in a labelled section with the original license links.

## Chessboard assets

The installed `cm-chessboard@8.15.4` supplies the renderer and CSS. `public/chess/standard.svg` is the verified Wikimedia sprite copied unchanged from that package; Vite copies it and `public/licenses/` into the build. The About page gives attribution. Do not replace it with the separately licensed Staunty set or reformat the third-party asset/notice files.

Missing artwork produces a readable position fallback, not a fake board. Restore `public/chess/standard.svg` from the approved pinned package, rebuild if using preview, and reload. The asset request is shared during one page session, including failures; reloading retries it. JSON is still loaded once independently of filtering and previews.

## Browser regression checks

After `npm.cmd test` and `npm.cmd run build`, use the production-preview URL:

1. Visit Home, Explorer, Themes, Method, and About; refresh a page, use browser Back/Forward, and check the active navigation link. Explorer selections and open theme-library disclosures should survive page navigation.
2. Use the tactic menu, select different pairs, and try every difficulty. Verify that pair descriptions, matching examples, and selected evidence update together while metrics stay unchanged; then reset to Fork.
3. Use the keyboard for the skip link, tactic menu, pair buttons, evidence disclosure, difficulty controls, and previews. Check visible focus. Open a description, dismiss with Escape/Close/Back/backdrop, and check focus returns to the opener.
4. Check 320px, 390px, tablet, and desktop widths, including long theme names. Keep the header sticky and avoid horizontal scrolling. Check the browser's reduced-motion preference.
5. Compare white- and black-to-move positions with the export; the moving side belongs at the bottom. Verify the supplied Lichess links and About artwork notices.
6. To simulate failures, use browser developer tools request blocking or local response overrides for `/data/*.json` and `/chess/standard.svg`; leave source exports unchanged. Check loading/error messages or the position-description fallback, remove the override, then reload.
7. In Themes, scroll through all 20 descriptions and use the four category jumps. Confirm keyboard focus reaches the category heading below the sticky header. Open and close optional board examples by mouse and keyboard; check both genuine positions, preview dismissal, library return text, and restored focus on desktop and narrow screens.

Step 6 used temporary axe-core 4.14.0 scans without adding a project dependency. Repeat an accessibility scan after UI changes, then review results that require human judgment. Automated scans do not replace manual screen-reader, device, or other-browser testing. The actual results and limits are recorded in [Development documentation](DEVELOPMENT_DOCUMENTATION.md).

## Troubleshooting

| Symptom                                              | Action                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `node` or `npm.cmd` is unavailable                   | Install a supported Node.js version, reopen the terminal, and check the versions.          |
| PowerShell blocks `npm.ps1`                          | Use the documented `npm.cmd` commands.                                                     |
| Vite is missing or imports fail                      | Run `npm.cmd ci` from the repository root.                                                 |
| Node version is unsupported                          | Upgrade to a version matching the requirement above.                                       |
| Port is busy                                         | Use the URL Vite prints or choose a port with `--port`.                                    |
| Browser cannot connect                               | Keep the server running and use its exact local URL.                                       |
| Page is blank when opened directly or through Python | Start Vite and open its HTTP URL.                                                          |
| Explorer reports invalid or missing data             | Restore the original three files in `public/data/`, rebuild if using preview, then reload. |
| Preview shows an older change                        | Run `npm.cmd run build` again, then reload.                                                |

`node_modules/` and `dist/` are generated and ignored by Git. Dependency versions are pinned intentionally; report incompatibilities before replacing them.
