export function SiteHeader() {
  return (
    <header id="siteHeader" className="header container">
      <a className="brand" href="#home" aria-label="TacticPair home">
        <span className="brand-mark" aria-hidden="true">
          ♞
        </span>
        <span>
          Tactic<em>Pair</em>
        </span>
      </a>
      <nav className="topnav" aria-label="Main navigation">
        <a href="#discover">Discover</a>
        <a href="#how">How it works</a>
        <a href="#about">About</a>
      </nav>
      <div className="navright">
        <span className="demo-pill">
          <i></i>
          Prototype mode
        </span>
        <a className="navbtn" href="#discover">
          Explore tactics ↗
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="siteFooter" className="footer container">
      <span>
        <strong>♞ TacticPair</strong> · Student machine learning prototype
      </span>
      <nav>
        <a href="#discover">Explorer</a>
        <a href="#how">Method</a>
        <a href="https://database.lichess.org/#puzzles" target="_blank" rel="noopener noreferrer">
          Data source ↗
        </a>
      </nav>
    </footer>
  );
}
