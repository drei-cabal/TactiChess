# Run TactiChess locally

TactiChess is a static HTML, CSS, and native JavaScript module prototype. No build step, npm install, or backend is required. You only need a modern browser and a local static-file server.

Native module imports in `src/main.js` do not work through `file://`, so you must serve `index.html` over HTTP rather than opening it directly.

## Requirements

- A modern web browser.
- One of: Python 3 (`python`, `py`, or `python3`), Node.js (`npx http-server` or `node`), or PHP (`php -S`).

## Start the project

Run from the repository root (the folder containing `index.html`, `src/`, and `data/`).

### Option 1: Python (recommended, cross-platform)

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

If `python` is not found, try:

```powershell
py -3 -m http.server 8765 --bind 127.0.0.1
```

On macOS/Linux:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

### Option 2: Node.js

```bash
npx http-server -p 8765 -a 127.0.0.1
```

Or with plain Node:

```bash
node -e "require('http').createServer((_,res)=>res.end(require('fs').readFileSync('index.html'))).listen(8765,'127.0.0.1')"
```

### Option 3: PHP

```bash
php -S 127.0.0.1:8765
```

### Option 4: Port already in use

If port 8765 is taken, pick another port and open the matching URL:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8766/`.

## Open the prototype

Keep the server running and open:

```
http://127.0.0.1:8765/
```

If you used a different port, replace `8765` with that port.

## Edit and stop

- After saving a source change, refresh the browser. This server does not auto-reload.
- Use **Ctrl+F5** to refresh without cached files.
- To stop the server, focus its terminal and press **Ctrl+C**.
- If the terminal is unavailable, stop the process holding port 8765:

  Windows PowerShell:

  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 8765 -ErrorAction SilentlyContinue).OwningProcess -Force
  ```

  macOS/Linux:

  ```bash
  lsof -ti:8765 | xargs kill
  # or
  fuser -k 8765/tcp
  ```

## What to expect

The page displays the existing prototype design with tactic selection, sorting, support filtering, difficulty buttons, and board-preview dialogs. Associations and boards are still labeled demo content. The genuine JSON exports are present in `data/` but are not connected to the interface yet. ECLAT runs offline in Colab.

The page loads its stylesheet from `src/styles/site.css` and its module entry point from `src/main.js`. Keep the entire `src/` directory in place alongside the HTML entry point, and use the HTTP URL above rather than opening the file directly.

## Troubleshooting

| Symptom | Action |
| ------- | ------ |
| No server command available | Install Python 3, Node.js, or PHP, then retry one of the start options above. |
| Browser shows a directory listing or 404 | Run the server from the repository root containing `index.html`. |
| Page is blank, no styles, or controls do not work | Use the HTTP URL, confirm `src/` is present, and press Ctrl+F5. Developer tools can identify missing module/stylesheet requests. |
| Browser cannot connect | Confirm the server terminal is running and the URL uses the same port as the command. |

The server is bound to your loopback address for local development. Production deployment and access protection are separate project steps.
