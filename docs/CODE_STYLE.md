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

Use the same conventions for JSX when the separately approved React migration begins.

## HTML and templates

- Keep `index.html` limited to document metadata, page landmarks, the no-JavaScript message, and the module entry point. Page-section markup belongs to the corresponding view module.
- Indent children inside their parent elements.
- Put long attribute lists on separate lines.
- Expand large HTML template strings so their nesting is visible.
- Preserve element IDs, classes, attributes, and visible wording during formatting work.
- Check whitespace around inline text. A line break between words or inline elements can add a visible space. Use a narrowly placed `<!-- prettier-ignore -->` when text must stay joined, as with the existing brand name.

HTML formatting is configured to expand nested elements. Review screenshots after formatting; the formatter does not know the display rules in the external stylesheet.

## JavaScript

Keep `src/main.js` focused on composing the page and starting features. Within a feature, keep state and lookups before rendering functions and event listeners. Demo content belongs in its own clearly labeled module.

- Give functions action names and use project terms for variables.
- Use braces for conditionals, including single-statement branches.
- Put separate operations on separate lines.
- Keep functions focused and use early returns when they make the flow clearer.
- During readability-only changes, preserve calculations, event behavior, defaults, and data.
- Keep generated markup readable without adding a template library solely for formatting.

For the planned React migration, use PascalCase component names, camelCase variables, and ordinary props and callbacks. Introduce React files only in the approved migration step.

## Current module map

| Module                                           | Responsibility                                                 |
| ------------------------------------------------ | -------------------------------------------------------------- |
| `src/main.js`                                    | Compose the page and connect feature entry points.             |
| `src/components/site-navigation.js`              | Header and footer navigation markup.                           |
| `src/features/introduction/introduction-view.js` | Hero and source-context markup.                                |
| `src/features/about/project-info-view.js`        | Method and project-information markup.                         |
| `src/features/explorer/explorer-view.js`         | Explorer controls and result-panel markup.                     |
| `src/features/explorer/explorer.js`              | Explorer state, list rendering, filters, and related events.   |
| `src/features/explorer/demo-data.js`             | Existing demo themes, associations, and board arrays.          |
| `src/features/puzzles/demo-board.js`             | Pure rendering of an existing demo board array.                |
| `src/features/puzzles/puzzle-preview.js`         | Preview markup, opening, dismissal, focus, and scroll locking. |

Apply single responsibility through these feature boundaries. Views contain trusted, local markup; the explorer owns its state; the board renderer receives a position; the dialog owns its own events. The explorer receives only an `openPreview` callback, so it does not need to know the dialog's DOM structure. The dialog receives its board renderer rather than importing explorer state.

Keep imports explicit and dependencies one-way. Do not add classes, inheritance, interfaces, generic loaders, or a component framework just to claim SOLID compliance. The current function-based design has no subtype hierarchy that needs a substitution contract. The approved React migration remains a later step.

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

1. In VS Code, use the Prettier extension and **Format Document** (**Shift+Alt+F** on Windows). Select Prettier if asked which formatter to use. It reads the project configuration.
2. Format the frontend files you changed. `.prettierignore` excludes the frozen `data/` exports and local agent instructions; keep those exclusions in place.
3. Check JavaScript syntax and patch whitespace from the repository root:

   ```powershell
   Get-ChildItem src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
   git diff --check
   ```

4. Run the project and check theme selection, sorting, filters, reset, previews, and dismissal. Compare desktop and narrow-screen layouts when HTML or CSS changes.
5. Review the diff. Update the existing development record with actual checks and limitations. Preserve unrelated user edits.

There is currently no project-installed formatter, lint command, or build command. Use an existing formatter installation; adding packages belongs to a separately approved tooling step. The syntax command requires Node.js, while running the current static page only requires the tools described in the run guide.

## Frozen data and approval boundaries

Leave every byte in `data/associations.json`, `data/puzzles.json`, and `data/metadata.json` unchanged during formatting and structural refactors. ECLAT stays offline; real board integration will use `preview_fen` and the supplied `puzzle_url`.

The completed readability and native-module refactors do not authorize Step 2, data integration, package installation, Git staging or commits, pushes, or deployment. Agents must follow the currently approved scope and report the files changed and checks actually run.
