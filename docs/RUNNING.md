# Run TactiChess locally

The current project is a static HTML, CSS, and native JavaScript module prototype. Vite + React setup is a later step; no npm installation or build command is needed yet.

## Requirements

- Python 3 available as `python` or `py`.
- A modern web browser.

## Start the project

1. Open the **TactiChess** folder in VS Code.
2. Select **Terminal → New Terminal**. Run commands from the repository root: the folder containing `index.html`, `src/`, and `data/`.
3. Check that Python is available:

   ```powershell
   python --version
   ```

4. Start the local static-file server:

   ```powershell
   python -m http.server 8765 --bind 127.0.0.1
   ```

5. Keep that terminal running and open [http://127.0.0.1:8765/](http://127.0.0.1:8765/) in your browser.

If `python` is unavailable but the Windows Python launcher is installed, use this instead:

```powershell
py -3 -m http.server 8765 --bind 127.0.0.1
```

## What to expect

The page displays the existing prototype design with tactic selection, sorting, support filtering, difficulty buttons, and board-preview dialogs. Associations and boards are still labeled demo content. The genuine JSON exports are present in `data/` but are not connected to the interface yet. ECLAT runs offline in Colab.

The page loads its stylesheet from `src/styles/site.css` and its module entry point from `src/main.js`. That entry point imports the page sections and feature behavior. Keep the entire `src/` directory in place alongside the HTML entry point, and use the HTTP URL above rather than opening the file directly. Native module imports do not work through `file://` here.

## Edit and stop

- After saving a source change, refresh the browser. This server does not automatically reload the page.
- If an old style or script remains visible, use **Ctrl+F5** to refresh without the cached version.
- To stop the server, focus its terminal and press **Ctrl+C**.

## Troubleshooting

| Symptom                                                       | Action                                                                                                                                                            |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Python command is not found                                   | Try the `py -3` command above. If neither command works, install Python 3 and reopen the terminal.                                                                |
| The browser shows a directory listing or a 404                | Stop the server and restart it from the repository root containing `index.html`.                                                                                  |
| The page is blank, has no styles, or its controls do not work | Use the HTTP URL, confirm the entire `src/` directory is present, and press Ctrl+F5. Browser developer tools can identify a missing module or stylesheet request. |
| The browser cannot connect                                    | Confirm the server terminal is still running and the URL uses the same port as the command.                                                                       |
| Port 8765 is already in use                                   | Run `python -m http.server 8766 --bind 127.0.0.1` and open `http://127.0.0.1:8766/` instead.                                                                      |

The server is bound to your computer's loopback address for local development. Production deployment and access protection are separate project steps.
