# TactiChess code style

Use this guide when editing the frontend, whether you are a developer or an AI agent. Read the local `AGENTS.md` and the current checkpoint in [Development documentation](DEVELOPMENT_DOCUMENTATION.md) before making changes. For startup instructions, see [Running the project](RUNNING.md).

Codex must also read and follow [Version control](VERSION_CONTROL.md) before starting a task or performing Git operations. It defines branch handling, staged review, commits, pull requests, recovery, and approval gates. Permission to edit files does not authorize Git mutations or deployment.

## Shared formatting

The root `.prettierrc.json` defines the formatting rules:

- Use two spaces for indentation, with no tabs.
- Save UTF-8 files with LF line endings and a final newline.
- Aim for 100 characters per line. Wrap long attributes, calls, and expressions.
- Use single quotes in JavaScript and double quotes for HTML attributes.
- Use semicolons in JavaScript and trailing commas where the formatter adds them.
- Separate functions and related sections with a blank line.

Use the same conventions for JSX. Component files use the `.jsx` extension.

## HTML and JSX

- Keep `index.html` limited to metadata, the React mount point, a no-JavaScript message, and the entry script.
- Use JSX components for page markup. React owns rendered elements; do not rebuild them with `innerHTML`, `dangerouslySetInnerHTML`, or manual class changes.
- Use `className`, camelCase DOM properties, and style objects where existing inline styles must be preserved.
- Put long attribute lists on separate lines and indent children inside their parents.
- Preserve IDs, CSS classes, visible wording, and page landmarks during structural changes.
- JSX trims some line-break whitespace. Use explicit `{' '}` where inline text needs a space. Keep the existing joined brand text joined.

## JavaScript and React

Keep `src/main.jsx` focused on mounting React in Strict Mode and importing styles. `App.jsx` composes page sections. Use PascalCase component names, camelCase variables, and ordinary props and callbacks.

- Give functions action names and use project terms for variables.
- Use braces for conditionals, including single-statement branches.
- Keep pure selection logic separate from rendering and browser effects.
- The explorer owns selection state. Derive visible lists from that state instead of storing duplicate arrays.
- Update state immutably, using functional updates when the next value depends on the previous value.
- Give mapped components stable domain keys so controls retain focus.
- Handle control events through JSX props. Use effects only for browser integration, and clean up listeners, focus, and scroll locks.
- Render only validated exports for associations, counts, and positions. Always pass `preview_fen` to boards; keep links exactly as exported.
- Keep components together when they share one responsibility. Split only genuine boundaries; do not extract every decorative element.

## Current module map

| Module                                           | Responsibility                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| `src/main.jsx`                                   | Mount React; start one dataset-loading operation outside effects.           |
| `src/App.jsx`                                    | Compose page sections and accessible loading/error states.                  |
| `src/navigation.js`                              | Native hash-page definitions and navigation subscription.                   |
| `src/components/SiteNavigation.jsx`              | Header and footer.                                                          |
| `src/data/load-dataset.js`                       | Fetch the three static exports; report network/JSON failures.               |
| `src/data/validate-dataset.js`                   | Validate fields, numeric contracts, references, and totals once.            |
| `src/features/introduction/Introduction.jsx`     | Hero and source context.                                                    |
| `src/features/method/MethodPage.jsx`             | Exploring steps and metric explanations.                                    |
| `src/features/about/AboutPage.jsx`               | Dataset, source, licenses, and provenance.                                  |
| `src/features/library/ThemeLibrary.jsx`          | Scrollable theme descriptions by category, with optional board examples. |
| `src/features/library/theme-catalog.js`          | Learning copy, Lichess category membership, and distinct lower-rated examples. |
| `src/features/explorer/Explorer.jsx`             | Puzzle-first layout, pair context, shared selection/preview state, and fixed metrics.     |
| `src/features/explorer/ExplorationFilters.jsx`   | Controlled tactic menu, selected definition, and reset.                   |
| `src/features/explorer/AssociationList.jsx`      | Directional rules and genuine training metrics/counts.                      |
| `src/features/explorer/PuzzleExamples.jsx`       | Difficulty controls, genuine puzzle cards, links, counts, help, and empty states.             |
| `src/features/puzzles/PuzzleTags.jsx` | Readable puzzle-tag labels and expandable puzzle identifiers/details. |
| `src/features/puzzles/StaticBoard.jsx`           | Library lifecycle, static SVG, and accessible piece-location description.   |
| `src/features/puzzles/PuzzlePreviewDialog.jsx`   | Native modal, dismissal, focus, and scroll-lock cleanup.                    |
| `src/features/explorer/association-selectors.js` | Pure rule/example filtering, sorting, defaults, and selection fallback.     |
| `public/data/`                                   | Original JSON exports copied unchanged into production output.              |
| `tests/dataset.test.js`                          | Original hashes, data contracts, rankings/exclusions, and loading failures. |
| `tests/association-selectors.test.js`            | Nonmutating selection and sorting contracts.                                |
| `vite.config.js`                                 | Standard Vite React plugin setup.                                           |

