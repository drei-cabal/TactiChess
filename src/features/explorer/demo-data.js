// Demo content; the frozen JSON exports are not connected yet.
export const themes = [
  { id: 'fork', label: 'Fork', icon: '♞' },
  { id: 'pin', label: 'Pin', icon: '♝' },
  { id: 'skewer', label: 'Skewer', icon: '♜' },
  { id: 'sacrifice', label: 'Sacrifice', icon: '♕' },
  { id: 'discovered', label: 'Discovered', icon: '♙' },
  { id: 'deflection', label: 'Deflection', icon: '♔' },
];
export const pairs = {
  fork: [
    { id: 'pin', support: 14.2, confidence: 31, lift: 1.44 },
    { id: 'discovered', support: 9.8, confidence: 21, lift: 1.36 },
    { id: 'sacrifice', support: 7.2, confidence: 16, lift: 1.18 },
  ],
  pin: [
    { id: 'skewer', support: 11.5, confidence: 29, lift: 1.63 },
    { id: 'fork', support: 14.2, confidence: 34, lift: 1.44 },
    { id: 'deflection', support: 6.3, confidence: 16, lift: 1.14 },
  ],
  skewer: [
    { id: 'pin', support: 11.5, confidence: 35, lift: 1.63 },
    { id: 'discovered', support: 8.6, confidence: 25, lift: 1.32 },
    { id: 'sacrifice', support: 6.5, confidence: 19, lift: 1.16 },
  ],
  sacrifice: [
    { id: 'deflection', support: 12.1, confidence: 37, lift: 1.54 },
    { id: 'fork', support: 7.2, confidence: 22, lift: 1.18 },
    { id: 'pin', support: 6.7, confidence: 19, lift: 1.09 },
  ],
  discovered: [
    { id: 'fork', support: 9.8, confidence: 30, lift: 1.36 },
    { id: 'skewer', support: 8.6, confidence: 26, lift: 1.32 },
    { id: 'pin', support: 6.4, confidence: 18, lift: 1.12 },
  ],
  deflection: [
    { id: 'sacrifice', support: 12.1, confidence: 38, lift: 1.54 },
    { id: 'pin', support: 6.3, confidence: 22, lift: 1.14 },
    { id: 'fork', support: 5.5, confidence: 18, lift: 1.1 },
  ],
};
export const boards = [
  ['r..q.rk.', 'pp....pp', '..n.b...', '...n.p..', '...P....', '..N.QN..', 'PP...PPP', 'R...R.K.'],
  ['r.b..rk.', 'ppp..ppp', '..n.qn..', '...p....', '...P...B', '..P.QN..', 'PP...PPP', 'R...R.K.'],
  ['r...r.k.', 'p.p..ppp', '..n.p...', '.b.p....', '...P.P..', '..N.BN..', 'PPPQ..PP', 'R...R.K.'],
  ['..rq.rk.', 'pp..bppp', '..n.pn..', '...p....', '...P..B.', '..P.QN..', 'PP...PPP', 'R...R.K.'],
  ['r...r.k.', 'ppq..ppp', '..p..n..', '...p....', '...P.P..', '..N.BQ..', 'PP...PPP', 'R....RK.'],
  ['r.bq.rk.', 'pp...ppp', '..n.pn..', '...p....', '...P....', '..P.BN..', 'PPQ..PPP', 'R...R.K.'],
];
