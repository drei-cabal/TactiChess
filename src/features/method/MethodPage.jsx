export function MethodPage() {
  return (
    <section className="method-page">
      <div className="page-intro">
        <div className="kicker">From data to discovery</div>
        <h1 id="method-title" className="page-heading">
          Every connection has a story.
        </h1>
        <p className="section-sub">
          A short guide to exploring associations and reading their evidence.
        </p>
      </div>
      <div className="steps">
        <article className="step">
          <div className="step-number">01 /</div>
          <h2>Choose your tactic</h2>
          <p>Start with Fork, Pin, Skewer, Sacrifice, or another exported tactical theme.</p>
        </article>
        <article className="step">
          <div className="step-number">02 /</div>
          <h2>Explore the association</h2>
          <p>
            ECLAT mined these two-theme combinations offline in Colab. The website reads the frozen
            training results.
          </p>
        </article>
        <article className="step">
          <div className="step-number">03 /</div>
          <h2>Find your practice focus</h2>
          <p>
            See how many exported examples match a pair. Static boards and Lichess practice links
            are coming soon.
          </p>
        </article>
      </div>
      <section className="metric-guide" aria-labelledby="metrics-title">
        <div className="kicker">Read the evidence</div>
        <h2 id="metrics-title">Three numbers. Different questions.</h2>
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
              Co-occurrence relative to what independence would predict. A value above 1 means the
              pair occurs more often.
            </p>
            <code>confidence / related-theme frequency</code>
          </article>
        </div>
      </section>
      <div className="bottom-callout">
        <div>
          <h3>Direction matters.</h3>
          <p>
            Reversing a rule can change confidence. Rating filters never change the global training
            metrics.
          </p>
        </div>
        <a href="#/explore">Explore the real rules ↗</a>
      </div>
    </section>
  );
}
