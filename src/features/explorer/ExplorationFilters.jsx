export function ExplorationFilters({ themes, ratingBands, selection, onChange, onReset }) {
  return (
    <aside className="panel control-panel" aria-label="Exploration filters">
      <h2 className="panel-heading">Your exploration</h2>
      <p className="panel-description">
        Start with one tactic. Explore related themes from the frozen training rules.
      </p>
      <div className="control-label">
        Choose a tactic
        <small>1 selected</small>
      </div>
      <div id="themeGrid" className="theme-grid" role="group" aria-label="Choose a chess tactic">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`theme-chip ${theme.id === selection.theme ? 'active' : ''}`}
            data-theme={theme.id}
            title={theme.description}
            aria-pressed={theme.id === selection.theme}
            onClick={() => onChange({ theme: theme.id, pair: null })}
          >
            <span className="sym" aria-hidden="true">
              ♞
            </span>
            {theme.name}
          </button>
        ))}
      </div>
      <p id="themeDescription" className="tiny-note">
        {themes.find((theme) => theme.id === selection.theme).description}
      </p>
      <hr className="control-divider" />
      <div className="control-label">Puzzle difficulty</div>
      <div
        className="segment"
        id="difficulty"
        role="group"
        aria-label="Puzzle difficulty"
        aria-describedby="difficultyHelp"
      >
        {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
          <button
            key={difficulty}
            type="button"
            className={selection.difficulty === difficulty ? 'active' : ''}
            data-difficulty={difficulty}
            aria-pressed={selection.difficulty === difficulty}
            aria-label={difficulty}
            title={ratingBands[difficulty] ?? 'All exported ratings'}
            onClick={() => onChange({ difficulty })}
          >
            {difficulty === 'Medium' ? 'Med' : difficulty}
          </button>
        ))}
      </div>
      <p id="difficultyHelp" className="tiny-note">
        {selection.difficulty === 'All'
          ? 'All exported ratings. Difficulty filters examples only.'
          : `${selection.difficulty}: ${ratingBands[selection.difficulty]}. Association metrics stay fixed.`}
      </p>
      <div className="slider-row">
        <span>Minimum support</span>
        <strong id="supportValue">{selection.support.toFixed(2)}%</strong>
      </div>
      <input
        id="support"
        aria-label="Minimum support threshold"
        aria-valuetext={`${selection.support.toFixed(2)}%`}
        type="range"
        min="0.20"
        max="2.20"
        step="0.01"
        value={selection.support}
        onChange={(event) => onChange({ support: Number(event.target.value) })}
      />
      <p className="tiny-note">
        Support is the share of all 400,000 training puzzles containing both themes. Mining ran
        offline in Colab; these metrics stay fixed.
      </p>
      <button className="reset" type="button" id="reset" onClick={onReset}>
        ↺ Reset all filters
      </button>
    </aside>
  );
}
