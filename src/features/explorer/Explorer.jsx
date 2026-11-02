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

  function focusPuzzles() {
    document.getElementById('puzzleHeading').focus();
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
      <div className="explorer puzzle-workspace">
        <section className="puzzle-section panel" aria-labelledby="puzzleHeading">
          <div className="puzzle-header">
            <div>
              <h2 id="puzzleHeading" tabIndex={-1}>
                View a puzzle
              </h2>
              <p id="practiceSubtitle">
                {relatedTheme
                  ? `Puzzles with ${theme.name} + ${relatedTheme.name}`
                  : 'Choose a connection to see puzzles'}
              </p>
            </div>
            <button
              className="workspace-jump"
              type="button"
              onClick={() => document.getElementById('tactic').focus()}
            >
              Change tactics
            </button>
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
        </section>
        <div className="explorer-rail">
          <button className="workspace-jump return-to-puzzles" type="button" onClick={focusPuzzles}>
            Back to puzzles
          </button>
          <ExplorationFilters
            themes={themes}
            selection={selection}
            onChange={changeSelection}
            onReset={() => {
              setPreviewPuzzle(null);
              setSelection(createInitialSelection(rules));
            }}
          />
          <section className="results-col panel" aria-labelledby="pairHeading">
            <div className="results-top">
              <div>
                <h2 id="pairHeading" className="panel-heading" style={{ margin: 0 }}>
                  Pair it with another tactic{' '}
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
              onSelect={(pair) => {
                changeSelection({ pair });
                focusPuzzles();
              }}
            />
          </section>
          {relatedTheme && (
            <div className="puzzle-context">
              <p>
                Find the best moves for the side to move. Each puzzle shown is tagged with both
                <strong> {theme.name}</strong> and <strong>{relatedTheme.name}</strong>.
              </p>
              <dl>
                <div>
                  <dt>{theme.name}</dt>
                  <dd>{theme.description}</dd>
                </div>
                <div>
                  <dt>{relatedTheme.name}</dt>
                  <dd>{relatedTheme.description}</dd>
                </div>
              </dl>
              <p>
                Look for these ideas as you solve. The tags describe the puzzle's solution as a
                whole; they do not say which tactic comes first.
              </p>
            </div>
          )}
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
