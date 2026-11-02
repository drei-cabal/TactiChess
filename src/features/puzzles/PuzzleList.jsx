import { boards, themes } from '../explorer/demo-data.js';
import { DemoBoard } from './DemoBoard.jsx';

export function PuzzleList({ theme, relatedTheme, difficulty, onPreview }) {
  if (!relatedTheme) {
    return (
      <div id="puzzles" className="puzzles">
        <div className="empty" style={{ gridColumn: '1/-1' }}>
          No associated tactic is selected.
        </div>
      </div>
    );
  }

  return (
    <div id="puzzles" className="puzzles">
      {['Easy', 'Medium', 'Hard'].map((level, index) => {
        if (difficulty !== 'All' && difficulty !== level) {
          return null;
        }

        const positionIndex =
          (themes.indexOf(theme) * 2 + themes.indexOf(relatedTheme) + index) % boards.length;

        return (
          <PuzzleCard
            key={level}
            number={index + 1}
            positionIndex={positionIndex}
            difficulty={level}
            theme={theme}
            relatedTheme={relatedTheme}
            onPreview={onPreview}
          />
        );
      })}
    </div>
  );
}

function PuzzleCard({ number, positionIndex, difficulty, theme, relatedTheme, onPreview }) {
  return (
    <article className="puzzle-card">
      <div className="card-top">
        <span className="card-number">0{number}</span>
        <div className="board" aria-label="Sample chess board">
          <DemoBoard position={boards[positionIndex]} />
        </div>
      </div>
      <div className="card-bottom">
        <div className="card-name">{difficulty} · Sample position</div>
        <div className="card-tags">
          <span>{theme.label}</span>
          <span>{relatedTheme.label}</span>
        </div>
        <button
          type="button"
          className="card-cta"
          data-position={positionIndex}
          data-difficulty={difficulty}
          onClick={() =>
            onPreview({
              positionIndex,
              difficulty,
              pairLabel: `${theme.label} + ${relatedTheme.label}`,
            })
          }
        >
          Preview position
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  );
}
