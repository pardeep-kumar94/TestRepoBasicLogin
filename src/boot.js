// Injected into every page's <head> by the Vite config, so it runs before first paint.

export const THEME_KEY = 'theme';

// Applies the remembered theme (or the OS setting) and the gradient's clock before anything
// is drawn.
export const themeScript = `(function () {
  var t = null;
  try { t = localStorage.getItem(${JSON.stringify(THEME_KEY)}); } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  // Start the gradient's drift where the clock says it should be, so it looks continuous
  // from one page to the next instead of restarting on every page load.
  document.documentElement.style.setProperty('--drift-clock', -(Date.now() % 3600000) / 1000 + 's');
})();`;

// Keeps the page invisible until its guard has decided whether to stay or redirect.
export const HIDE_ID = 'boot-hide';
export const hideStyle = 'html{visibility:hidden}';

// Opts every page into cross-document view transitions from the first byte, so a page that
// redirects before its stylesheet loads still agrees to the transition.
export const transitionStyle =
  '@view-transition{navigation:auto}@media (prefers-reduced-motion:reduce){@view-transition{navigation:none}}';
