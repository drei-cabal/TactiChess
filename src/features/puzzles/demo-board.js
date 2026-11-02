// Match board letters to the displayed pieces.
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

export function renderDemoBoard(position) {
  return position
    .map((row, r) =>
      [...row]
        .map(
          (ch, c) =>
            `<span class="square ${(r + c) % 2 ? 'dark' : 'light'}" aria-hidden="true">${ch === '.' ? '' : `<span class="piece ${ch === ch.toUpperCase() ? 'white' : 'black'}">${pieceMap[ch] || ''}</span>`}</span>`
        )
        .join('')
    )
    .join('');
}
