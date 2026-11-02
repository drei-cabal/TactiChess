import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  groupThemes,
  selectThemeExamples,
  themeGuide,
} from '../src/features/library/theme-catalog.js';

const { themes, rules } = JSON.parse(
  await readFile(new URL('../public/data/associations.json', import.meta.url))
);
const puzzles = JSON.parse(await readFile(new URL('../public/data/puzzles.json', import.meta.url)));

test('every exported theme has a beginner explanation and a recognition prompt', () => {
  assert.deepEqual(Object.keys(themeGuide).sort(), themes.map((theme) => theme.id).sort());
  for (const theme of themes) {
    assert.ok(themeGuide[theme.id].meaning.length > 30);
    assert.ok(themeGuide[theme.id].cue.length > 30);
  }
});

test('categories contain all 20 themes exactly once without changing exported objects or order', () => {
  const snapshot = structuredClone(themes);
  const categories = groupThemes(themes);
  const grouped = categories.flatMap((category) => category.themes);
  assert.deepEqual(grouped.map((theme) => theme.id).sort(), themes.map((theme) => theme.id).sort());
  assert.equal(new Set(grouped.map((theme) => theme.id)).size, 20);
  assert.deepEqual(
    categories.map((category) => category.themes.length),
    [10, 7, 2, 1]
  );
  assert.ok(
    categories
      .find((category) => category.id === 'checkmates')
      .themes.some((theme) => theme.id === 'pillsburysMate')
  );
  assert.equal(
    categories.find((category) => category.id === 'special-moves').themes[0].id,
    'promotion'
  );
  for (const category of categories) {
    assert.deepEqual(
      category.themes,
      themes.filter((theme) => category.themes.includes(theme))
    );
  }
  assert.ok(grouped.every((theme) => themes.includes(theme)));
  assert.deepEqual(themes, snapshot);
});

test('every theme gets two distinct original examples without changing any exports', () => {
  const snapshot = JSON.stringify({ themes, rules, puzzles });
  const originalPuzzles = Object.values(puzzles).flat();
  for (const theme of themes) {
    const examples = selectThemeExamples(puzzles, rules, theme.id);
    assert.equal(examples.length, 2, theme.name);
    assert.equal(new Set(examples.map((puzzle) => puzzle.puzzle_id)).size, 2, theme.name);
    assert.ok(
      examples.every((puzzle) => puzzle.themes.includes(theme.id)),
      theme.name
    );
    assert.ok(
      examples.every((puzzle) => originalPuzzles.includes(puzzle)),
      theme.name
    );
    assert.ok(examples[0].rating <= examples[1].rating, theme.name);
  }
  assert.equal(JSON.stringify({ themes, rules, puzzles }), snapshot);
});

test('example selection uses either rule direction, removes duplicates, and prefers lower ratings', () => {
  const low = { puzzle_id: 'low', themes: ['fork', 'pin'], rating: 500 };
  const middle = { puzzle_id: 'middle', themes: ['fork', 'pin'], rating: 900 };
  const high = { puzzle_id: 'high', themes: ['fork', 'pin'], rating: 1500 };
  const other = { puzzle_id: 'other', themes: ['pin'], rating: 100 };
  const pairs = { 'fork|pin': [high, middle, low], 'fork|skewer': [low, other] };
  const connections = [
    { source_theme: 'pin', related_theme: 'fork', pair_key: 'fork|pin' },
    { source_theme: 'fork', related_theme: 'pin', pair_key: 'fork|pin' },
    { source_theme: 'fork', related_theme: 'skewer', pair_key: 'fork|skewer' },
  ];
  assert.deepEqual(selectThemeExamples(pairs, connections, 'fork'), [low, middle]);
  assert.deepEqual(selectThemeExamples(pairs, connections, 'missing'), []);
  assert.deepEqual(selectThemeExamples({}, connections, 'fork'), []);
});
