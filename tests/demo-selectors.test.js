import assert from 'node:assert/strict';
import test from 'node:test';
import { pairs } from '../src/features/explorer/demo-data.js';
import {
  createInitialSelection,
  selectVisiblePairs,
  updateDemoSelection,
} from '../src/features/explorer/demo-selectors.js';

test('initial and reset selections are independent and preserve demo defaults', () => {
  const selection = createInitialSelection();
  selection.theme = 'pin';

  assert.deepEqual(createInitialSelection(), {
    theme: 'fork',
    difficulty: 'All',
    support: 5,
    sort: 'lift',
    pair: 'pin',
  });
});

test('each sort mode uses descending metrics without changing the source order', () => {
  const snapshot = structuredClone(pairs);
  const selection = { ...createInitialSelection(), theme: 'pin' };

  for (const [sort, expected] of [
    ['lift', ['skewer', 'fork', 'deflection']],
    ['support', ['fork', 'skewer', 'deflection']],
    ['confidence', ['fork', 'skewer', 'deflection']],
  ]) {
    assert.deepEqual(
      selectVisiblePairs({ ...selection, sort }).map((pair) => pair.id),
      expected
    );
  }

  assert.deepEqual(pairs, snapshot);
});

test('support filtering includes the exact boundary', () => {
  const selection = { ...createInitialSelection(), support: 14.2 };

  assert.deepEqual(
    selectVisiblePairs(selection).map((pair) => pair.id),
    ['pin']
  );
  assert.deepEqual(selectVisiblePairs({ ...selection, support: 14.21 }), []);
});

test('selection remains when visible and falls back when filtered out', () => {
  const selection = updateDemoSelection(createInitialSelection(), { pair: 'sacrifice' });

  assert.equal(updateDemoSelection(selection, { sort: 'confidence' }).pair, 'sacrifice');
  assert.equal(updateDemoSelection(selection, { support: 10 }).pair, 'pin');
  assert.equal(selection.pair, 'sacrifice');
});

test('empty results clear selection and lowering support restores the first result', () => {
  const empty = updateDemoSelection(createInitialSelection(), { support: 20 });

  assert.equal(empty.pair, null);
  assert.equal(updateDemoSelection(empty, { support: 5 }).pair, 'pin');
});

test('theme changes select the first recommendation in the current sort order', () => {
  const selection = updateDemoSelection(createInitialSelection(), { theme: 'pin', pair: null });

  assert.equal(selection.pair, 'skewer');
  assert.equal(createInitialSelection().theme, 'fork');
});

test('difficulty changes leave every association metric and selection unchanged', () => {
  const initial = createInitialSelection();
  const snapshot = structuredClone(pairs);

  for (const difficulty of ['Easy', 'Medium', 'Hard', 'All']) {
    const selection = updateDemoSelection(initial, { difficulty });
    assert.deepEqual(selectVisiblePairs(selection), selectVisiblePairs(initial));
    assert.equal(selection.pair, initial.pair);
  }

  assert.deepEqual(pairs, snapshot);
});
