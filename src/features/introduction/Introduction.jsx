import { DecorativeBoard } from './DecorativeBoard.jsx';

export function Introduction({ dataset }) {
  return (
    <>
      <section className="hero" aria-label="Introduction">
        <div className="hero-copy">
          <div className="eyebrow">Chess intelligence, simplified</div>
          <h1 id="home-title">
            Find the pattern.
            <br />
            <span>Master the tactic.</span>
          </h1>
          <p className="lede">
            Discover which chess tactics appear together, explore their connections, and find your
            next practice focus. Powered by ECLAT association mining.
          </p>
          <div className="actions">
            <a href="#/explore" className="primary">
              Explore tactic pairs
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#/method" className="plainlink">
              See how it works
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="board-orbit"></div>
          <div className="board-frame">
            <div id="heroBoard" className="board">
              <DecorativeBoard />
            </div>
            <i className="board-marker marker-1"></i>
            <i className="board-marker marker-2"></i>
          </div>
          <div className="floating-insight">
            <small>Board illustration</small>
            <div className="fi-name">
              TactiChess <span style={{ color: '#61934b' }}>↗</span>
            </div>
            <div className="fi-note">Decorative position only</div>
            <div className="fi-bars">
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
      <div className="source-strip" aria-label="Project context">
        <div>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M8 3v18M16 3v18M3 8h18M3 16h18" />
          </svg>
          <span>
            Based on <strong>Lichess Puzzle Database</strong>
          </span>
        </div>
        <span className="dot"></span>
        <div>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="6" cy="6" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="12" cy="18" r="2.5" />
            <path d="m8 7 3 8m5-8-3 8" />
          </svg>
          <span>
            <strong>ECLAT</strong> frequent itemset mining
          </span>
        </div>
        <span className="dot"></span>
        <div>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 3 7v5c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>
            <strong>Training-derived rules</strong>
            {dataset && ` · ${dataset.associations.rules.length} curated recommendations`}
          </span>
        </div>
      </div>
      <section className="home-paths" aria-labelledby="home-paths-title">
        <div className="kicker">Your next move</div>
        <h2 id="home-paths-title">Three ways into the position.</h2>
        <div className="steps">
          <a className="step page-link" href="#/explore">
            <div className="step-number">01 / Explore</div>
            <h3>Follow a tactical connection ↗</h3>
            <p>Choose a theme and discover its frozen, training-derived associations.</p>
          </a>
          <a className="step page-link" href="#/method">
            <div className="step-number">02 / Understand</div>
            <h3>Read the numbers ↗</h3>
            <p>Get to know support, confidence, lift, and the direction of a rule.</p>
          </a>
          <a className="step page-link" href="#/about">
            <div className="step-number">03 / Inspect</div>
            <h3>Meet the dataset ↗</h3>
            <p>
              See where the puzzles come from, how they were split, and the limits of the results.
            </p>
          </a>
        </div>
      </section>
    </>
  );
}
