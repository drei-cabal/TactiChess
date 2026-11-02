export function ProjectInfo() {
  return (
    <>
      <section id="how" className="how">
        <div className="how-top">
          <div className="kicker">From data to discovery</div>
          <h2>How TacticPair works</h2>
          <p>No accounts. No guesswork. Just discover, understand, and practice.</p>
        </div>
        <div className="steps">
          <article className="step">
            <div className="step-number">01 /</div>
            <h3>Choose your tactic</h3>
            <p>
              Select Fork, Pin, Skewer, Sacrifice, or another tactical theme you want to explore.
            </p>
          </article>
          <article className="step">
            <div className="step-number">02 /</div>
            <h3>Explore real associations</h3>
            <p>
              The final site displays frequent theme combinations mined from Lichess puzzles in
              Google Colab using ECLAT.
            </p>
          </article>
          <article className="step">
            <div className="step-number">03 /</div>
            <h3>Find puzzles to practice</h3>
            <p>
              Browse matching puzzle positions and open validated Lichess practice links once the
              live dataset is integrated.
            </p>
          </article>
        </div>
      </section>
      <section className="bottom-callout" id="about">
        <div>
          <h3>Built for the curious chess mind.</h3>
          <p>Educational prototype · Unsupervised learning · Transparent association metrics</p>
        </div>
        <a href="https://database.lichess.org/#puzzles" target="_blank" rel="noopener noreferrer">
          Explore the Lichess data ↗
        </a>
      </section>
    </>
  );
}
