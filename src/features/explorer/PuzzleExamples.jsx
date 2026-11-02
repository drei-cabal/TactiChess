export function PuzzleExamples({ examples, rule, difficulty, totalCount }) {
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
        <ul className="example-list" aria-label="Matching puzzle examples">
          {examples.map((puzzle) => (
            <li key={puzzle.puzzle_id} className="example-entry" data-puzzle-id={puzzle.puzzle_id}>
              <span>
                <strong>{puzzle.puzzle_id}</strong>
                <small>{puzzle.difficulty}</small>
              </span>
              <span>
                Rating <strong>{puzzle.rating.toLocaleString('en-US')}</strong>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          No {difficulty === 'All' ? '' : `${difficulty} `}examples are exported for this pair. Try
          another difficulty or choose a different association.
        </div>
      )}
      <p className="example-summary">Board previews and Lichess practice links are coming soon.</p>
    </div>
  );
}
