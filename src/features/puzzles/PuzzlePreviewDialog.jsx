import { PuzzleTags } from './PuzzleTags.jsx';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { StaticBoard } from './StaticBoard.jsx';

export function PuzzlePreviewDialog({
  puzzle,
  themeNames,
  onDismiss,
  returnLabel = 'Back to explorer',
  className = '',
}) {
  const dialog = useRef(null);
  const closeButton = useRef(null);

  useEffect(() => {
    const element = dialog.current;
    const openingControl = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    closeButton.current.focus();
    document.body.style.overflow = 'hidden';
    window.addEventListener('hashchange', onDismiss);

    return () => {
      window.removeEventListener('hashchange', onDismiss);
      if (element.open) {
        element.close();
      }
      document.body.style.overflow = previousOverflow;
      if (openingControl?.isConnected && openingControl.getClientRects().length) {
        openingControl.focus({ preventScroll: true });
      } else {
        document.getElementById('mainContent')?.focus({ preventScroll: true });
      }
    };
  }, [onDismiss]);

  return createPortal(
    <dialog
      ref={dialog}
      className={`modal puzzle-dialog ${className}`}
      aria-labelledby="previewTitle"
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          ) {
            onDismiss();
          }
        }
      }}
    >
      <div className="modal-header">
        <h2 id="previewTitle">Puzzle preview</h2>
        <button
          ref={closeButton}
          className="close"
          type="button"
          aria-label="Close preview"
          onClick={onDismiss}
        >
          ×
        </button>
      </div>
      <div className="modal-body">
        <StaticBoard previewFen={puzzle.preview_fen} label={`Puzzle ${puzzle.puzzle_id}`} />
        <div className="modal-info">
          <p>
            {puzzle.difficulty} · Rating {puzzle.rating.toLocaleString('en-US')}
          </p>
          <p>{puzzle.preview_fen.split(' ')[1] === 'w' ? 'White' : 'Black'} to move</p>
          <p>Preview only: pieces cannot be moved here. Solve this position on Lichess.</p>
          <PuzzleTags puzzle={puzzle} themeNames={themeNames} />
          <a className="primary" href={puzzle.puzzle_url} target="_blank" rel="noopener noreferrer">
            Solve on Lichess ↗
          </a>
          <button className="card-cta" type="button" onClick={onDismiss}>
            {returnLabel}
          </button>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
