import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { loadDataset } from './data/load-dataset.js';
import 'cm-chessboard/assets/chessboard.css';
import './styles/site.css';
import './styles/pages.css';
import './styles/chess.css';
import './styles/library.css';

const root = createRoot(document.getElementById('root'));

function render(datasetState) {
  root.render(
    <StrictMode>
      <App datasetState={datasetState} />
    </StrictMode>
  );
}

render({ status: 'loading' });

// Start once per page load, outside Strict Mode component effects.
loadDataset(import.meta.env.BASE_URL).then(
  (data) => render({ status: 'success', data }),
  (error) => render({ status: 'error', message: error.message })
);
