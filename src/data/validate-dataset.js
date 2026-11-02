import { Position } from 'cm-chessboard/src/model/Position.js';

function requireValid(condition, message) {
  if (!condition) {
    throw new Error(`Invalid dataset: ${message}`);
  }
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const isCount = (value) => Number.isSafeInteger(value) && value > 0;
const isPositive = (value) => Number.isFinite(value) && value > 0;
const approximatelyEqual = (a, b) => Math.abs(a - b) < 1e-10;

function isPreviewPosition(fen) {
  const fields = fen.split(' ');
  if (
    fields.length !== 6 ||
    !['w', 'b'].includes(fields[1]) ||
    !/^([prnbqkPRNBQK1-8]+\/){7}[prnbqkPRNBQK1-8]+$/.test(fields[0])
  ) {
    return false;
  }
  return new Position(fen).getFen() === fields[0];
}

export function validateDataset({ associations, puzzles, metadata }) {
  requireValid(isObject(metadata), 'metadata.json must contain an object.');
  for (const field of [
    'project',
    'algorithm',
    'source',
    'source_updated',
    'license',
    'puzzle_source',
  ]) {
    requireValid(isText(metadata[field]), `metadata.json is missing ${field}.`);
  }
  requireValid(
    metadata.training_puzzles === 400000 &&
      metadata.testing_puzzles === 100000 &&
      metadata.total_sample === 500000 &&
      metadata.curated_rules === 48 &&
      metadata.unique_curated_pairs === 34 &&
      metadata.maximum_itemset_size === 2 &&
      metadata.minimum_support === 0.002 &&
      metadata.minimum_curated_lift === 1.2 &&
      metadata.algorithm === 'ECLAT',
    'metadata.json does not match the frozen export parameters.'
  );
  requireValid(
    Number.isSafeInteger(metadata.sampling_seed) && Number.isSafeInteger(metadata.split_seed),
    'metadata.json must include numeric sampling and split seeds.'
  );
  requireValid(
    isObject(metadata.example_rating_bands) &&
      ['Easy', 'Medium', 'Hard'].every((band) => isText(metadata.example_rating_bands[band])) &&
      Array.isArray(metadata.limitations) &&
      metadata.limitations.length > 0 &&
      metadata.limitations.every(isText),
    'metadata.json must include rating bands and limitations.'
  );

  requireValid(
    isObject(associations) &&
      Array.isArray(associations.themes) &&
      Array.isArray(associations.rules),
    'associations.json must contain themes and rules arrays.'
  );
  const { themes, rules } = associations;
  requireValid(
    themes.length === 20 && rules.length === metadata.curated_rules,
    'associations.json must contain 20 themes and 48 rules.'
  );
  const themeIds = new Set();
  for (const theme of themes) {
    requireValid(
      isObject(theme) && ['id', 'name', 'description'].every((field) => isText(theme[field])),
      'Each theme must have an id, name, and description.'
    );
    requireValid(!themeIds.has(theme.id), `Duplicate theme ${theme.id}.`);
    themeIds.add(theme.id);
  }

  const directions = new Set();
  const pairKeys = new Set();
  const sourceThemes = new Set();
  for (const rule of rules) {
    requireValid(
      isObject(rule) &&
        themeIds.has(rule.source_theme) &&
        themeIds.has(rule.related_theme) &&
        rule.source_theme !== rule.related_theme,
      'A rule references an invalid theme.'
    );
    const direction = `${rule.source_theme}|${rule.related_theme}`;
    requireValid(!directions.has(direction), `Duplicate directional rule ${direction}.`);
    directions.add(direction);
    sourceThemes.add(rule.source_theme);
    requireValid(
      rule.pair_key === [rule.source_theme, rule.related_theme].sort().join('|'),
      `Invalid pair_key for ${direction}.`
    );
    pairKeys.add(rule.pair_key);
    requireValid(
      ['source_count', 'related_count', 'pair_count'].every((field) => isCount(rule[field])) &&
        rule.pair_count <= Math.min(rule.source_count, rule.related_count) &&
        Math.max(rule.source_count, rule.related_count) <= metadata.training_puzzles,
      `Invalid training counts for ${direction}.`
    );
    requireValid(
      ['support', 'confidence', 'lift'].every((field) => isPositive(rule[field])) &&
        rule.support >= metadata.minimum_support &&
        rule.confidence <= 1 &&
        rule.lift >= metadata.minimum_curated_lift &&
        approximatelyEqual(rule.support, rule.pair_count / metadata.training_puzzles) &&
        approximatelyEqual(rule.confidence, rule.pair_count / rule.source_count) &&
        approximatelyEqual(
          rule.lift,
          rule.confidence / (rule.related_count / metadata.training_puzzles)
        ),
      `Invalid training metrics for ${direction}.`
    );
  }
  requireValid(
    themeIds.has('fork') &&
      sourceThemes.size === themes.length &&
      pairKeys.size === metadata.unique_curated_pairs,
    'Rules must cover all 20 source themes and 34 pairs.'
  );

  requireValid(
    isObject(puzzles) &&
      Object.keys(puzzles).length === pairKeys.size &&
      Object.keys(puzzles).every((key) => pairKeys.has(key)),
    'puzzles.json must contain exactly the 34 referenced pair keys.'
  );
  let entryCount = 0;
  for (const [pairKey, examples] of Object.entries(puzzles)) {
    requireValid(
      Array.isArray(examples) && examples.length > 0,
      `Missing examples for ${pairKey}.`
    );
    const puzzleIds = new Set();
    for (const puzzle of examples) {
      requireValid(
        isObject(puzzle) &&
          ['puzzle_id', 'original_fen', 'preview_fen', 'puzzle_url'].every((field) =>
            isText(puzzle[field])
          ) &&
          Array.isArray(puzzle.themes) &&
          puzzle.themes.every(isText) &&
          pairKey.split('|').every((theme) => puzzle.themes.includes(theme)) &&
          Array.isArray(puzzle.moves) &&
          puzzle.moves.length > 0 &&
          puzzle.moves.every(isText),
        `Invalid puzzle fields in ${pairKey}.`
      );
      requireValid(!puzzleIds.has(puzzle.puzzle_id), `Duplicate puzzle in ${pairKey}.`);
      requireValid(
        isPreviewPosition(puzzle.preview_fen),
        `Invalid preview FEN for puzzle ${puzzle.puzzle_id}.`
      );
      puzzleIds.add(puzzle.puzzle_id);
      requireValid(
        isCount(puzzle.rating) &&
          puzzle.difficulty ===
            (puzzle.rating <= 1200 ? 'Easy' : puzzle.rating <= 1800 ? 'Medium' : 'Hard'),
        `Invalid rating or difficulty for puzzle ${puzzle.puzzle_id}.`
      );
      requireValid(
        /^[a-zA-Z0-9]+$/.test(puzzle.puzzle_id) &&
          puzzle.puzzle_url === `https://lichess.org/training/${puzzle.puzzle_id}`,
        `Invalid Lichess link for puzzle ${puzzle.puzzle_id}.`
      );
      entryCount += 1;
    }
  }
  requireValid(entryCount === 506, 'puzzles.json must contain 506 pair-specific entries.');

  // Preserve the original objects, values, and export order.
  return { associations, puzzles, metadata };
}
