import { footerMarkup, headerMarkup } from './components/site-navigation.js';
import { projectInfoMarkup } from './features/about/project-info-view.js';
import { boards } from './features/explorer/demo-data.js';
import { initializeExplorer } from './features/explorer/explorer.js';
import { explorerMarkup } from './features/explorer/explorer-view.js';
import { introductionMarkup } from './features/introduction/introduction-view.js';
import { renderDemoBoard } from './features/puzzles/demo-board.js';
import { initializePuzzlePreview } from './features/puzzles/puzzle-preview.js';

// Assemble the page before attaching feature events.
document.getElementById('siteHeader').innerHTML = headerMarkup;
document.getElementById('home').innerHTML = [
  introductionMarkup,
  explorerMarkup,
  projectInfoMarkup,
].join('');
document.getElementById('siteFooter').innerHTML = footerMarkup;

const renderBoard = (index) => renderDemoBoard(boards[index % boards.length]);
document.getElementById('heroBoard').innerHTML = renderBoard(1);

const openPreview = initializePuzzlePreview(document.getElementById('previewRoot'), renderBoard);
initializeExplorer(document.getElementById('discover'), openPreview);
