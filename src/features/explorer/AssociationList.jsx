import { themes } from './demo-data.js';

export function AssociationList({ theme, pairs, selectedPair, onSelect }) {
  if (!pairs.length) {
    return (
      <div id="patterns" className="result-list">
        <div className="empty">
          No demo patterns meet the selected support threshold. Lower the threshold or choose
          another tactic.
        </div>
      </div>
    );
  }

  return (
    <div id="patterns" className="result-list">
      {pairs.map((pair) => {
        const relatedTheme = themes.find((item) => item.id === pair.id);
        return (
          <button
            key={pair.id}
            type="button"
            className={`pattern ${selectedPair === pair.id ? 'selected' : ''}`}
            data-pair={pair.id}
            aria-pressed={selectedPair === pair.id}
            onClick={() => onSelect(pair.id)}
          >
            <div className="pattern-main">
              <div className="pattern-graphic">
                <span className="mini-icon">{theme.icon}</span>
                <span className="mini-icon">{relatedTheme.icon}</span>
                <span className="combo">
                  {`${theme.label} `}
                  <small>+</small>
                  {` ${relatedTheme.label}`}
                </span>
              </div>
              <div className="pattern-desc">Select to preview matching puzzle cards</div>
            </div>
            <div className="metrics">
              <span>
                <strong>{pair.support.toFixed(1)}%</strong>
                <small>Support</small>
              </span>
              <span>
                <strong>{pair.confidence}%</strong>
                <small>Confidence</small>
              </span>
              <span>
                <strong>{pair.lift.toFixed(2)}×</strong>
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
