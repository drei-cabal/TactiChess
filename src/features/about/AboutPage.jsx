export function AboutPage({ dataset }) {
  const { associations, puzzles, metadata } = dataset;
  const entryCount = Object.values(puzzles).reduce((total, examples) => total + examples.length, 0);
  const statistics = [
    [associations.themes.length, 'Starting themes'],
    [associations.rules.length, 'Directional rules'],
    [metadata.unique_curated_pairs, 'Curated pairs'],
    [entryCount, 'Example entries'],
  ];

  return (
    <section className="about-page">
      <div className="page-intro">
        <div className="kicker">Data & project</div>
        <h1 id="about-title" className="page-heading">
          The evidence behind the explorer.
        </h1>
        <p className="section-sub">
          TactiChess is a student chess tactic association explorer. It finds connections in puzzle
          tags using offline ECLAT mining and makes the frozen results available to explore.
        </p>
      </div>
      <p className="artwork-credit">
        Chessboards:{' '}
        <a href="https://github.com/shaack/cm-chessboard" target="_blank" rel="noopener noreferrer">
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
      <dl className="dataset-stats">
        {statistics.map(([count, label]) => (
          <div className="panel" key={label}>
            <dt>{label}</dt>
            <dd>{count.toLocaleString('en-US')}</dd>
          </div>
        ))}
      </dl>
      <div className="about-grid">
        <section className="panel information-panel" aria-labelledby="source-title">
          <div className="kicker">Provenance</div>
          <h2 id="source-title">Built on open puzzles.</h2>
          <dl className="provenance-list">
            <div>
              <dt>Source</dt>
              <dd>{metadata.source}</dd>
            </div>
            <div>
              <dt>Source update</dt>
              <dd>{metadata.source_updated}</dd>
            </div>
            <div>
              <dt>Dataset license</dt>
              <dd>{metadata.license}</dd>
            </div>
            <div>
              <dt>Sample</dt>
              <dd>{metadata.total_sample.toLocaleString('en-US')} puzzles</dd>
            </div>
            <div>
              <dt>Training</dt>
              <dd>{metadata.training_puzzles.toLocaleString('en-US')} puzzles</dd>
            </div>
            <div>
              <dt>Untouched evaluation</dt>
              <dd>{metadata.testing_puzzles.toLocaleString('en-US')} puzzles</dd>
            </div>
            <div>
              <dt>Example source</dt>
              <dd>{metadata.puzzle_source}</dd>
            </div>
          </dl>
          <a
            className="plainlink"
            href="https://database.lichess.org/#puzzles"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit the Lichess dataset ↗
          </a>
        </section>
        <section className="panel information-panel" aria-labelledby="limits-title">
          <div className="kicker">Keep the context</div>
          <h2 id="limits-title">What these rules can tell us.</h2>
          <ul className="limitations-list">
            {metadata.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
          <p className="section-sub">
            The frozen selection uses minimum support {(metadata.minimum_support * 100).toFixed(2)}%
            and curated lift {metadata.minimum_curated_lift.toFixed(2)}×. The site does not retrain,
            predict moves, or measure a player's improvement.
          </p>
          <a className="plainlink" href="#/method">
            Understand the metrics →
          </a>
        </section>
      </div>
      <div className="bottom-callout">
        <div>
          <h3>Built for the curious chess mind.</h3>
          <p>Educational project · Transparent metrics · No account required</p>
        </div>
        <a href="#/explore">Find a connection ↗</a>
      </div>
    </section>
  );
}
