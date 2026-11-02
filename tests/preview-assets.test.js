import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Position } from 'cm-chessboard/src/model/Position.js';
import { renderPieceTitle } from 'cm-chessboard/src/extensions/accessibility/I18n.js';

test('the approved Wikimedia sprite is byte-identical and retains its attribution', async () => {
  const sprite = await readFile(new URL('../public/chess/standard.svg', import.meta.url));
  assert.equal(
    createHash('sha256').update(sprite).digest('hex'),
    'b85bba95342a9483420999cedeb1c503e6db16cdd7a0da1f3a228549a13134c5'
  );
  assert.deepEqual(
    sprite,
    await readFile(
      new URL('../node_modules/cm-chessboard/assets/pieces/standard.svg', import.meta.url)
    )
  );
  const text = sprite.toString();
  for (const notice of ['CC BY-SA 3.0', 'Cburnett', 'Rfc1394', 'modified by shaack']) {
    assert.ok(text.includes(notice));
  }
});

test('the distributed code license and artwork notice preserve their separate obligations', async () => {
  const license = await readFile(
    new URL('../public/licenses/cm-chessboard-MIT.txt', import.meta.url)
  );
  assert.deepEqual(
    license,
    await readFile(new URL('../node_modules/cm-chessboard/LICENSE', import.meta.url))
  );
  const notice = await readFile(
    new URL('../public/licenses/chess-artwork.txt', import.meta.url),
    'utf8'
  );
  for (const text of [
    'cm-chessboard 8.15.4',
    'CC BY-SA 3.0',
    'Cburnett',
    'Rfc1394',
    'without changes',
  ]) {
    assert.ok(notice.includes(text));
  }
});

test('every exported preview round-trips through the library model with readable piece descriptions', async () => {
  const puzzles = JSON.parse(
    await readFile(new URL('../public/data/puzzles.json', import.meta.url))
  );
  for (const puzzle of Object.values(puzzles).flat()) {
    const position = new Position(puzzle.preview_fen);
    assert.equal(position.getFen(), puzzle.preview_fen.split(' ')[0]);
    assert.ok(['w', 'b'].includes(puzzle.preview_fen.split(' ')[1]));
    assert.notEqual(position.getFen(), puzzle.original_fen.split(' ')[0]);
    for (const piece of position.getPieces()) {
      assert.match(piece.square, /^[a-h][1-8]$/);
      assert.ok(!renderPieceTitle('en', piece.type, piece.color).includes('undefined'));
    }
  }
});
