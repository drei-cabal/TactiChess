import { useSyncExternalStore } from 'react';

export const pages = [
  { id: 'home', href: '#/', label: 'Home', title: 'Find the connection in every tactic' },
  { id: 'explore', href: '#/explore', label: 'Explorer', title: 'Explore tactic connections' },
  { id: 'themes', href: '#/themes', label: 'Themes', title: 'Theme library' },
  { id: 'method', href: '#/method', label: 'How to use', title: 'How to use TactiChess' },
  { id: 'about', href: '#/about', label: 'About', title: 'The data behind TactiChess' },
];

const legacyPages = {
  '#home': 'home',
  '#discover': 'explore',
  '#how': 'method',
  '#about': 'about',
};

function subscribe(onChange) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

const getHash = () => window.location.hash || '#/';

export function usePage() {
  const hash = useSyncExternalStore(subscribe, getHash);
  return pages.find((page) => page.href === hash || page.id === legacyPages[hash]);
}
