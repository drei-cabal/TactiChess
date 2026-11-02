import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { boards } from '../explorer/demo-data.js';
import { DemoBoard } from './DemoBoard.jsx';

export function PuzzlePreviewDialog({ preview, onClose }) {
  const closeButton = useRef(null);

  useEffect(() => {
    if (!preview) {
      return;
    }

    const openingControl = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current.focus();

    function dismissOnEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', dismissOnEscape);
    return () => {
      document.removeEventListener('keydown', dismissOnEscape);
      document.body.style.overflow = previousOverflow;
      if (openingControl.isConnected) {
        openingControl.focus({ preventScroll: true });
      }
    };
  }, [preview, onClose]);

  // Keep the overlay outside the main landmark and any future stacking context.
  return createPortal(
    <div id="previewRoot">
      <div
        id="modalOverlay"
        className={`modal-backdrop${preview ? ' open' : ''}`}
        role="presentation"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div className="modal-header">
            <h3 id="modalTitle">
              {preview ? `${preview.difficulty} position preview` : 'Position preview'}
            </h3>
            <button
              ref={closeButton}
              className="close"
              id="closeModal"
              aria-label="Close preview"
              type="button"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <div
              id="modalBoard"
              className="board"
              role="img"
              aria-label="Illustrative chess position"
            >
              {preview && <DemoBoard position={boards[preview.positionIndex]} />}
            </div>
            <div className="modal-info">
              <span className="demo-pill">
                <i></i>
                Not a playable puzzle
              </span>
              <p id="modalDescription">
                {preview
                  ? `This ${preview.pairLabel} board is a visual placeholder. Real puzzle positions and associations will come from the processed Lichess dataset.`
                  : 'Sample chess board for interface demonstration.'}
              </p>
              <ul>
                <li>In the completed project, this preview will use the puzzle's real FEN.</li>
                <li>The final practice button will open a verified Lichess puzzle.</li>
              </ul>
              <button id="modalCloseButton" className="primary" onClick={onClose}>
                Back to explorer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
