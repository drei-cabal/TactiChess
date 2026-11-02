export function AssociationList({ themes, theme, rules, selectedPair, onSelect }) {
  if (!rules.length) {
    return (
      <div id="patterns" className="result-list">
        <p className="empty" role="status">
          No related tactics are available. Choose another tactic.
        </p>
      </div>
    );
  }

  return (
    <div id="patterns" className="result-list">
      {rules.map((rule) => {
        const relatedTheme = themes.find((item) => item.id === rule.related_theme);
        return (
          <article key={`${rule.source_theme}|${rule.related_theme}`} className="connection-card">
            <button
              type="button"
              className={`pattern ${selectedPair === rule.related_theme ? 'selected' : ''}`}
              data-pair={rule.related_theme}
              aria-pressed={selectedPair === rule.related_theme}
              onClick={() => onSelect(rule.related_theme)}
            >
              <span className="pattern-main">
                <span className="combo">{relatedTheme.name}</span>
                <span className="connection-description">{relatedTheme.description}</span>
              </span>
              <span className="connection-action">
                {selectedPair === rule.related_theme ? 'Selected' : 'View puzzles'}
              </span>
            </button>
            {selectedPair === rule.related_theme && (
              <details key={rule.related_theme} className="connection-details">
                <summary>Why are these tactics paired?</summary>
                <p>
                  {rule.pair_count.toLocaleString('en-US')} training puzzles include both tactics;{' '}
                  {rule.source_count.toLocaleString('en-US')} include {theme.name};{' '}
                  {rule.related_count.toLocaleString('en-US')} include {relatedTheme.name}.
                </p>
                <dl className="connection-metrics">
                  <div>
                    <dt>Support: frequency in all training puzzles</dt>
                    <dd>{(rule.support * 100).toFixed(3)}%</dd>
                  </div>
                  <div>
                    <dt>Confidence: frequency within {theme.name} puzzles</dt>
                    <dd>{(rule.confidence * 100).toFixed(2)}%</dd>
                  </div>
                  <div>
                    <dt>Lift: frequency compared with independent occurrence</dt>
                    <dd>{rule.lift.toFixed(2)}&times;</dd>
                  </div>
                </dl>
                <p>
                  Confidence is read from {theme.name} to {relatedTheme.name}. This is a tag
                  connection, not a sequence of moves or a player's chance of success.
                </p>
                <a href="#/method">How to read these numbers</a>
              </details>
            )}
          </article>
        );
      })}
    </div>
  );
}
