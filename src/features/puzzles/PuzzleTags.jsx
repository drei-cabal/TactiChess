const tagLabels = {
  mate: 'Checkmate',
  mateIn1: 'Checkmate in 1',
  mateIn2: 'Checkmate in 2',
  mateIn3: 'Checkmate in 3',
  mateIn4: 'Checkmate in 4',
  mateIn5: 'Checkmate in 5',
  anastasiaMate: "Anastasia's mate",
  blindSwineMate: 'Blind swine mate',
  morphysMate: "Morphy's mate",
  swallowstailMate: "Swallow's tail mate",
  attackingF2F7: 'Attack on f2 or f7',
  xRayAttack: 'X-ray attack',
  master: 'From a master game',
  masterVsMaster: 'Master versus master game',
  crushing: 'Decisive advantage',
  long: 'Long solution',
  short: 'Short solution',
  veryLong: 'Very long solution',
  oneMove: 'One-move solution',
  underPromotion: 'Underpromotion',
};

export function PuzzleTags({ puzzle, themeNames }) {
  return (
    <details className="puzzle-details">
      <summary>Puzzle details</summary>
      <p className="example-summary">Puzzle ID: {puzzle.puzzle_id}</p>
      <div className="card-tags" aria-label="Puzzle tags">
        {puzzle.themes.map((theme) => {
          const words = theme.replace(/([a-z])([A-Z])/g, '$1 $2');
          const label =
            themeNames.get(theme) ??
            tagLabels[theme] ??
            words.charAt(0).toUpperCase() + words.slice(1);
          return <span key={theme}>{label}</span>;
        })}
      </div>
    </details>
  );
}
