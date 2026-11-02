import { useCallback, useState } from 'react';
import { PuzzlePreviewDialog } from '../puzzles/PuzzlePreviewDialog.jsx';
import { AssociationList } from './AssociationList.jsx';
import {
  createInitialSelection,
  selectExamplePuzzles,
  selectVisibleRules,
  updateSelection,
} from './association-selectors.js';
import { ExplorationFilters } from './ExplorationFilters.jsx';
import { PuzzleExamples } from './PuzzleExamples.jsx';

export function Explorer({ dataset }) {
  const { themes, rules } = dataset.associations;
  const [selection, setSelection] = useState(() => createInitialSelection(rules));
  const [previewPuzzle, setPreviewPuzzle] = useState(null);
  const dismissPreview = useCallback(() => setPreviewPuzzle(null), []);
  const themeNames = new Map(themes.map((theme) => [theme.id, theme.name]));
  const visibleRules = selectVisibleRules(rules, selection);
  const theme = themes.find((item) => item.id === selection.theme);
  const relatedTheme = themes.find((item) => item.id === selection.pair);
  const selectedRule = visibleRules.find((rule) => rule.related_theme === selection.pair);
  const examples = selectExamplePuzzles(dataset.puzzles, selectedRule, selection.difficulty);

  function changeSelection(changes) {
    setPreviewPuzzle(null);
    setSelection((previous) => updateSelection(rules, previous, changes));
  }

  return (
    <section id="discover">
      <div className="section-top">
        <div>
          <div className="kicker">The explorer</div>
          <h1 id="explore-title" className="page-heading">
            Discover tactic connections
          </h1>
          <p className="section-sub">
            Choose a tactic, learn what appears with it, then view a puzzle and solve it on Lichess.
          </p>
        </div>
      </div>
      <div className="explorer">
        <ExplorationFilters
          themes={themes}
          selection={selection}
          onChange={changeSelection}
          onReset={() => {
            setPreviewPuzzle(null);
            setSelection(createInitialSelection(rules));
          }}
        />
        <div className="results-col panel">
          <div className="results-top">
            <div>
              <h2 className="panel-heading" style={{ margin: 0 }}>
                2. Pair it with another tactic{' '}
                <span id="resultCount" className="results-count" role="status">
                  {`${visibleRules.length} ${visibleRules.length === 1 ? 'connection' : 'connections'}`}
                </span>
              </h2>
              <p id="resultsSubtitle">Tactics found in puzzles with {theme.name}.</p>
            </div>
          </div>
          <AssociationList
            themes={themes}
            theme={theme}
            rules={visibleRules}
            selectedPair={selection.pair}
            onSelect={(pair) => changeSelection({ pair })}
          />
          <div className="panel-sep"></div>
          <div className="puzzle-section">
            <div className="puzzle-header">
              <div>
                <h3>3. View a puzzle</h3>
                <p id="practiceSubtitle">
                  {relatedTheme
                    ? `Puzzles with ${theme.name} + ${relatedTheme.name}`
                    : 'Choose a connection to see puzzles'}
                </p>
              </div>
            </div>
            <PuzzleExamples
              examples={examples}
              theme={theme}
              relatedTheme={relatedTheme}
              ratingBands={dataset.metadata.example_rating_bands}
              onDifficultyChange={(difficulty) => changeSelection({ difficulty })}
              rule={selectedRule}
              difficulty={selection.difficulty}
              totalCount={selectedRule ? dataset.puzzles[selectedRule.pair_key].length : 0}
              themeNames={themeNames}
              onPreview={setPreviewPuzzle}
            />
          </div>

        </div>
      </div>
      {previewPuzzle && (
        <PuzzlePreviewDialog
          puzzle={previewPuzzle}
          themeNames={themeNames}
          onDismiss={dismissPreview}
        />
      )}
    </section>
  );
}
