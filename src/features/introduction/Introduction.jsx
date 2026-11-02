import { boards } from '../explorer/demo-data.js';
import { DemoBoard } from '../puzzles/DemoBoard.jsx';

export function Introduction() {
  return (
    <>
      <section className="hero" aria-label="Introduction">
        <div className="hero-copy">
          <div className="eyebrow">Chess intelligence, simplified</div>
          <h1>
            Find the pattern.
            <br />
            <span>Master the tactic.</span>
          </h1>
          <p className="lede">
            Discover which chess tactics appear together, explore their connections, and find your
            next practice focus. Powered by ECLAT association mining.
          </p>
          <div className="actions">
            <a href="#discover" className="primary">
              Explore tactic pairs
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#how" className="plainlink">
              See how it works
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="board-orbit"></div>
          <div className="board-frame">
            <div id="heroBoard" className="board">
              <DemoBoard position={boards[1]} />
            </div>
            <i className="board-marker marker-1"></i>
            <i className="board-marker marker-2"></i>
          </div>
          <div className="floating-insight">
            <small>Pattern discovery</small>
            <div className="fi-name">
              Fork + Pin <span style={{ color: '#61934b' }}>↗</span>
            </div>
            <div className="fi-note">Illustrative association</div>
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
            <strong>Demo associations</strong>, not trained results
          </span>
        </div>
      </div>
    </>
  );
}
