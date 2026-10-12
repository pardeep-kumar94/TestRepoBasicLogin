// PROTOTYPE — Variant A: Classic split. 50/50, gradient panel left with tagline at the bottom,
// boxed inputs on the right, text link to switch screens.
import { icons, blobs } from './icons.js';

const field = ({ name, label, type = 'text', autocomplete, value = '', extra = '' }) => `
  <div>
    <label for="a-${name}" class="mb-1.5 block text-sm font-medium">${label}</label>
    <div class="relative">
      <input id="a-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" value="${value}"
        class="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[15px] outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/15 aria-invalid:border-danger aria-invalid:ring-danger/15 ${type === 'password' ? 'pr-12' : ''}" />
      ${extra}
    </div>
    <p data-error="${name}" aria-live="polite" class="mt-1.5 text-sm text-danger empty:hidden"></p>
  </div>`;

const eye = `<button type="button" data-toggle-pw data-icon-class="size-5" aria-label="Show password" aria-pressed="false"
  class="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent">${icons.eye()}</button>`;

const meter = `
  <div data-strength class="mt-2.5 flex items-center gap-3">
    <div class="grid flex-1 grid-cols-4 gap-1.5">
      ${'<span data-bar class="h-1.5 rounded-full bg-line transition-colors"></span>'.repeat(4)}
    </div>
    <span data-strength-label class="w-16 text-right text-xs font-medium text-muted"></span>
  </div>`;

export default {
  name: 'Classic split',
  render({ screen, prefillEmail }) {
    const login = screen === 'login';
    return `
    <main class="grid min-h-dvh lg:grid-cols-2">
      <aside class="sunset hidden flex-col justify-end p-12 text-on-sun lg:flex xl:p-16">
        ${blobs}
        <p class="font-serif text-6xl leading-[0.95] xl:text-7xl">${login ? 'Welcome back.' : 'Start something new.'}</p>
        <p class="mt-5 max-w-sm text-lg opacity-80">${login ? 'Pick up right where you left off.' : 'It takes less than a minute to get going.'}</p>
      </aside>

      <div class="sunset h-28 lg:hidden">${blobs}</div>

      <section class="flex items-center justify-center px-6 py-12 sm:px-10">
        <form data-form novalidate style="view-transition-name: form" class="w-full max-w-sm">
          <h1 class="font-serif text-5xl">${login ? 'Log in' : 'Sign up'}</h1>
          <p class="mt-2 text-muted">
            ${login ? 'New here?' : 'Already have an Account?'}
            <a href="#" data-switch="${login ? 'signup' : 'login'}" class="font-medium text-accent underline-offset-4 hover:underline">${login ? 'Sign up' : 'Log in'}</a>
          </p>

          <div data-form-error role="alert" class="mt-6 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"></div>

          <div class="mt-6 space-y-5">
            ${login ? '' : field({ name: 'name', label: 'Name', autocomplete: 'name' })}
            ${field({ name: 'email', label: 'Email', type: 'email', autocomplete: 'email', value: login ? prefillEmail : '' })}
            <div>
              ${field({ name: 'password', label: 'Password', type: 'password', autocomplete: login ? 'current-password' : 'new-password', extra: eye })}
              ${login ? '' : meter}
            </div>
          </div>

          <button data-submit class="mt-8 h-12 w-full rounded-xl bg-accent font-semibold text-accent-fg shadow-lg shadow-accent/25 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <span data-label>${login ? 'Log in' : 'Create Account'}</span>
          </button>
          <p data-result hidden class="mt-4 text-center text-sm text-muted"></p>
        </form>
      </section>
    </main>`;
  },
};
