const previewMarkup = `
  <div id="modalOverlay" class="modal-backdrop" role="presentation">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-header">
        <h3 id="modalTitle">Position preview</h3>
        <button class="close" id="closeModal" aria-label="Close preview" type="button">×</button>
      </div>
      <div class="modal-body">
        <div
          id="modalBoard"
          class="board"
          role="img"
          aria-label="Illustrative chess position"
        ></div>
        <div class="modal-info">
          <span class="demo-pill">
            <i></i>
            Not a playable puzzle
          </span>
          <p id="modalDescription">Sample chess board for interface demonstration.</p>
          <ul>
            <li>In the completed project, this preview will use the puzzle's real FEN.</li>
            <li>The final practice button will open a verified Lichess puzzle.</li>
          </ul>
          <button id="modalCloseButton" class="primary">Back to explorer</button>
        </div>
      </div>
    </div>
  </div>
`;

export function initializePuzzlePreview(root, renderBoard) {
  root.innerHTML = previewMarkup;
  const page = root.ownerDocument;
  const getElement = (id) => root.querySelector(`#${id}`);

  function openPreview(index, difficulty, pairLabel) {
    getElement('modalTitle').textContent = `${difficulty} position preview`;
    getElement('modalBoard').innerHTML = renderBoard(index);
    getElement('modalDescription').textContent =
      `This ${pairLabel} board is a visual placeholder. Real puzzle positions and associations will come from the processed Lichess dataset.`;
    getElement('modalOverlay').classList.add('open');
    getElement('closeModal').focus();
    page.body.style.overflow = 'hidden';
  }

  function closePreview() {
    getElement('modalOverlay').classList.remove('open');
    page.body.style.overflow = '';
  }

  getElement('closeModal').addEventListener('click', closePreview);
  getElement('modalCloseButton').addEventListener('click', closePreview);
  getElement('modalOverlay').addEventListener('click', (event) => {
    if (event.target === getElement('modalOverlay')) {
      closePreview();
    }
  });
  page.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && getElement('modalOverlay').classList.contains('open')) {
      closePreview();
    }
  });

  return openPreview;
}