`main.jsx` passes loading, success, or failure status into `App`. Only a completely validated dataset reaches the explorer; loading never silently falls back to demo associations. Components receive the original JSON objects through props. Pure selectors have no DOM, fetch, or React dependencies. Keep dependency direction explicit and interfaces small.

Use native `fetch` and Vite's public directory. Do not add schema libraries, generic repositories, dependency-injection frameworks, or duplicated data copies for these three fixed exports. Startup validation checks consistency; it does not mine, tune, or replace metrics.

## CSS

- Put one declaration on each line, with a space after the colon.
- Indent rules inside media queries by two spaces.
- Keep related selectors together and use short section comments for navigation.
- Preserve selector order, declaration order, specificity, and responsive breakpoints when formatting. Reordering rules can change the design.
- Reuse the existing class names and color variables.

## Brief comments

Explain a reason, limitation, or section in simple words. Do not describe every obvious statement or leave commented-out code.

Examples:

```js
// Start once per page load, outside Strict Mode component effects.
```

```css
/* Explorer filters */
```

Keep comments accurate. The hero and example boards use genuine exported positions; do not describe them as demo arrays.

## Format and verify

1. In VS Code, use the existing Prettier extension and **Format Document** (**Shift+Alt+F** on Windows). It reads the root project configuration.
2. Format only changed source files. `.prettierignore` excludes frozen exports, local agent instructions, generated output, and the lockfile. Do not install another formatter just for a small edit.
3. From the repository root, run:

   ```powershell
   npm.cmd test
   npm.cmd run build
   git diff --check
   ```

4. Run `npm.cmd run dev` for interactive checks. After building, run `npm.cmd run preview` to check the production output. Check the tactic menu, pair selection and descriptions, rating filtering, reset, loading/error recovery, keyboard focus, and desktop/narrow layouts. Check preview orientation, position descriptions, native-dialog focus, and original practice links. See [Running the project](RUNNING.md).
5. Review the diff and update the existing development record with actual checks and limitations. Preserve unrelated user edits.

Node's built-in runner tests pure logic; Vite validates JSX and module compilation. There is no separate lint command or project-installed formatter. Do not describe these checks as a complete accessibility audit or physical-device test.

## Frozen data and approval boundaries

Leave every byte in `public/data/associations.json`, `public/data/puzzles.json`, and `public/data/metadata.json` unchanged during formatting and structural refactors. ECLAT stays offline; boards use `preview_fen` and the supplied `puzzle_url`.

Step 5 authorized the exact `cm-chessboard@8.15.4` dependency, unchanged Wikimedia `standard.svg`, static previews, native preview dialog, and original Lichess links. Move input and board animations remain disabled. `StaticBoard` gives the library exclusive ownership of its ref container; React owns the surrounding labels and accessible description. Effects must destroy boards and clean up modal listeners, focus, and scroll locks during Strict Mode and unmounts. Use the library's position model and English piece names rather than building a chess engine or a second FEN renderer.

Never render `original_fen`, display solution moves, or replace missing artwork with a fabricated board. Keep the accessible position description and real link available on artwork failure. The original artwork and notices in `public/chess/` and `public/licenses/` are formatter-excluded and verified by tests. Preserve attribution on About and the distributed license notices.

Frontend migration Steps 1-6 are complete locally. Further dependency changes, Git mutations, and deployment require their own approvals. Filtering must never mutate the exports or recalculate global metrics. Agents must report only checks actually run.
