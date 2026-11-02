export function MethodPage() {
  return (
    <section className="method-page">
      <div className="usage-intro panel">
        <div>
          <div className="kicker">Getting started</div>
          <h1 id="method-title" className="page-heading">
            How to use TactiChess
          </h1>
          <p className="section-sub">Browse a board here. Solve the puzzle on Lichess.</p>
        </div>
        <a href="#/explore" className="primary">
          Open Explorer <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <section className="usage-walkthrough" aria-labelledby="first-puzzle-title">
        <h2 id="first-puzzle-title">Try your first puzzle</h2>
        <ol className="usage-steps" role="list">
          <li className="step">
            <span className="usage-number" aria-hidden="true">
              01
            </span>
            <h3>Choose a puzzle</h3>
            <p>
              Open Explorer to see the puzzle gallery. Choose <strong>Easy</strong> for lower-rated
              examples, then check whether the card says <strong>White to move</strong> or
              <strong> Black to move</strong>.
            </p>
          </li>
          <li className="step">
            <span className="usage-number" aria-hidden="true">
              02
            </span>
            <h3>Take a closer look</h3>
            <p>
              Choose <strong>Enlarge board</strong> on a puzzle card. Think about the best moves for
              the side shown. The board is a preview; pieces cannot move here.
            </p>
            <p>
              Use <strong>Back to explorer</strong>, the close button, or <strong>Escape</strong> to
              return to the gallery.
            </p>
          </li>
          <li className="step">
            <span className="usage-number" aria-hidden="true">
              03
            </span>
            <h3>Solve on Lichess</h3>
            <p>
              Choose <strong>Solve on Lichess</strong> on the card or in the preview. The real
              puzzle opens in a new tab, where you can move the pieces and try your solution.
            </p>
            <p>Return to the TactiChess tab when you want another puzzle.</p>
          </li>
        </ol>
      </section>

      <div className="usage-guide-grid">
        <section className="panel information-panel" aria-labelledby="change-tactics-title">
          <h2 id="change-tactics-title">Want to explore different tactics?</h2>
          <ol className="usage-actions">
            <li>
              Choose <strong>Change tactics</strong> above the gallery to reach the tactic menu.
            </li>
            <li>
              Choose a tactic and read its definition. A <strong>Fork</strong>, for example, attacks
              two or more opposing pieces at once.
            </li>
            <li>
              Read the related tactics under <strong>Pair it with another tactic</strong>. Choose
              <strong> View puzzles</strong> to return to the gallery for that pair.
            </li>
          </ol>
          <p>
            On a narrow screen, the choices are below the gallery. <strong>Change tactics</strong>{' '}
            takes you straight there; <strong>Back to puzzles</strong> takes you back.
          </p>
          <p>
            <strong>Reset to Fork</strong> restores the starting tactic, its first pair, and all
            difficulties.
          </p>
        </section>
        <section className="panel information-panel" aria-labelledby="puzzle-labels-title">
          <h2 id="puzzle-labels-title">Understand the puzzle card</h2>
          <dl className="usage-labels">
            <div>
              <dt>White or Black to move</dt>
              <dd>The side you are finding moves for. That side is at the bottom of the board.</dd>
            </div>
            <div>
              <dt>Difficulty and rating</dt>
              <dd>
                Easy, Medium, and Hard group examples by puzzle rating. They describe the puzzle,
                not your skill level.
              </dd>
            </div>
            <div>
              <dt>Paired tactics</dt>
              <dd>
                The puzzle is tagged with both ideas. Read their definitions beside the choices. The
                tags do not say which tactic comes first.
              </dd>
            </div>
            <div>
              <dt>Puzzle details</dt>
              <dd>Open this section to see the puzzle's original ID and its other tags.</dd>
            </div>
          </dl>
        </section>
      </div>
      <details className="research-details">
        <summary>What do the connection statistics mean?</summary>
        <p>
          ECLAT found these connections offline by counting puzzle tags. The website displays the
          fixed results and example puzzles. It does not retrain or predict moves. See{' '}
          <a href="#/about">About TactiChess</a> for dataset counts, sources, and limitations.
        </p>
        <section className="metric-guide" aria-labelledby="metrics-title">
          <div className="kicker">Read the evidence</div>
          <h2 id="metrics-title">Three numbers. Different questions.</h2>
          <p>
            Confidence is read from your chosen tactic to the related tactic; reversing them can
            change it. These numbers describe training tags, not your chance of solving a puzzle.
            Difficulty filters never change them.
          </p>
          <div className="steps">
            <article className="step">
              <div className="step-number">Support</div>
              <h3>How common is the pair?</h3>
              <p>The share of all training puzzles tagged with both themes.</p>
              <code>pair count / training puzzles</code>
            </article>
            <article className="step">
              <div className="step-number">Confidence</div>
              <h3>What appears with my tactic?</h3>
              <p>
                Among puzzles with the starting theme, the share also tagged with the related theme.
              </p>
              <code>pair count / source count</code>
            </article>
            <article className="step">
              <div className="step-number">Lift</div>
              <h3>How strong is the connection?</h3>
              <p>
                How often the two tags appear together compared with what we would expect if they
                appeared independently. For example, a lift of 2 means twice that expected
                frequency.
              </p>
              <code>confidence / related-theme frequency</code>
            </article>
          </div>
        </section>
      </details>

      <div className="bottom-callout">
        <div>
          <h2>Ready to try a puzzle?</h2>
          <p>You can start with the examples already in Explorer.</p>
        </div>
        <a href="#/explore">
          Open Explorer <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
}
