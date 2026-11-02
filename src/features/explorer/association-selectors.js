export function createInitialSelection(rules) {
  return {
    theme: 'fork',
    difficulty: 'All',
    support: 0.2,
    sort: 'curated',
    pair: rules.find((rule) => rule.source_theme === 'fork')?.related_theme ?? null,
  };
}

export function selectVisibleRules(rules, selection) {
  const visible = rules.filter(
    (rule) => rule.source_theme === selection.theme && rule.support >= selection.support / 100
  );
  if (selection.sort !== 'curated') {
    visible.sort((a, b) => b[selection.sort] - a[selection.sort]);
  }
  return visible;
}

export function updateSelection(rules, selection, changes) {
  const next = { ...selection, ...changes };
  const visible = selectVisibleRules(rules, next);
  if (!visible.some((rule) => rule.related_theme === next.pair)) {
    next.pair = visible[0]?.related_theme ?? null;
  }
  return next;
}
