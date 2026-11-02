export const introductionMarkup = `
  <section class="hero" aria-label="Introduction">
    <div class="hero-copy">
      <div class="eyebrow">Chess intelligence, simplified</div>
      <h1>
        Find the pattern.
        <br />
        <span>Master the tactic.</span>
      </h1>
      <p class="lede">
        Discover which chess tactics appear together, explore their connections, and find your
        next practice focus. Powered by ECLAT association mining.
      </p>
      <div class="actions">
        <a href="#discover" class="primary">
          Explore tactic pairs
          <span aria-hidden="true">↗</span>
        </a>
        <a href="#how" class="plainlink">
          See how it works
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="board-orbit"></div>
      <div class="board-frame">
        <div id="heroBoard" class="board"></div>
        <i class="board-marker marker-1"></i>
        <i class="board-marker marker-2"></i>
      </div>
      <div class="floating-insight">
        <small>Pattern discovery</small>
        <div class="fi-name">
          Fork + Pin
          <span style="color: #61934b">↗</span>
        </div>
        <div class="fi-note">Illustrative association</div>
        <div class="fi-bars">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
    </div>
  </section>
  <div class="source-strip" aria-label="Project context">
    <div>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 3v18M16 3v18M3 8h18M3 16h18" />
      </svg>
      <span>
        Based on
        <strong>Lichess Puzzle Database</strong>
      </span>
    </div>
    <span class="dot"></span>
    <div>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="m8 7 3 8m5-8-3 8" />
      </svg>
      <span>
        <strong>ECLAT</strong>
        frequent itemset mining
      </span>
    </div>
    <span class="dot"></span>
    <div>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 3 7v5c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <!-- prettier-ignore -->
      <span><strong>Demo associations</strong>, not trained results</span>
    </div>
  </div>
`;
