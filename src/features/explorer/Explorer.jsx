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
  const exampleCount = Object.values(dataset.puzzles).reduce(
    (total, examples) => total + examples.length,
    0
  );

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
            Choose a tactical theme to explore its most common associations.
          </p>
        </div>
        <p className="guide-note">
          {themes.length} themes · {rules.length} frozen directional rules ·{' '}
          {dataset.metadata.unique_curated_pairs} pairs · {exampleCount} example entries
        </p>
      </div>
      <div className="explorer">
        <ExplorationFilters
          themes={themes}
          ratingBands={dataset.metadata.example_rating_bands}
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
                Associated tactics{' '}
                <span id="resultCount" className="results-count" role="status">
                  {`${visibleRules.length} ${visibleRules.length === 1 ? 'pattern' : 'patterns'}`}
                </span>
              </h2>
              <p id="resultsSubtitle">Themes associated with {theme.name}</p>
            </div>
            <select
              className="sort-select"
              id="sort"
              aria-label="Sort patterns"
              value={selection.sort}
              onChange={(event) => changeSelection({ sort: event.target.value })}
            >
              <option value="curated">Curated order</option>
              <option value="lift">Highest lift</option>
              <option value="support">Highest support</option>
              <option value="confidence">Highest confidence</option>
            </select>
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
                <h3>Matching examples</h3>
                <p id="practiceSubtitle">
                  {relatedTheme
                    ? `Available examples · ${theme.name} + ${relatedTheme.name}`
                    : 'Adjust filters to reveal patterns'}
                </p>
              </div>
              <span className="sample-label">STATIC PREVIEWS</span>
            </div>
            <PuzzleExamples
              examples={examples}
              rule={selectedRule}
              difficulty={selection.difficulty}
              totalCount={selectedRule ? dataset.puzzles[selectedRule.pair_key].length : 0}
              themeNames={themeNames}
              onPreview={setPreviewPuzzle}
            />
          </div>
          <div className="insight-footer">
            <span className="info-dot">i</span>
            Metrics describe training-tag co-occurrence, not causation. Confidence follows the
            displayed direction; rating filters never change these values.
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
