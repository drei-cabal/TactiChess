import { themes } from './demo-data.js';

export function ExplorationFilters({ selection, onChange, onReset }) {
  return (
    <aside className="panel control-panel" aria-label="Exploration filters">
      <h3 className="panel-heading">Your exploration</h3>
      <p className="panel-description">
        Start with one tactic. We'll show related themes and sample practice positions.
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
            aria-pressed={theme.id === selection.theme}
            onClick={() => onChange({ theme: theme.id, pair: null })}
          >
            <span className="sym">{theme.icon}</span>
            {theme.label}
          </button>
        ))}
      </div>
      <hr className="control-divider" />
      <div className="control-label">Puzzle difficulty</div>
      <div className="segment" id="difficulty" role="group" aria-label="Puzzle difficulty">
        {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
          <button
            key={difficulty}
            type="button"
            className={selection.difficulty === difficulty ? 'active' : ''}
            data-difficulty={difficulty}
            aria-pressed={selection.difficulty === difficulty}
            onClick={() => onChange({ difficulty })}
          >
            {difficulty === 'Medium' ? 'Med' : difficulty}
          </button>
        ))}
      </div>
      <div className="slider-row">
        <span>Minimum support</span>
        <strong id="supportValue">{selection.support}%</strong>
      </div>
      <input
        id="support"
        aria-label="Minimum support threshold"
        type="range"
        min="5"
        max="20"
        step="1"
        value={selection.support}
        onChange={(event) => onChange({ support: Number(event.target.value) })}
      />
      <p className="tiny-note">
        ⓘ In the final website, associations will be calculated from a real Lichess puzzle sample
        using ECLAT in Google Colab.
      </p>
      <button className="reset" type="button" id="reset" onClick={onReset}>
        ↺ Reset all filters
      </button>
    </aside>
  );
}
