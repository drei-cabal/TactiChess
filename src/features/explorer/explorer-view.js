export const explorerMarkup = `
  <section id="discover">
    <div class="section-top">
      <div>
        <div class="kicker">The explorer</div>
        <h2>Discover tactic connections</h2>
        <p class="section-sub">
          Choose a tactical theme to explore its most common associations.
        </p>
      </div>
      <p class="guide-note">
        Patterns below are illustrative until the Colab ECLAT output is connected.
      </p>
    </div>
    <div class="explorer">
      <aside class="panel control-panel" aria-label="Exploration filters">
        <h3 class="panel-heading">Your exploration</h3>
        <p class="panel-description">
          Start with one tactic. We'll show related themes and sample practice positions.
        </p>
        <div class="control-label">
          Choose a tactic
          <small>1 selected</small>
        </div>
        <div
          id="themeGrid"
          class="theme-grid"
          role="group"
          aria-label="Choose a chess tactic"
        ></div>
        <hr class="control-divider" />
        <div class="control-label">Puzzle difficulty</div>
        <div class="segment" id="difficulty" role="group" aria-label="Puzzle difficulty">
          <button type="button" class="active" data-difficulty="All" aria-pressed="true">
            All
          </button>
          <button type="button" data-difficulty="Easy" aria-pressed="false">Easy</button>
          <button type="button" data-difficulty="Medium" aria-pressed="false">Med</button>
          <button type="button" data-difficulty="Hard" aria-pressed="false">Hard</button>
        </div>
        <div class="slider-row">
          <span>Minimum support</span>
          <strong id="supportValue">5%</strong>
        </div>
        <input
          id="support"
          aria-label="Minimum support threshold"
          type="range"
          min="5"
          max="20"
          step="1"
          value="5"
        />
        <p class="tiny-note">
          ⓘ In the final website, associations will be calculated from a real Lichess puzzle
          sample using ECLAT in Google Colab.
        </p>
        <button class="reset" type="button" id="reset">↺ Reset all filters</button>
      </aside>
      <div class="results-col panel" aria-live="polite">
        <div class="results-top">
          <div>
            <h3 class="panel-heading" style="margin: 0">
              Associated tactics
              <span id="resultCount" class="results-count">3 patterns</span>
            </h3>
            <p id="resultsSubtitle">Themes frequently found with Fork</p>
          </div>
          <select class="sort-select" id="sort" aria-label="Sort patterns">
            <option value="lift">Highest lift</option>
            <option value="support">Highest support</option>
            <option value="confidence">Highest confidence</option>
          </select>
        </div>
        <div id="patterns" class="result-list"></div>
        <div class="panel-sep"></div>
        <div class="puzzle-section">
          <div class="puzzle-header">
            <div>
              <h3>Sample practice positions</h3>
              <p id="practiceSubtitle">Visual preview for Fork + Pin</p>
            </div>
            <span class="sample-label">DESIGN PREVIEW</span>
          </div>
          <div id="puzzles" class="puzzles"></div>
        </div>
        <div class="insight-footer">
          <span class="info-dot">i</span>
          Board previews and statistics are demonstrative, not validated Lichess puzzles or
          mined output.
        </div>
      </div>
    </div>
  </section>
`;
