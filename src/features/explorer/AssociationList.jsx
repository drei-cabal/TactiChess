export function AssociationList({ themes, theme, rules, selectedPair, onSelect }) {
  if (!rules.length) {
    return (
      <div id="patterns" className="result-list">
        <div className="empty">
          No associations meet the selected support threshold. Lower the threshold or choose another
          tactic.
        </div>
      </div>
    );
  }

  return (
    <div id="patterns" className="result-list">
      {rules.map((rule) => {
        const relatedTheme = themes.find((item) => item.id === rule.related_theme);
        return (
          <button
            key={`${rule.source_theme}|${rule.related_theme}`}
            type="button"
            className={`pattern ${selectedPair === rule.related_theme ? 'selected' : ''}`}
            data-pair={rule.related_theme}
            aria-pressed={selectedPair === rule.related_theme}
            onClick={() => onSelect(rule.related_theme)}
          >
            <div className="pattern-main">
              <div className="pattern-graphic">
                <span className="mini-icon" aria-hidden="true">
                  ♞
                </span>
                <span className="mini-icon" aria-hidden="true">
                  ♞
                </span>
                <span className="combo">
                  {`${theme.name} `}
                  <small>→</small>
                  {` ${relatedTheme.name}`}
                </span>
              </div>
              <div className="pattern-desc">
                {rule.pair_count.toLocaleString('en-US')} together ·{' '}
                {rule.source_count.toLocaleString('en-US')} source ·{' '}
                {rule.related_count.toLocaleString('en-US')} related
              </div>
            </div>
            <div className="metrics">
              <span>
                <strong>{(rule.support * 100).toFixed(3)}%</strong>
                <small>Support</small>
              </span>
              <span>
                <strong>{(rule.confidence * 100).toFixed(2)}%</strong>
                <small>Confidence</small>
              </span>
              <span>
                <strong>{rule.lift.toFixed(2)}×</strong>
                <small>Lift</small>
              </span>
            </div>
            <span className="chevron">›</span>
          </button>
        );
      })}
    </div>
  );
}
