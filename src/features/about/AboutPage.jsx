export function AboutPage({ dataset }) {
  const { associations, puzzles, metadata } = dataset;
  const entryCount = Object.values(puzzles).reduce((total, examples) => total + examples.length, 0);
  const statistics = [
    [associations.themes.length, 'Tactics to explore', 'Choose a tactic as your starting point.'],
    [
      associations.rules.length,
      'Connections to browse',
      'The same pair can be counted from either starting tactic.',
    ],
    [
      metadata.unique_curated_pairs,
      'Different tactic pairs',
      'A pair groups two tactics found in the same puzzles.',
    ],
    [entryCount, 'Example puzzle entries', 'A puzzle can appear under more than one pair.'],
  ];
  const sourceDate = new Date(`${metadata.source_updated}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <section className="about-page">
      <div className="about-overview">
        <div className="about-welcome panel">
          <div className="kicker">About TactiChess</div>
          <h1 id="about-title" className="page-heading">
            Get to know the tactics behind a puzzle.
          </h1>
          <p className="section-sub">
            TactiChess is a student project for exploring chess tactics that appear together in real
            puzzles. Read what each tactic means, see related ideas, then choose a puzzle to
            practise on Lichess.
          </p>
          <div className="actions">
            <a href="#/explore" className="primary">
              Explore the puzzles <span aria-hidden="true">→</span>
            </a>
            <a href="#/method" className="plainlink">
              How to use TactiChess
            </a>
          </div>
        </div>
        <section className="panel information-panel about-source" aria-labelledby="source-title">
          <div className="kicker">The puzzle source</div>
          <h2 id="source-title">Real puzzles from Lichess</h2>
          <p>The positions and practice links come from the {metadata.source}.</p>
          <dl className="provenance-list">
            <div>
              <dt>Source snapshot</dt>
              <dd>
                <time dateTime={metadata.source_updated}>{sourceDate}</time>
              </dd>
            </div>
            <div>
              <dt>Data license</dt>
              <dd>{metadata.license}</dd>
            </div>
          </dl>
          <a
            className="plainlink"
            href="https://database.lichess.org/#puzzles"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit the Lichess puzzle database <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>

      <section aria-labelledby="contents-title" className="about-contents">
        <h2 id="contents-title">What you can explore</h2>
        <dl className="dataset-stats">
          {statistics.map(([count, label, description]) => (
            <div className="panel" key={label}>
              <dt>{label}</dt>
              <dd>
                {count.toLocaleString('en-US')}
                <span>{description}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="about-grid">
        <section className="panel information-panel" aria-labelledby="connections-title">
          <h2 id="connections-title">How are tactics connected?</h2>
          <p>
            Each puzzle has tags naming the tactics it contains. We counted which tags appeared
            together and selected pairs to explore. A connection means two tactics share puzzles; it
            does not tell you which move to play.
          </p>
          <p>
            The analysis was completed before this website was built. Browsing and changing
            difficulty only change what you see; they do not train a new model.
          </p>
          <details className="about-research">
            <summary>View the research details</summary>
            <dl className="provenance-list">
              <div>
                <dt>Puzzles sampled</dt>
                <dd>{metadata.total_sample.toLocaleString('en-US')}</dd>
              </div>
              <div>
                <dt>Used to find connections</dt>
                <dd>{metadata.training_puzzles.toLocaleString('en-US')}</dd>
              </div>
              <div>
                <dt>Set aside for evaluation</dt>
                <dd>{metadata.testing_puzzles.toLocaleString('en-US')}</dd>
              </div>
              <div>
                <dt>Example puzzles taken from</dt>
                <dd>{metadata.puzzle_source}</dd>
              </div>
              <div>
                <dt>Analysis method</dt>
                <dd>{metadata.algorithm}</dd>
              </div>
              <div>
                <dt>Minimum support</dt>
                <dd>{(metadata.minimum_support * 100).toFixed(2)}%</dd>
              </div>
              <div>
                <dt>Minimum lift for selected pairs</dt>
                <dd>{metadata.minimum_curated_lift.toFixed(2)}&times;</dd>
              </div>
            </dl>
            <p>
              Support measures how common a pair is across the training puzzles. Lift compares how
              often the tags appear together with what independent occurrence would predict.
            </p>
            <ul className="limitations-list">
              {metadata.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
            <a className="plainlink" href="#/method">
              How to read the statistics <span aria-hidden="true">→</span>
            </a>
          </details>
        </section>
        <section className="panel information-panel about-limits" aria-labelledby="limits-title">
          <h2 id="limits-title">What to keep in mind</h2>
          <ul className="limitations-list">
            <li>
              A pair means the tactics are tagged in the same puzzles. It does not prove that one
              causes the other.
            </li>
            <li>The example puzzles are a small selection, not every puzzle with those tactics.</li>
            <li>Boards here are previews. Open Lichess to move the pieces and solve the puzzle.</li>
            <li>TactiChess does not predict moves or measure your improvement.</li>
          </ul>
        </section>
      </div>
      <section className="panel information-panel about-credits" aria-labelledby="credits-title">
        <h2 id="credits-title">Chessboard and artwork credits</h2>
        <p className="artwork-credit">
          Chessboards:{' '}
          <a
            href="https://github.com/shaack/cm-chessboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            cm-chessboard
          </a>{' '}
          (<a href={`${import.meta.env.BASE_URL}licenses/cm-chessboard-MIT.txt`}>MIT</a>). Wikimedia
          pieces by{' '}
          <a
            href="https://en.wikipedia.org/wiki/User:Cburnett"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cburnett
          </a>{' '}
          and{' '}
          <a
            href="https://en.wikipedia.org/wiki/User:Rfc1394"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rfc1394
          </a>
          , adapted by Stefan Haack, under{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-SA 3.0
          </a>
          . <a href={`${import.meta.env.BASE_URL}licenses/chess-artwork.txt`}>Artwork notices</a>.
        </p>
      </section>
      <div className="bottom-callout">
        <div>
          <h2>Ready to explore a connection?</h2>
          <p>Choose a tactic, learn the pair, and find a puzzle to practise.</p>
        </div>
        <a href="#/explore">
          Explore the puzzles <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
