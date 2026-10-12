import { auth } from '../app-auth.js';
import { passNotice } from '../handoff.js';
import { renderShell, reveal } from '../shell.js';
import { escapeHtml } from '../ui.js';

// Unknown paths are served this page. Send known pages typed without their trailing
// slash to the real page, and everything else to Home.
const pages = ['/login', '/signup', '/signup/success'];
const path = location.pathname.replace(/\/+$/, '');

if (pages.includes(path)) {
  location.replace(`${path}/`);
} else if (path !== '') {
  location.replace('/');
} else {
  const session = await auth.currentSession();
  if (!session) location.replace('/login/');
  else show(session);
}

function show({ name, email }) {
  const initial = [...name][0]?.toUpperCase() ?? '';
  renderShell({
    tagline: 'Good to see you.',
    subtitle: 'Everything is right where you left it.',
    content: `
      <div class="flex items-center gap-4">
        <div aria-hidden="true" class="grid size-14 shrink-0 place-items-center rounded-full bg-accent font-serif text-3xl text-accent-fg">${escapeHtml(initial)}</div>
        <div class="min-w-0">
          <h1 class="truncate text-3xl font-semibold tracking-tight">Welcome, ${escapeHtml(name)}</h1>
          <p class="mt-1 truncate text-muted">${escapeHtml(email)}</p>
        </div>
      </div>
      <button type="button" data-log-out
        class="mt-10 flex h-13 w-full items-center justify-center rounded-full border border-line bg-surface font-semibold text-fg transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        Log out
      </button>`,
  });
  document.querySelector('[data-log-out]').addEventListener('click', async () => {
    await auth.logOut();
    passNotice('You’ve been logged out');
    location.assign('/login/');
  });
  reveal();
}
