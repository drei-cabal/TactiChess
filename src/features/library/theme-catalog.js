// Learning copy stays separate from the unchanged research exports.
export const themeGuide = {
  advancedPawn: {
    meaning:
      'A pawn has travelled far into the other side of the board. Getting it closer to the last row can make it a serious threat.',
    cue: 'Look for a pawn near promotion. Can you help it advance, or force the opponent to stop it?',
  },
  attraction: {
    meaning:
      'Lure an enemy piece onto a square where you can use another tactic against it. You may offer a piece to tempt it there.',
    cue: 'Ask where you would like an enemy piece to stand. Can a check or an offer of a piece draw it there?',
  },
  backRankMate: {
    meaning:
      'A king is checkmated on its starting row, often because its own pawns block its escape. A rook or queen usually delivers the check.',
    cue: 'Look for a king stuck behind its own pieces and a route for a rook or queen to reach that row.',
  },
  clearance: {
    meaning:
      'Move one of your own pieces out of the way so another piece can use the square or the open path.',
    cue: 'Find a promising path for your rook, bishop, or queen. Is one of your own pieces blocking it?',
  },
  defensiveMove: {
    meaning:
      'Sometimes the best move stops your opponent’s plan. Protect a piece, stop checkmate, or remove a threat before attacking.',
    cue: 'Ask what the opponent threatens next. Look for a move that deals with that threat without creating a new problem.',
  },
  deflection: {
    meaning:
      'Pull an enemy defender away from something it protects. Once it leaves, that piece or square can become vulnerable.',
    cue: 'Find the piece guarding your target. Can you force it to leave its job?',
  },
  discoveredAttack: {
    meaning:
      'Moving one piece uncovers an attack by a piece behind it. The piece that moves may create a second threat too.',
    cue: 'Look behind your pieces. Could moving one uncover a line from a bishop, rook, or queen to an enemy target?',
  },
  discoveredCheck: {
    meaning:
      'Move a piece out of the way so a bishop, rook, or queen behind it gives check. The opponent must answer the threat to their king.',
    cue: 'Look for a piece between your long-range attacker and the enemy king. What happens when it moves?',
  },
  exposedKing: {
    meaning:
      'The enemy king has little shelter. Open paths and missing defenders can let your pieces attack it.',
    cue: 'Look for gaps around the king. Can your pieces reach it before the opponent brings defenders back?',
  },
  fork: {
    meaning:
      'One piece attacks two or more enemy pieces at the same time. Your opponent may save one target and leave another to be captured.',
    cue: 'Look for a square where one piece can threaten two targets. Knights are useful, but any piece can make a fork.',
  },
  hangingPiece: {
    meaning:
      'An enemy piece can be taken because it has too little protection. Check whether capturing it wins a piece or allows a stronger reply.',
    cue: 'Look for pieces with no defender, then check what the opponent could do after you capture.',
  },
  kingsideAttack: {
    meaning:
      'Attack a king that has castled toward the side where its king started. Look near the f, g, and h columns of the board.',
    cue: 'Look for gaps in the pawns around that king and ways to bring more attacking pieces toward it.',
  },
  pillsburysMate: {
    meaning:
      'A rook gives checkmate while a bishop takes away the king’s escape squares. The two pieces work together to trap the king.',
    cue: 'Check which squares your bishop controls near the king. Can a rook give check while those exits stay covered?',
  },
  pin: {
    meaning:
      'An enemy piece is stuck in front of something valuable. Moving it would expose its king or another important piece to attack.',
    cue: 'Look for two enemy pieces lined up with your bishop, rook, or queen. What would moving the front piece expose?',
  },
  promotion: {
    meaning:
      'When your pawn reaches the farthest row, it becomes a queen, rook, bishop, or knight. Choosing the right piece can change the game.',
    cue: 'Look for a pawn that can reach the last row. Check the opponent’s reply before automatically choosing a queen.',
  },
  queensideAttack: {
    meaning:
      'Attack a king that has castled toward the side where its queen started. Look near the a, b, and c columns of the board.',
    cue: 'Look for open paths and weak pawns near that king. Which of your pieces can join the attack?',
  },
  quietMove: {
    meaning:
      'Prepare a strong idea with a move that gives no check, takes no piece, and makes no immediate threat to capture. The danger comes later.',
    cue: 'If checks and captures do not help, ask whether improving one piece could prepare a threat the opponent cannot stop.',
  },
  sacrifice: {
    meaning:
      'Give up a piece or pawn on purpose to gain something more useful, such as a stronger attack or a way to checkmate.',
    cue: 'Before offering a piece, work out what you gain if it is taken. An open path or an exposed king may be worth the cost.',
  },
  skewer: {
    meaning:
      'Attack an important enemy piece with another piece behind it on the same line. When the front piece moves, you can take the one behind.',
    cue: 'Look along a row, column, or diagonal for two enemy pieces. Can you attack the more valuable one in front?',
  },
  zugzwang: {
    meaning:
      'A player would prefer to pass, but chess requires a move. Every legal move makes that player’s position worse.',
    cue: 'Ask what the opponent would have to give up if it were their turn. Can a waiting move leave them without a safe choice?',
  },
};

// Membership follows the categories on Lichess's puzzle-theme reference.
const themeCategories = [
  {
    id: 'motifs',
    name: 'Tactical motifs',
    description: 'Recognizable patterns that help you win pieces or build an attack.',
    themeIds: [
      'advancedPawn',
      'discoveredAttack',
      'exposedKing',
      'fork',
      'hangingPiece',
      'kingsideAttack',
      'pin',
      'queensideAttack',
      'sacrifice',
      'skewer',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced ideas',
    description: 'Ways to prepare a tactic, disrupt a defender, or protect your own position.',
    themeIds: [
      'attraction',
      'clearance',
      'defensiveMove',
      'deflection',
      'discoveredCheck',
      'quietMove',
      'zugzwang',
    ],
  },
  {
    id: 'checkmates',
    name: 'Checkmate patterns',
    description: 'See how pieces work together to check a king and leave it with no escape.',
    themeIds: ['backRankMate', 'pillsburysMate'],
  },
  {
    id: 'special-moves',
    name: 'Special moves',
    description: 'A special chess rule can turn a small pawn into a powerful new piece.',
    themeIds: ['promotion'],
  },
];

export function groupThemes(themes) {
  return themeCategories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    themes: themes.filter((theme) => category.themeIds.includes(theme.id)),
  }));
}

export function selectThemeExamples(puzzles, rules, themeId) {
  const pairKeys = new Set(
    rules
      .filter((rule) => rule.source_theme === themeId || rule.related_theme === themeId)
      .map((rule) => rule.pair_key)
  );
  const uniquePuzzles = new Map();
  for (const pairKey of pairKeys) {
    for (const puzzle of puzzles[pairKey] ?? []) {
      if (puzzle.themes.includes(themeId) && !uniquePuzzles.has(puzzle.puzzle_id)) {
        uniquePuzzles.set(puzzle.puzzle_id, puzzle);
      }
    }
  }
  return [...uniquePuzzles.values()].sort((a, b) => a.rating - b.rating).slice(0, 2);
}
