import { pages } from '../navigation.js';

export function SiteHeader({ currentPage }) {
  return (
    <header id="siteHeader" className="header container">
      <a className="brand" href="#/" aria-label="TactiChess home">
        <span className="brand-mark" aria-hidden="true">
          ♞
        </span>
        <span>
          Tacti<em>Chess</em>
        </span>
      </a>
      <nav className="topnav" aria-label="Main navigation">
        {pages.map((page) => (
          <a
            key={page.id}
            href={page.href}
            aria-current={page.id === currentPage ? 'page' : undefined}
          >
            {page.label}
          </a>
        ))}
      </nav>
      <div className="navright">
        <span className="demo-pill">
          <i></i>
          Real puzzle data
        </span>
        <a className="navbtn" href="#/explore">
          Explore tactics ↗
        </a>
      </div>
    </header>
  );
}

export function SiteFooter({ currentPage }) {
  return (
    <footer id="siteFooter" className="footer container">
      <span>
        <strong>♞ TactiChess</strong> · Student machine learning prototype
      </span>
      <nav aria-label="Footer navigation">
        {pages.map((page) => (
          <a
            key={page.id}
            href={page.href}
            aria-current={page.id === currentPage ? 'page' : undefined}
          >
            {page.label}
          </a>
        ))}
        <a href="https://database.lichess.org/#puzzles" target="_blank" rel="noopener noreferrer">
          Data source ↗
        </a>
      </nav>
    </footer>
  );
}
