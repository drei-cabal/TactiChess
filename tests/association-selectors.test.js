import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  createInitialSelection,
  selectVisibleRules,
  updateSelection,
} from '../src/features/explorer/association-selectors.js';

const { rules } = JSON.parse(
  await readFile(new URL('../public/data/associations.json', import.meta.url))
);

test('initial and reset states select Fork and its first exported recommendation', () => {
  const initial = createInitialSelection(rules);
  assert.deepEqual(initial, {
    theme: 'fork',
    difficulty: 'All',
    support: 0.2,
    sort: 'curated',
    pair: 'sacrifice',
  });
  initial.theme = 'pin';
  assert.equal(createInitialSelection(rules).theme, 'fork');
});

test('curated order preserves the export and every numeric sort is descending and nonmutating', () => {
  const snapshot = structuredClone(rules);
  const initial = createInitialSelection(rules);
  const exported = rules.filter((rule) => rule.source_theme === 'fork');
  assert.deepEqual(selectVisibleRules(rules, initial), exported);
  for (const sort of ['lift', 'support', 'confidence']) {
    assert.deepEqual(
      selectVisibleRules(rules, { ...initial, sort }),
      [...exported].sort((a, b) => b[sort] - a[sort])
    );
  }
  assert.deepEqual(rules, snapshot);
});

test('equal metric values retain export order', () => {
  const tied = rules
    .filter((rule) => rule.source_theme === 'fork')
    .map((rule) => ({ ...rule, lift: 2 }));
  assert.deepEqual(
    selectVisibleRules(tied, { ...createInitialSelection(tied), sort: 'lift' }),
    tied
  );
});

test('support compares stored fractions and includes the exact 0.20% boundary', () => {
  const selection = { ...createInitialSelection(rules), theme: 'pillsburysMate' };
  assert.equal(selectVisibleRules(rules, selection).length, 1);
  assert.equal(selectVisibleRules(rules, { ...selection, support: 0.21 }).length, 0);
});

test('selection persists while visible and falls back or clears when needed', () => {
  const selected = updateSelection(rules, createInitialSelection(rules), { pair: 'exposedKing' });
  assert.equal(updateSelection(rules, selected, { sort: 'lift' }).pair, 'exposedKing');
  assert.equal(updateSelection(rules, selected, { support: 1 }).pair, 'sacrifice');
  const empty = updateSelection(rules, selected, { support: 2.2 });
  assert.equal(empty.pair, null);
  assert.equal(updateSelection(rules, empty, { support: 0.2 }).pair, 'sacrifice');
  assert.equal(selected.pair, 'exposedKing');
});

test('theme changes choose that theme’s first exported rule', () => {
  const selection = updateSelection(rules, createInitialSelection(rules), {
    theme: 'pin',
    pair: null,
  });
  assert.equal(selection.pair, 'sacrifice');
});

test('difficulty state cannot modify the global training metrics', () => {
  const initial = createInitialSelection(rules);
  const snapshot = structuredClone(rules);
  for (const difficulty of ['Easy', 'Medium', 'Hard', 'All']) {
    const selection = updateSelection(rules, initial, { difficulty });
    assert.deepEqual(selectVisibleRules(rules, selection), selectVisibleRules(rules, initial));
  }
  assert.deepEqual(rules, snapshot);
});
