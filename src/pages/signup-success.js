import { auth } from '../app-auth.js';
import { icons } from '../icons.js';
import { renderShell, reveal } from '../shell.js';

// Shown once, right after Sign up; Log in is already primed with the new Account's email.
if (!(await auth.consumeSignUpSuccess())) {
  location.replace('/login/');
} else {
  renderShell({
    tagline: 'You’re all set.',
    subtitle: 'Your Account is ready when you are.',
    content: `
      <div class="text-center">
        <div class="mx-auto grid size-16 place-items-center rounded-full bg-accent/15 text-accent">${icons.check('size-8')}</div>
        <h1 class="mt-6 text-3xl font-semibold tracking-tight">Account created successfully</h1>
        <p class="mt-2 text-muted">Log in to start using your Account.</p>
        <a href="/login/"
          class="mt-8 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-fg font-semibold text-bg transition hover:bg-accent hover:text-accent-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          Log in ${icons.arrow('size-4')}
        </a>
      </div>`,
  });
  reveal();
}
