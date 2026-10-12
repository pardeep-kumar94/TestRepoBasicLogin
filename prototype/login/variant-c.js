// PROTOTYPE — Variant C: Framed bento. Gradient is an inset rounded card holding a frosted
// glass note; segmented Log in | Sign up control; pill inputs with leading icons.
import { icons, blobs } from './icons.js';

const field = ({ name, label, icon, type = 'text', autocomplete, value = '', placeholder, extra = '' }) => `
  <div>
    <label for="c-${name}" class="sr-only">${label}</label>
    <div class="relative">
      <span class="pointer-events-none absolute inset-y-0 left-0 grid w-12 place-items-center text-muted">${icons[icon]('size-[18px]')}</span>
      <input id="c-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" value="${value}" placeholder="${placeholder}"
        class="h-13 w-full rounded-full border border-line bg-bg pr-5 pl-12 text-[15px] outline-none transition placeholder:text-muted focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15 aria-invalid:border-danger aria-invalid:ring-danger/15 ${type === 'password' ? 'pr-12' : ''}" />
      ${extra}
    </div>
    <p data-error="${name}" aria-live="polite" class="mt-1.5 pl-5 text-sm text-danger empty:hidden"></p>
  </div>`;

const eye = `<button type="button" data-toggle-pw data-icon-class="size-[18px]" aria-label="Show password" aria-pressed="false"
  class="absolute inset-y-0 right-1 grid w-11 place-items-center rounded-full text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent">${icons.eye('size-[18px]')}</button>`;

const meter = `
  <div data-strength class="mt-2 flex items-center gap-2 px-5">
    <span data-strength-label class="text-xs text-muted"></span>
    <div class="ml-auto flex gap-1">${'<span data-bar class="size-2 rounded-full bg-line transition-colors"></span>'.repeat(4)}</div>
  </div>`;

const seg = (active, target, text) =>
  `<a href="#" ${active ? 'aria-current="page"' : `data-switch="${target}"`}
    class="rounded-full py-2 text-center text-sm font-semibold transition ${active ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'}">${text}</a>`;

export default {
  name: 'Framed bento',
  render({ screen, prefillEmail }) {
    const login = screen === 'login';
    return `
    <main class="grid min-h-dvh gap-3 p-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-4 lg:p-4">
      <aside class="sunset flex h-40 flex-col justify-end rounded-[28px] p-5 lg:h-auto lg:p-10">
        ${blobs}
        <div class="hidden max-w-md rounded-3xl border border-white/30 bg-white/15 p-7 text-on-sun backdrop-blur-xl lg:block">
          <p class="font-serif text-4xl leading-tight xl:text-5xl">${login ? 'Welcome back.' : 'Start something new.'}</p>
          <p class="mt-3 opacity-80">${login ? 'Your space is right where you left it.' : 'One Account, everything in its place.'}</p>
        </div>
      </aside>

      <section class="flex items-center justify-center px-3 py-10 sm:px-8">
        <div class="w-full max-w-[400px]">
          <nav class="grid grid-cols-2 rounded-full bg-line/60 p-1" aria-label="Log in or Sign up">
            ${seg(login, 'login', 'Log in')}
            ${seg(!login, 'signup', 'Sign up')}
          </nav>

          <form data-form novalidate style="view-transition-name: form" class="mt-10">
            <h1 class="text-3xl font-semibold tracking-tight">${login ? 'Log in to your Account' : 'Create your Account'}</h1>
            <p class="mt-2 text-muted">${login ? 'Enter your details to continue.' : 'Just three things and you’re in.'}</p>

            <div data-form-error role="alert" class="mt-6 flex items-start gap-2 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger"></div>

            <div class="mt-7 space-y-3.5">
              ${login ? '' : field({ name: 'name', label: 'Name', icon: 'user', autocomplete: 'name', placeholder: 'Your name' })}
              ${field({ name: 'email', label: 'Email', icon: 'mail', type: 'email', autocomplete: 'email', placeholder: 'you@example.com', value: login ? prefillEmail : '' })}
              <div>
                ${field({ name: 'password', label: 'Password', icon: 'lock', type: 'password', autocomplete: login ? 'current-password' : 'new-password', placeholder: login ? 'Password' : 'Create a password', extra: eye })}
                ${login ? '' : meter}
              </div>
            </div>

            <button data-submit class="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-fg font-semibold text-bg transition hover:bg-accent hover:text-accent-fg active:scale-[0.99] disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <span data-label class="inline-flex items-center gap-2">${login ? 'Log in' : 'Create Account'} ${icons.arrow('size-4')}</span>
            </button>
            <p data-result hidden class="mt-4 text-center text-sm text-muted"></p>
          </form>
        </div>
      </section>
    </main>`;
  },
};
