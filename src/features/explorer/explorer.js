import { boards, pairs, themes } from './demo-data.js';
import { renderDemoBoard } from '../puzzles/demo-board.js';

export function initializeExplorer(root, openPreview) {
  // Shared selection state and element lookups.
  const titleCase = (id) => themes.find((t) => t.id === id)?.label || id;
  const iconFor = (id) => themes.find((t) => t.id === id)?.icon || '♞';

  const state = {
    theme: 'fork',
    difficulty: 'All',
    support: 5,
    sort: 'lift',
    pair: 'pin',
  };

  const $ = (id) => root.querySelector(`#${id}`);

  // Build the board and explorer content.
  function boardHtml(index) {
    return renderDemoBoard(boards[index % boards.length]);
  }

  function renderThemes() {
    $('themeGrid').innerHTML = themes
      .map(
        (t) =>
          `
            <button
              type="button"
              class="theme-chip ${t.id === state.theme ? 'active' : ''}"
              data-theme="${t.id}"
              aria-pressed="${t.id === state.theme}"
            >
              <span class="sym">${t.icon}</span>
              ${t.label}
            </button>
          `
      )
      .join('');
  }

  function visiblePairs() {
    return pairs[state.theme]
      .filter((p) => p.support >= state.support)
      .sort((a, b) => b[state.sort] - a[state.sort]);
  }

  function renderPatterns() {
    const list = visiblePairs();
    // Choose another pair when the selected pair is filtered out.
    if (!list.some((p) => p.id === state.pair)) {
      state.pair = list[0]?.id || null;
    }

    $('resultCount').textContent = `${list.length} ${list.length === 1 ? 'pattern' : 'patterns'}`;
    $('resultsSubtitle').textContent = `Themes associated with ${titleCase(state.theme)}`;
    $('patterns').innerHTML = list.length
      ? list
          .map(
            (p) =>
              `
                <button
                  type="button"
                  class="pattern ${state.pair === p.id ? 'selected' : ''}"
                  data-pair="${p.id}"
                  aria-pressed="${state.pair === p.id}"
                >
                  <div class="pattern-main">
                    <div class="pattern-graphic">
                      <span class="mini-icon">${iconFor(state.theme)}</span>
                      <span class="mini-icon">${iconFor(p.id)}</span>
                      <span class="combo">
                        ${titleCase(state.theme)}
                        <small>+</small>
                        ${titleCase(p.id)}
                      </span>
                    </div>
                    <div class="pattern-desc">Select to preview matching puzzle cards</div>
                  </div>
                  <div class="metrics">
                    <span>
                      <strong>${p.support.toFixed(1)}%</strong>
                      <small>Support</small>
                    </span>
                    <span>
                      <strong>${p.confidence}%</strong>
                      <small>Confidence</small>
                    </span>
                    <span>
                      <strong>${p.lift.toFixed(2)}×</strong>
                      <small>Lift</small>
                    </span>
                  </div>
                  <span class="chevron">›</span>
                </button>
              `
          )
          .join('')
      : `<div class="empty">No demo patterns meet the selected support threshold. Lower the threshold or choose another tactic.</div>`;
    renderPuzzles();
  }

  function renderPuzzles() {
    $('practiceSubtitle').textContent = state.pair
      ? `Illustrative board layouts · ${titleCase(state.theme)} + ${titleCase(state.pair)}`
      : 'Adjust filters to reveal patterns';
    if (!state.pair) {
      $('puzzles').innerHTML =
        '<div class="empty" style="grid-column:1/-1">No associated tactic is selected.</div>';
      return;
    }
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const filtered = difficulties
      .map((difficulty, i) => ({ difficulty, i }))
      .filter((p) => state.difficulty === 'All' || p.difficulty === state.difficulty);
    $('puzzles').innerHTML = filtered
      .map(({ difficulty, i }) => {
        const idx =
          (themes.findIndex((t) => t.id === state.theme) * 2 +
            themes.findIndex((t) => t.id === state.pair) +
            i) %
          boards.length;
        return `
          <article class="puzzle-card">
            <div class="card-top">
              <span class="card-number">0${i + 1}</span>
              <div class="board" aria-label="Sample chess board">${boardHtml(idx)}</div>
            </div>
            <div class="card-bottom">
              <div class="card-name">${difficulty} · Sample position</div>
              <div class="card-tags">
                <span>${titleCase(state.theme)}</span>
                <span>${titleCase(state.pair)}</span>
              </div>
              <button type="button" class="card-cta" data-position="${idx}" data-difficulty="${difficulty}">
                Preview position
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function update() {
    renderThemes();
    renderPatterns();
  }

  // Listen on containers because their buttons are rebuilt.
  $('themeGrid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-theme]');
    if (b) {
      state.theme = b.dataset.theme;
      state.pair = null;
      update();
    }
  });

  $('difficulty').addEventListener('click', (e) => {
    const b = e.target.closest('[data-difficulty]');
    if (!b) {
      return;
    }
    state.difficulty = b.dataset.difficulty;
    $('difficulty')
      .querySelectorAll('[data-difficulty]')
      .forEach((el) => {
        const active = el === b;
        el.classList.toggle('active', active);
        el.setAttribute('aria-pressed', active);
      });
    renderPuzzles();
  });

  $('support').addEventListener('input', (e) => {
    state.support = Number(e.target.value);
    $('supportValue').textContent = `${state.support}%`;
    renderPatterns();
  });

  $('sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderPatterns();
  });

  $('patterns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-pair]');
    if (b) {
      state.pair = b.dataset.pair;
      renderPatterns();
    }
  });

  $('puzzles').addEventListener('click', (e) => {
    const b = e.target.closest('[data-position]');
    if (b) {
      openPreview(
        Number(b.dataset.position),
        b.dataset.difficulty,
        `${titleCase(state.theme)} + ${titleCase(state.pair)}`
      );
    }
  });

  $('reset').addEventListener('click', () => {
    Object.assign(state, {
      theme: 'fork',
      difficulty: 'All',
      support: 5,
      sort: 'lift',
      pair: 'pin',
    });
    $('sort').value = 'lift';
    $('support').value = '5';
    $('supportValue').textContent = '5%';
    $('difficulty')
      .querySelectorAll('[data-difficulty]')
      .forEach((b) => {
        b.classList.toggle('active', b.dataset.difficulty === 'All');
        b.setAttribute('aria-pressed', b.dataset.difficulty === 'All');
      });
    update();
  });

  update();
}
