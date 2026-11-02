import { PuzzleTags } from '../puzzles/PuzzleTags.jsx';
import { StaticBoard } from '../puzzles/StaticBoard.jsx';

export function PuzzleExamples({
  examples,
  rule,
  difficulty,
  totalCount,
  themeNames,
  onPreview,
  theme,
  relatedTheme,
  ratingBands,
  onDifficultyChange,
}) {
  if (!rule) {
    return (
      <div id="puzzles" className="empty" role="status">
        Choose a connection above to see its example puzzles.
      </div>
    );
  }

  return (
    <div id="puzzles">
      <div className="puzzle-context">
        <p>
          Find the best moves for the side to move. Each puzzle below is tagged with both
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
          Look for these ideas as you solve. The tags describe the puzzle's solution as a whole;
          they do not say which tactic comes first.
        </p>
      </div>
      <div className="puzzle-difficulty">
        <span className="control-label">Puzzle difficulty</span>
        <div
          className="segment"
          id="difficulty"
          role="group"
          aria-label="Puzzle difficulty"
          aria-describedby="difficultyHelp"
        >
          {['All', 'Easy', 'Medium', 'Hard'].map((level) => (
            <button
              key={level}
              type="button"
              aria-pressed={difficulty === level}
              className={difficulty === level ? 'active' : ''}
              onClick={() => onDifficultyChange(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <p id="difficultyHelp" className="example-summary">
          {difficulty === 'All'
            ? 'Choose Easy for lower-rated puzzles.'
            : `${difficulty}: ${ratingBands[difficulty]}.`}
        </p>
      </div>
      <p className="example-summary">
        View the boards here; use Solve on Lichess to move the pieces.
      </p>
      <p id="exampleCount" className="example-summary" role="status">
        {examples.length} of {totalCount} example puzzles ·{' '}
        {difficulty === 'All' ? 'All ratings' : difficulty}
      </p>
      {examples.length ? (
        <ul className="puzzles" aria-label="Matching puzzle examples">
          {examples.map((puzzle) => (
            <li key={puzzle.puzzle_id} className="puzzle-card" data-puzzle-id={puzzle.puzzle_id}>
              <div className="card-top">
                <StaticBoard
                  previewFen={puzzle.preview_fen}
                  label={`Puzzle ${puzzle.puzzle_id}`}
                  compact
                />
              </div>
              <div className="card-bottom">
                <h4 className="card-name">
                  {puzzle.difficulty} -{' '}
                  {puzzle.preview_fen.split(' ')[1] === 'w' ? 'White' : 'Black'} to move
                </h4>
                <p className="example-summary">
                  Puzzle rating {puzzle.rating.toLocaleString('en-US')}
                </p>
                <p className="puzzle-task">
                  Find the best moves for{' '}
                  {puzzle.preview_fen.split(' ')[1] === 'w' ? 'White' : 'Black'}. This puzzle is
                  tagged with {theme.name} and {relatedTheme.name}.
                </p>
                <PuzzleTags puzzle={puzzle} themeNames={themeNames} />
                <button
                  type="button"
                  className="card-cta"
                  aria-label={`Enlarge board for puzzle ${puzzle.puzzle_id}`}
                  onClick={() => onPreview(puzzle)}
                >
                  Enlarge board
                </button>
                <a
                  className="card-cta"
                  href={puzzle.puzzle_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solve on Lichess ↗
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          No {difficulty === 'All' ? '' : `${difficulty} `}example puzzles are available for this
          connection. Try another difficulty or choose a different connection.
        </div>
      )}
    </div>
  );
}
