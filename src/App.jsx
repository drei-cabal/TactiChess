import { SiteFooter, SiteHeader } from './components/SiteNavigation.jsx';
import { ProjectInfo } from './features/about/ProjectInfo.jsx';
import { Explorer } from './features/explorer/Explorer.jsx';
import { Introduction } from './features/introduction/Introduction.jsx';

export function App() {
  return (
    <>
      <SiteHeader />
      <main id="home" className="container">
        <Introduction />
        <Explorer />
        <ProjectInfo />
      </main>
      <SiteFooter />
    </>
  );
}
