export function MethodPage() {
  return (
    <section className="method-page">
      <div className="page-intro">
        <div className="kicker">Getting started</div>
        <h1 id="method-title" className="page-heading">
          How to use TactiChess
        </h1>
        <p className="section-sub">
          Choose a tactic, view a connection, then solve an example puzzle on Lichess.
        </p>
      </div>
      <div className="steps">
        <article className="step">
          <div className="step-number">01 /</div>
          <h2>Choose your tactic</h2>
          <p>
            New to tactics? Start with Fork: attacking two or more opposing pieces at once. Use the
            tactic menu to choose another idea and read its definition.
          </p>
        </article>
        <article className="step">
          <div className="step-number">02 /</div>
          <h2>Choose a connection</h2>
          <p>
            Read the related tactic's definition and choose View puzzles. The connection means the
            two tactics appear in the same puzzles, not that one move follows another.
          </p>
        </article>
        <article className="step">
          <div className="step-number">03 /</div>
          <h2>View, then solve</h2>
          <p>
            Choose Easy for lower-rated examples. Enlarge board gives you a closer look; the pieces
            cannot move here. Choose Solve on Lichess to open the playable puzzle in a new tab.
          </p>
        </article>
      </div>
      <details className="research-details">
        <summary>Understand the connection statistics and research</summary>
        <p>
          ECLAT found these connections offline by counting puzzle tags. The website displays the
          fixed results and example puzzles. It does not retrain or predict moves. See About for
          dataset counts, sources, and limitations.
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
          <h3>Ready to try?</h3>
          <p>
            Start with Fork and read its definition. Choose a related tactic, then read what the
            pair means before opening a puzzle.
          </p>
        </div>
        <a href="#/explore">Explore tactics ↗</a>
      </div>
    </section>
  );
}
