import { useEffect, useRef, useState } from 'react';
import { BORDER_TYPE, Chessboard } from 'cm-chessboard/src/Chessboard.js';
import { Position } from 'cm-chessboard/src/model/Position.js';
import { renderPieceTitle } from 'cm-chessboard/src/extensions/accessibility/I18n.js';

const artworkUrl = `${import.meta.env.BASE_URL}chess/standard.svg`;
let artworkRequest;

function loadArtwork() {
  if (!artworkRequest) {
    artworkRequest = fetch(artworkUrl).then(async (response) => {
      if (!response.ok) {
        throw new Error('Chess artwork is unavailable.');
      }
      const svg = await response.text();
      if (!svg.includes('<svg') || !svg.includes('id="wk"') || !svg.includes('id="bk"')) {
        throw new Error('Chess artwork is invalid.');
      }
    });
  }
  return artworkRequest;
}

export function StaticBoard({ previewFen, label, compact = false }) {
  const container = useRef(null);
  const board = useRef(null);
  const latestFen = useRef(previewFen);
  const [failed, setFailed] = useState(false);
  const side = previewFen.split(' ')[1];
  const sideName = side === 'w' ? 'White' : 'Black';
  const pieces = new Position(previewFen).getPieces();

  useEffect(() => {
    let active = true;
    loadArtwork()
      .then(() => {
        if (!active) {
          return;
        }
        board.current = new Chessboard(container.current, {
          position: latestFen.current,
          orientation: latestFen.current.split(' ')[1],
          assetsCache: false,
          style: {
            cssClass: 'green',
            borderType: BORDER_TYPE.frame,
            pieces: { file: artworkUrl },
            animationDuration: 0,
          },
        });
        board.current.disableMoveInput();
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });

    return () => {
      active = false;
      board.current?.destroy();
      board.current = null;
    };
  }, []);

  useEffect(() => {
    latestFen.current = previewFen;
    const current = board.current;
    if (current) {
      Promise.all([
        current.setPosition(previewFen, false),
        current.setOrientation(side, false),
      ]).catch(() => {
        if (board.current === current) {
          setFailed(true);
        }
      });
    }
  }, [previewFen, side]);

  const description = (
    <>
      <p>
        {sideName} to move. {sideName} is at the bottom of the board.
      </p>
      <ul className="position-pieces" aria-label={`${label}: piece locations`}>
        {pieces.map((piece) => (
          <li key={piece.square}>
            {renderPieceTitle('en', piece.type, piece.color)} on {piece.square}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <figure className="position-preview" aria-label={label}>
      <div ref={container} className="static-board" aria-hidden="true" hidden={failed} />
      {failed && (
        <p className="board-error" role="status">
          This board could not be displayed. Read its position description or open the puzzle on
          Lichess.
        </p>
      )}
      {compact && !failed ? (
        <div className="visually-hidden">{description}</div>
      ) : (
        <details className="position-description">
          <summary>Position description</summary>
          {description}
        </details>
      )}
    </figure>
  );
}
