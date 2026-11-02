import { useCallback, useState } from 'react';
import { PuzzleList } from '../puzzles/PuzzleList.jsx';
import { PuzzlePreviewDialog } from '../puzzles/PuzzlePreviewDialog.jsx';
import { AssociationList } from './AssociationList.jsx';
import { themes } from './demo-data.js';
import {
  createInitialSelection,
  selectVisiblePairs,
  updateDemoSelection,
} from './demo-selectors.js';
import { ExplorationFilters } from './ExplorationFilters.jsx';

export function Explorer() {
  const [selection, setSelection] = useState(createInitialSelection);
  const [preview, setPreview] = useState(null);
  const visiblePairs = selectVisiblePairs(selection);
  const theme = themes.find((item) => item.id === selection.theme);
  const relatedTheme = themes.find((item) => item.id === selection.pair);
  const closePreview = useCallback(() => setPreview(null), []);

  function changeSelection(changes) {
    setSelection((previous) => updateDemoSelection(previous, changes));
  }

  return (
    <>
      <section id="discover">
        <div className="section-top">
          <div>
            <div className="kicker">The explorer</div>
            <h2>Discover tactic connections</h2>
            <p className="section-sub">
              Choose a tactical theme to explore its most common associations.
            </p>
          </div>
          <p className="guide-note">
            Patterns below are illustrative until the Colab ECLAT output is connected.
          </p>
        </div>
        <div className="explorer">
          <ExplorationFilters
            selection={selection}
            onChange={changeSelection}
            onReset={() => setSelection(createInitialSelection())}
          />
          <div className="results-col panel" aria-live="polite">
            <div className="results-top">
              <div>
                <h3 className="panel-heading" style={{ margin: 0 }}>
                  Associated tactics{' '}
                  <span id="resultCount" className="results-count">
                    {`${visiblePairs.length} ${visiblePairs.length === 1 ? 'pattern' : 'patterns'}`}
                  </span>
                </h3>
                <p id="resultsSubtitle">Themes associated with {theme.label}</p>
              </div>
              <select
                className="sort-select"
                id="sort"
                aria-label="Sort patterns"
                value={selection.sort}
                onChange={(event) => changeSelection({ sort: event.target.value })}
              >
                <option value="lift">Highest lift</option>
                <option value="support">Highest support</option>
                <option value="confidence">Highest confidence</option>
              </select>
            </div>
            <AssociationList
              theme={theme}
              pairs={visiblePairs}
              selectedPair={selection.pair}
              onSelect={(pair) => changeSelection({ pair })}
            />
            <div className="panel-sep"></div>
            <div className="puzzle-section">
              <div className="puzzle-header">
                <div>
                  <h3>Sample practice positions</h3>
                  <p id="practiceSubtitle">
                    {relatedTheme
                      ? `Illustrative board layouts · ${theme.label} + ${relatedTheme.label}`
                      : 'Adjust filters to reveal patterns'}
                  </p>
                </div>
                <span className="sample-label">DESIGN PREVIEW</span>
              </div>
              <PuzzleList
                theme={theme}
                relatedTheme={relatedTheme}
                difficulty={selection.difficulty}
                onPreview={setPreview}
              />
            </div>
            <div className="insight-footer">
              <span className="info-dot">i</span>
              Board previews and statistics are demonstrative, not validated Lichess puzzles or
              mined output.
            </div>
          </div>
        </div>
      </section>
      <PuzzlePreviewDialog preview={preview} onClose={closePreview} />
    </>
  );
}
