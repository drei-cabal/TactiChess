import { StaticBoard } from '../puzzles/StaticBoard.jsx';

export function PuzzleExamples({ examples, rule, difficulty, totalCount, themeNames, onPreview }) {
  if (!rule) {
    return (
      <div id="puzzles" className="empty" role="status">
        No associated tactic is selected.
      </div>
    );
  }

  return (
    <div id="puzzles">
      <p id="exampleCount" className="example-summary" role="status">
        {examples.length} of {totalCount} exported examples ·{' '}
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
                  {puzzle.puzzle_id} · {puzzle.difficulty}
                </h4>
                <p className="example-summary">
                  Rating {puzzle.rating.toLocaleString('en-US')} ·{' '}
                  {puzzle.preview_fen.split(' ')[1] === 'w' ? 'White' : 'Black'} to move
                </p>
                <div className="card-tags">
                  {puzzle.themes.map((theme) => (
                    <span key={theme}>{themeNames.get(theme) ?? theme}</span>
                  ))}
                </div>
                <button
                  type="button"
                  className="card-cta"
                  aria-label={`Preview puzzle ${puzzle.puzzle_id}`}
                  onClick={() => onPreview(puzzle)}
                >
                  Preview position <span aria-hidden="true">↗</span>
                </button>
                <a
                  className="card-cta"
                  href={puzzle.puzzle_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Practice on Lichess ↗
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          No {difficulty === 'All' ? '' : `${difficulty} `}examples are exported for this pair. Try
          another difficulty or choose a different association.
        </div>
      )}
      <p className="example-summary">Static positions only. Solve each puzzle on Lichess.</p>
    </div>
  );
}
