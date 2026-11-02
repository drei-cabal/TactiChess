import { useEffect, useRef } from 'react';
import { DatasetStatus } from './components/DatasetStatus.jsx';
import { SiteFooter, SiteHeader } from './components/SiteNavigation.jsx';
import { AboutPage } from './features/about/AboutPage.jsx';
import { Explorer } from './features/explorer/Explorer.jsx';
import { Introduction } from './features/introduction/Introduction.jsx';
import { ThemeLibrary } from './features/library/ThemeLibrary.jsx';
import { MethodPage } from './features/method/MethodPage.jsx';
import { usePage } from './navigation.js';

export function App({ datasetState }) {
  const dataset = datasetState.status === 'success' ? datasetState.data : null;
  const page = usePage();
  const main = useRef(null);

  useEffect(() => {
    document.title = `${page?.title ?? 'Page not found'} | TactiChess`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current.focus({ preventScroll: true });
  }, [page]);

  return (
    <>
      <a
        className="skip-link"
        href="#mainContent"
        onClick={(event) => {
          event.preventDefault();
          main.current.focus();
        }}
      >
        Skip to content
      </a>
      <SiteHeader currentPage={page?.id} />
      <main
        ref={main}
        id="mainContent"
        className="container page-content"
        tabIndex={-1}
        aria-labelledby={`${page?.id ?? 'not-found'}-title`}
      >
        {page?.id === 'home' &&
          (dataset ? (
            <Introduction dataset={dataset} />
          ) : (
            <DatasetStatus state={datasetState} headingId="home-title" />
          ))}
        {/* Keep the explorer mounted so navigation preserves its selection. */}
        <div hidden={page?.id !== 'explore'}>
          {dataset ? (
            <Explorer dataset={dataset} />
          ) : (
            <DatasetStatus state={datasetState} headingId="explore-title" />
          )}
        </div>
        {page?.id === 'method' && <MethodPage />}
        <div hidden={page?.id !== 'themes'}>
          {dataset ? (
            <ThemeLibrary dataset={dataset} />
          ) : (
            <DatasetStatus state={datasetState} headingId="themes-title" />
          )}
        </div>
        {page?.id === 'about' &&
          (dataset ? (
            <AboutPage dataset={dataset} />
          ) : (
            <DatasetStatus state={datasetState} headingId="about-title" />
          ))}
        {!page && (
          <section className="panel empty dataset-status">
            <div className="kicker">A move off the board</div>
            <h1 id="not-found-title" className="page-heading">
              Page not found
            </h1>
            <p>Choose a page above, or start again from home.</p>
            <a className="primary" href="#/">
              Back to home ↗
            </a>
          </section>
        )}
      </main>
      <SiteFooter currentPage={page?.id} />
    </>
  );
}
