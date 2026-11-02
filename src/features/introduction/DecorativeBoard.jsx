// Temporary hero decoration, not a validated puzzle or association preview.
const position = [
  'r.b..rk.',
  'ppp..ppp',
  '..n.qn..',
  '...p....',
  '...P...B',
  '..P.QN..',
  'PP...PPP',
  'R...R.K.',
];
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

export function DecorativeBoard() {
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
