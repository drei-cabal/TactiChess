// Existing demo arrays use letters rather than genuine exported positions.
const pieceMap = {
  r: '♜',
  n: '♞',
  b: '♝',
  q: '♛',
  k: '♚',
  p: '♟',
  R: '♖',
  N: '♘',
  B: '♗',
  Q: '♕',
  K: '♔',
  P: '♙',
};

export function DemoBoard({ position }) {
  return position.flatMap((row, rowIndex) =>
    [...row].map((piece, columnIndex) => (
      <span
        key={`${rowIndex}-${columnIndex}`}
        className={`square ${(rowIndex + columnIndex) % 2 ? 'dark' : 'light'}`}
        aria-hidden="true"
      >
        {piece !== '.' && (
          <span className={`piece ${piece === piece.toUpperCase() ? 'white' : 'black'}`}>
            {pieceMap[piece] || ''}
          </span>
        )}
      </span>
    ))
  );
}
