import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { loadDataset } from '../src/data/load-dataset.js';
import { validateDataset } from '../src/data/validate-dataset.js';

const files = ['associations', 'puzzles', 'metadata'];
const bytes = await Promise.all(
  files.map((name) => readFile(new URL(`../public/data/${name}.json`, import.meta.url)))
);
const dataset = Object.fromEntries(files.map((name, index) => [name, JSON.parse(bytes[index])]));

test('all exports retain their original SHA-256 hashes after relocation', () => {
  const expected = [
    '8d48f5631bc8d7646b6a49caa17cfdb5a604ff0ce2ec93f2a8e0bdfc837ffc40',
    'c8e34fa0bf40bd812662fe39d7d53f67ec94ed58fb929aa3682be431d84195ee',
    '8f8bca697dfb5aee401145ca1267d2a66a66df09244e6cc3e94376e4e7addde0',
  ];
  assert.deepEqual(
    bytes.map((value) => createHash('sha256').update(value).digest('hex')),
    expected
  );
});

test('the complete frozen dataset validates without replacing or mutating its objects', () => {
  const snapshot = structuredClone(dataset);
  const result = validateDataset(dataset);

  for (const name of files) {
    assert.equal(result[name], dataset[name]);
  }
  assert.deepEqual(dataset, snapshot);
  assert.equal(result.associations.themes.length, 20);
  assert.equal(result.associations.rules.length, 48);
  assert.equal(Object.keys(result.puzzles).length, 34);
  assert.equal(Object.values(result.puzzles).flat().length, 506);
});

test('frozen rankings and semantic exclusions are preserved', () => {
  const exclusions = new Set([
    'advancedPawn|promotion',
    'discoveredAttack|discoveredCheck',
    'discoveredCheck|doubleCheck',
    'discoveredAttack|doubleCheck',
  ]);
  for (const theme of dataset.associations.themes) {
    const rules = dataset.associations.rules.filter((rule) => rule.source_theme === theme.id);
    assert.ok(rules.length >= 1 && rules.length <= 3);
    assert.ok(rules.every((rule) => !exclusions.has(rule.pair_key)));
    assert.deepEqual(
      rules,
      [...rules].sort(
        (a, b) => b.confidence - a.confidence || b.pair_count - a.pair_count || b.lift - a.lift
      )
    );
  }
});

test('every directional metric agrees with its training counts', () => {
  for (const rule of dataset.associations.rules) {
    assert.ok(Math.abs(rule.support - rule.pair_count / 400000) < 1e-10);
    assert.ok(Math.abs(rule.confidence - rule.pair_count / rule.source_count) < 1e-10);
    assert.ok(Math.abs(rule.lift - rule.confidence / (rule.related_count / 400000)) < 1e-10);
  }
});

for (const [name, mutate, expected] of [
  [
    'missing metadata',
    (data) => {
      data.metadata = null;
    },
    /metadata.json/,
  ],
  [
    'missing themes',
    (data) => {
      data.associations.themes.pop();
    },
    /20 themes/,
  ],
  [
    'invalid theme reference',
    (data) => {
      data.associations.rules[0].related_theme = 'unknown';
    },
    /invalid theme/,
  ],
  [
    'invalid metric',
    (data) => {
      data.associations.rules[0].confidence = NaN;
    },
    /training metrics/,
  ],
  [
    'changed training formula',
    (data) => {
      data.associations.rules[0].support += 0.001;
    },
    /training metrics/,
  ],
  [
    'invalid counts',
    (data) => {
      data.associations.rules[0].pair_count = -1;
    },
    /training counts/,
  ],
  [
    'missing pair examples',
    (data) => {
      delete data.puzzles[Object.keys(data.puzzles)[0]];
    },
    /34 referenced pair keys/,
  ],
  [
    'missing preview FEN',
    (data) => {
      delete Object.values(data.puzzles)[0][0].preview_fen;
    },
    /puzzle fields/,
  ],
  [
    'incorrect rating band',
    (data) => {
      Object.values(data.puzzles)[0][0].difficulty = 'Hard';
    },
    /rating or difficulty/,
  ],
  [
    'unsafe puzzle link',
    (data) => {
      Object.values(data.puzzles)[0][0].puzzle_url = 'javascript:alert(1)';
    },
    /Lichess link/,
  ],
  [
    'missing entry',
    (data) => {
      Object.values(data.puzzles)[0].pop();
    },
    /506/,
  ],
]) {
  test(`boundary validation rejects ${name}`, () => {
    const invalid = structuredClone(dataset);
    mutate(invalid);
    assert.throws(() => validateDataset(invalid), expected);
  });
}

test('rating boundaries use the exported Easy, Medium, and Hard contract', () => {
  for (const [rating, difficulty] of [
    [1200, 'Easy'],
    [1201, 'Medium'],
    [1800, 'Medium'],
    [1801, 'Hard'],
  ]) {
    const sample = structuredClone(dataset);
    Object.assign(Object.values(sample.puzzles)[0][0], { rating, difficulty });
    assert.doesNotThrow(() => validateDataset(sample));
  }
});

function fakeFetch(overrides = {}) {
  return async (url) => {
    const filename = url.split('/').at(-1);
    if (overrides[filename]) {
      return overrides[filename]();
    }
    return new Response(JSON.stringify(dataset[filename.replace('.json', '')]));
  };
}

test('one loading operation fetches each export once and respects the application base path', async () => {
  const requests = [];
  const fetchResource = fakeFetch();
  const loaded = await loadDataset('/tactichess/', async (url) => {
    requests.push(url);
    return fetchResource(url);
  });

  assert.deepEqual(
    requests,
    files.map((name) => `/tactichess/data/${name}.json`)
  );
  assert.deepEqual(loaded, dataset);
});

test('missing JSON fails with the filename and HTTP status', async () => {
  await assert.rejects(
    loadDataset(
      '/',
      fakeFetch({
        'puzzles.json': () => new Response('Not found', { status: 404 }),
      })
    ),
    /puzzles.json.*404/
  );
});

test('malformed JSON fails without using fallback data', async () => {
  await assert.rejects(
    loadDataset(
      '/',
      fakeFetch({
        'associations.json': () => new Response('{'),
      })
    ),
    /associations.json contains invalid JSON/
  );
});

test('network failures retain their cause and identify the failed file', async () => {
  const cause = new TypeError('Connection unavailable');
  await assert.rejects(
    loadDataset(
      '/',
      fakeFetch({
        'metadata.json': () => {
          throw cause;
        },
      })
    ),
    (error) => error.cause === cause && error.message.includes('metadata.json')
  );
});
