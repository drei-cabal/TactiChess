export function ExplorationFilters({ themes, selection, onChange, onReset }) {
  const theme = themes.find((item) => item.id === selection.theme);

  return (
    <aside className="panel control-panel" aria-label="Choose a tactic">
      <h2 className="panel-heading">1. Choose a tactic</h2>
      <label className="control-label" htmlFor="tactic">Chess tactic</label>
      <select
        id="tactic"
        className="tactic-select"
        value={selection.theme}
        aria-describedby="themeDescription"
        onChange={(event) => onChange({ theme: event.target.value, pair: null })}
      >
        {themes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <p id="themeDescription" className="tactic-definition">{theme.description}</p>
      <button className="reset" type="button" id="reset" onClick={onReset}>
        Reset to Fork
      </button>
    </aside>
  );
}
