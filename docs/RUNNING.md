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

Open the repository folder in VS Code, then open **Terminal ? New Terminal**. Run from the folder containing `package.json`:

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

- `test` runs the demo selector tests using Node's built-in test runner.
- `build` writes the production assets to `dist/`.
- `preview` serves the most recent build, normally at `http://127.0.0.1:4173/`. Rebuild after source changes; preview does not rebuild automatically.

A successful build checks module imports and JSX compilation. Also exercise theme selection, sorting, filters, reset, preview dismissal, keyboard focus, and desktop/narrow layouts in the browser. There is no separate lint command at this checkpoint.

Do not open `index.html` using `file://`. To host a completed build elsewhere, serve the contents of `dist/`, not the source folder. Deployment and access protection remain separately approved steps; `vite preview` is for local verification.

## Current content

The design, responsive sticky header, and existing demo interactions are preserved. Metrics and boards are illustrative. The genuine JSON exports remain unchanged in `data/`; they are neither fetched by the app nor copied into `dist/` in Step 2. JSON integration and real boards require the next approvals.

## Troubleshooting

| Symptom                                              | Action                                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| `node` or `npm.cmd` is unavailable                   | Install a supported Node.js version, reopen the terminal, and check the versions. |
| PowerShell blocks `npm.ps1`                          | Use the documented `npm.cmd` commands.                                            |
| Vite is missing or imports fail                      | Run `npm.cmd ci` from the repository root.                                        |
| Node version is unsupported                          | Upgrade to a version matching the requirement above.                              |
| Port is busy                                         | Use the URL Vite prints or choose a port with `--port`.                           |
| Browser cannot connect                               | Keep the server running and use its exact local URL.                              |
| Page is blank when opened directly or through Python | Start Vite and open its HTTP URL.                                                 |
| Preview shows an older change                        | Run `npm.cmd run build` again, then reload.                                       |

`node_modules/` and `dist/` are generated and ignored by Git. Dependency versions are pinned intentionally; report incompatibilities before replacing them.
