import { THEME_KEY } from './boot.js';
import { icons } from './icons.js';

const root = document.documentElement;
const osDark = matchMedia('(prefers-color-scheme: dark)');

function remembered() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function remember(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage unavailable: the choice just won't persist.
  }
}

// Sun/moon button in the top-right corner. Until the visitor picks, the theme follows the OS.
export function mountThemeToggle() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'fixed top-4 right-4 z-40 grid size-10 place-items-center rounded-full border border-line bg-surface/80 text-fg backdrop-blur transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

  const paint = () => {
    const dark = root.dataset.theme === 'dark';
    button.innerHTML = dark ? icons.sun() : icons.moon();
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };

  button.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    remember(root.dataset.theme);
    paint();
  });

  osDark.addEventListener('change', (e) => {
    if (remembered()) return;
    root.dataset.theme = e.matches ? 'dark' : 'light';
    paint();
  });

  paint();
  document.body.append(button);
}
