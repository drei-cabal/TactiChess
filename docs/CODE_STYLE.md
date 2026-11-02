# TactiChess code style

Use this guide when editing the frontend, whether you are a developer or an AI agent. Read the local `AGENTS.md` and the current checkpoint in [Development documentation](DEVELOPMENT_DOCUMENTATION.md) before making changes. For startup instructions, see [Running the project](RUNNING.md).

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
- The explorer owns selection and preview state. Derive visible lists from that state instead of storing duplicate arrays.
- Update state immutably, using functional updates when the next value depends on the previous value.
- Give mapped components stable domain keys so controls retain focus.
- Handle control events through JSX props. Use effects only for browser integration, and clean up listeners, focus, and scroll locks.
- Keep demo content clearly labeled until genuine integration is approved.
- Keep components together when they share one responsibility, such as `PuzzleList` and its local `PuzzleCard`. Do not extract decorative elements into separate files.

## Current module map

| Module                                         | Responsibility                                             |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `src/main.jsx`                                 | Mount React and import the stylesheet.                     |
| `src/App.jsx`                                  | Compose page landmarks and sections.                       |
| `src/components/SiteNavigation.jsx`            | Header and footer.                                         |
| `src/features/introduction/Introduction.jsx`   | Hero and source context.                                   |
| `src/features/about/ProjectInfo.jsx`           | Method and project information.                            |
| `src/features/explorer/Explorer.jsx`           | Shared explorer/preview state and feature composition.     |
| `src/features/explorer/ExplorationFilters.jsx` | Controlled theme, difficulty, and support inputs.          |
| `src/features/explorer/AssociationList.jsx`    | Association buttons and demo metrics.                      |
| `src/features/explorer/demo-data.js`           | Unchanged demo themes, associations, and board arrays.     |
| `src/features/explorer/demo-selectors.js`      | Pure filtering, sorting, defaults, and selection fallback. |
| `src/features/puzzles/PuzzleList.jsx`          | Demo example selection and cards.                          |
| `src/features/puzzles/DemoBoard.jsx`           | Render an existing position array as squares.              |
| `src/features/puzzles/PuzzlePreviewDialog.jsx` | Preview portal, dismissal, focus, and scroll-lock cleanup. |
| `tests/demo-selectors.test.js`                 | Demo state and selector contracts.                         |
| `vite.config.js`                               | Standard Vite React plugin setup.                          |

Dependencies flow from page composition to features and their focused components. The preview receives selection through props, and the board receives a position array. Pure selectors have no DOM or React dependencies. Do not add classes, inheritance, generic loaders, or dependency-injection frameworks merely to claim SOLID compliance.

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
// Listen on the container because its buttons are rebuilt.
```

```css
/* Explorer filters */
```

Keep comments accurate. The current arrays are demo content; they must not be described as genuine mined output.

## Format and verify

1. In VS Code, use the existing Prettier extension and **Format Document** (**Shift+Alt+F** on Windows). It reads the root project configuration.
2. Format only changed source files. `.prettierignore` excludes frozen exports, local agent instructions, generated output, and the lockfile. Do not install another formatter just for a small edit.
3. From the repository root, run:

   ```powershell
   npm.cmd test
   npm.cmd run build
   git diff --check
   ```

4. Run `npm.cmd run dev` for interactive checks. After building, run `npm.cmd run preview` to check the production output. Check themes, sorting, filters, reset, previews, dismissal, keyboard focus, and desktop/narrow layouts. See [Running the project](RUNNING.md).
5. Review the diff and update the existing development record with actual checks and limitations. Preserve unrelated user edits.

Node's built-in runner tests pure logic; Vite validates JSX and module compilation. There is no separate lint command or project-installed formatter. Do not describe these checks as a complete accessibility audit or physical-device test.

## Frozen data and approval boundaries

Leave every byte in `data/associations.json`, `data/puzzles.json`, and `data/metadata.json` unchanged during formatting and structural refactors. ECLAT stays offline; real board integration will use `preview_fen` and the supplied `puzzle_url`.

Step 2 authorized the pinned React/Vite dependencies and component migration only. JSON integration (Step 3), genuine filtering, real boards, additional packages, staging or commits, pushes, and deployment require their own approvals. Agents must follow the currently approved scope and report only checks actually run.
