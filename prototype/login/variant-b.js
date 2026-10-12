// PROTOTYPE — Variant B: Editorial poster. Narrow form column left, wide gradient right with
// oversized serif type. Screens switch via big serif "tabs"; underline-only inputs; round arrow CTA.
import { icons, blobs } from './icons.js';

const field = ({ name, label, type = 'text', autocomplete, value = '', extra = '' }) => `
  <div>
    <label for="b-${name}" class="block text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">${label}</label>
    <div class="relative">
      <input id="b-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" value="${value}"
        class="h-12 w-full border-0 border-b-2 border-line bg-transparent px-0 text-lg outline-none transition focus:border-fg aria-invalid:border-danger ${type === 'password' ? 'pr-10' : ''}" />
      ${extra}
    </div>
    <p data-error="${name}" aria-live="polite" class="mt-1.5 text-sm text-danger empty:hidden"></p>
  </div>`;

const eye = `<button type="button" data-toggle-pw data-icon-class="size-5" aria-label="Show password" aria-pressed="false"
  class="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent">${icons.eye()}</button>`;

const meter = `
  <div data-strength class="mt-3 flex items-center gap-3">
    <div class="flex flex-1 gap-1">${'<span data-bar class="h-0.5 flex-1 bg-line transition-colors"></span>'.repeat(4)}</div>
    <span data-strength-label class="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase"></span>
  </div>`;

const tab = (active, target, text) =>
  active
    ? `<span aria-current="page" class="text-fg">${text}</span>`
    : `<a href="#" data-switch="${target}" class="text-muted/50 transition hover:text-muted">${text}</a>`;

export default {
  name: 'Editorial poster',
  render({ screen, prefillEmail }) {
    const login = screen === 'login';
    const headline = login ? 'Welcome<br><em>back.</em>' : 'Start<br><em>something new.</em>';
    return `
    <main class="grid min-h-dvh lg:grid-cols-[minmax(420px,2fr)_3fr]">
      <div class="sunset px-8 pt-16 pb-10 text-on-sun lg:hidden">
        ${blobs}
        <p class="font-serif text-6xl leading-[0.9]">${headline}</p>
      </div>

      <section class="flex flex-col px-8 py-10 sm:px-14 lg:py-14">
        <nav class="flex items-baseline gap-4 font-serif text-4xl sm:text-5xl" aria-label="Log in or Sign up">
          ${tab(login, 'login', 'Log in')}
          <span class="text-muted/30">/</span>
          ${tab(!login, 'signup', 'Sign up')}
        </nav>

        <form data-form novalidate style="view-transition-name: form" class="my-auto w-full max-w-md pt-12 pb-16">
          <h1 class="sr-only">${login ? 'Log in' : 'Sign up'}</h1>
          <div data-form-error role="alert" class="mb-8 flex items-start gap-2 border-l-2 border-danger pl-3 text-sm text-danger"></div>

          <div class="space-y-8">
            ${login ? '' : field({ name: 'name', label: 'Your name', autocomplete: 'name' })}
            ${field({ name: 'email', label: 'Email', type: 'email', autocomplete: 'email', value: login ? prefillEmail : '' })}
            <div>
              ${field({ name: 'password', label: 'Password', type: 'password', autocomplete: login ? 'current-password' : 'new-password', extra: eye })}
              ${login ? '' : meter}
            </div>
          </div>

          <div class="mt-12 flex items-center justify-between gap-6">
            <p class="text-sm text-muted">${login ? 'Good to see you again.' : 'Takes under a minute.'}</p>
            <button data-submit aria-label="${login ? 'Log in' : 'Create Account'}"
              class="group grid size-16 shrink-0 place-items-center rounded-full bg-accent text-accent-fg shadow-xl shadow-accent/30 transition hover:scale-105 active:scale-95 disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              <span data-label class="transition group-hover:translate-x-0.5">${icons.arrow('size-6')}</span>
            </button>
          </div>
          <p data-result hidden class="mt-4 text-sm text-muted"></p>
        </form>

        <p class="text-xs text-muted">Prototype · nothing is saved</p>
      </section>

      <aside class="sunset hidden items-end p-14 text-on-sun lg:flex xl:p-20">
        ${blobs}
        <p class="font-serif text-[min(10vw,11rem)] leading-[0.85] tracking-tight">${headline}</p>
      </aside>
    </main>`;
  },
};
