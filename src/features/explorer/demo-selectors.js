import { pairs } from './demo-data.js';

export function createInitialSelection() {
  return { theme: 'fork', difficulty: 'All', support: 5, sort: 'lift', pair: 'pin' };
}

export function selectVisiblePairs(selection) {
  return pairs[selection.theme]
    .filter((pair) => pair.support >= selection.support)
    .sort((a, b) => b[selection.sort] - a[selection.sort]);
}

export function updateDemoSelection(selection, changes) {
  const next = { ...selection, ...changes };
  const visiblePairs = selectVisiblePairs(next);

  // Keep a visible selection, or choose the first remaining association.
  if (!visiblePairs.some((pair) => pair.id === next.pair)) {
    next.pair = visiblePairs[0]?.id ?? null;
  }

  return next;
}
