import { useCallback, useState } from 'react';
import { PuzzlePreviewDialog } from '../puzzles/PuzzlePreviewDialog.jsx';
import { PuzzleTags } from '../puzzles/PuzzleTags.jsx';
import { StaticBoard } from '../puzzles/StaticBoard.jsx';
import { groupThemes, selectThemeExamples, themeGuide } from './theme-catalog.js';

function ThemeCard({ theme, examples, themeNames, onPreview }) {
  const [showExamples, setShowExamples] = useState(false);
  const guide = themeGuide[theme.id];

  return (
    <article className="library-theme-card panel" aria-labelledby={`theme-${theme.id}`}>
      <h3 id={`theme-${theme.id}`}>{theme.name}</h3>
      <p className="library-meaning">{guide.meaning}</p>
      <p className="library-cue">
        <strong>What to look for</strong>
        {guide.cue}
      </p>
      <details
        className="library-board-details"
        onToggle={(event) => setShowExamples(event.currentTarget.open)}
      >
        <summary aria-label={`View ${examples.length} board examples for ${theme.name}`}>
          View {examples.length} board examples
        </summary>
        {showExamples && (
          <>
            <p className="library-example-help">
              These real puzzles are tagged with {theme.name}. The idea may appear later in the
              solution. Boards are previews; solve on Lichess in a new tab.
            </p>
            {examples.length ? (
              <ul className="library-examples" aria-label={`${theme.name} board examples`}>
                {examples.map((puzzle, index) => (
                  <li className="puzzle-card" key={puzzle.puzzle_id}>
                    <div className="card-top">
                      <StaticBoard
                        previewFen={puzzle.preview_fen}
                        label={`${theme.name} example ${index + 1}, puzzle ${puzzle.puzzle_id}`}
                        compact
                      />
                    </div>
                    <div className="card-bottom">
                      <h4>
                        Example {index + 1} ·{' '}
                        {puzzle.preview_fen.split(' ')[1] === 'w' ? 'White' : 'Black'} to move
                      </h4>
                      <p>
                        {puzzle.difficulty} · Rating {puzzle.rating.toLocaleString('en-US')}
                      </p>
                      <PuzzleTags puzzle={puzzle} themeNames={themeNames} />
                      <button
                        className="card-cta"
                        type="button"
                        onClick={() => onPreview(puzzle)}
                        aria-label={`Enlarge board for ${theme.name} example ${index + 1}`}
                      >
                        Enlarge board <span aria-hidden="true">↗</span>
                      </button>
                      <a
                        className="card-cta"
                        href={puzzle.puzzle_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Solve on Lichess <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No exported board examples are available for this theme.</p>
            )}
          </>
        )}
      </details>
    </article>
  );
}

export function ThemeLibrary({ dataset }) {
  const { themes, rules } = dataset.associations;
  const [previewPuzzle, setPreviewPuzzle] = useState(null);
  const dismissPreview = useCallback(() => setPreviewPuzzle(null), []);
  const categories = groupThemes(themes);
  const themeNames = new Map(themes.map((theme) => [theme.id, theme.name]));

  function jumpToCategory(categoryId) {
    const heading = document.getElementById(`category-${categoryId}`);
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  return (
    <section className="library-page">
      <div className="library-intro">
        <div>
          <div className="kicker">A field guide to chess tactics</div>
          <h1 id="themes-title" className="page-heading">
            Theme library
          </h1>
          <p>
            A theme is a pattern or idea in a chess puzzle. Get to know all {themes.length} themes
            on TactiChess: what they mean and what to look for on the board.
          </p>
        </div>
        <span className="library-bookmark">
          <span aria-hidden="true">♞</span> Small ideas.
          <br />
          Stronger moves.
        </span>
      </div>

      <div className="library-browse-intro">
        <p>
          Read at your own pace, or jump to a category. Open a theme’s board examples when you’re
          ready to see it in practice.
        </p>
        <nav className="library-categories" aria-label="Jump to a theme category">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-controls={`category-section-${category.id}`}
              aria-label={`${category.name}, ${category.themes.length} ${category.themes.length === 1 ? 'theme' : 'themes'}`}
              onClick={() => jumpToCategory(category.id)}
            >
              {category.name} <span aria-hidden="true">{category.themes.length}</span>
            </button>
          ))}
        </nav>
      </div>

      {categories.map((category, index) => (
        <section
          key={category.id}
          id={`category-section-${category.id}`}
          className="library-category"
          aria-labelledby={`category-${category.id}`}
        >
          <div className="library-category-heading">
            <span className="library-category-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h2 id={`category-${category.id}`} tabIndex={-1}>
                {category.name}
              </h2>
              <p>{category.description}</p>
            </div>
          </div>
          <div className="library-theme-grid">
            {category.themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                examples={selectThemeExamples(dataset.puzzles, rules, theme.id)}
                themeNames={themeNames}
                onPreview={setPreviewPuzzle}
              />
            ))}
          </div>
        </section>
      ))}

      <p className="library-source">
        Categories and theme meanings follow{' '}
        <a href="https://lichess.org/training/themes" target="_blank" rel="noopener noreferrer">
          Lichess’s puzzle themes ↗
        </a>
        , explained here in beginner-friendly language. Examples use the website’s original puzzle
        positions.
      </p>
      <p className="library-next">
        Ready to connect the ideas? <a href="#/explore">Explore tactic connections →</a>
      </p>
      {previewPuzzle && (
        <PuzzlePreviewDialog
          puzzle={previewPuzzle}
          themeNames={themeNames}
          onDismiss={dismissPreview}
          returnLabel="Back to theme library"
          className="library-preview"
        />
      )}
    </section>
  );
}
