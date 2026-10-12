// Variant C building blocks shared by the Log in and Sign up forms.
import { icons } from './icons.js';

const escapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => escapes[c]);

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

// Pill switch between Log in and Sign up. Each option is a real link.
export function screenSwitch(active) {
  const option = (screen, href, text) =>
    screen === active
      ? `<a href="${href}" aria-current="page" class="rounded-full bg-surface py-2 text-center text-sm font-semibold text-fg shadow-sm ${focusRing}">${text}</a>`
      : `<a href="${href}" class="rounded-full py-2 text-center text-sm font-semibold text-muted transition hover:text-fg ${focusRing}">${text}</a>`;
  return `
    <nav aria-label="Log in or Sign up" class="grid grid-cols-2 rounded-full bg-line/60 p-1">
      ${option('login', '/login/', 'Log in')}
      ${option('signup', '/signup/', 'Sign up')}
    </nav>`;
}

// Pill input with a leading icon; its label is visually hidden but read by screen readers.
export function field({ name, label, icon, type = 'text', autocomplete, placeholder, value = '', trailing = '' }) {
  return `
    <div data-field="${name}">
      <label for="${name}" class="sr-only">${label}</label>
      <div class="relative">
        <span class="pointer-events-none absolute inset-y-0 left-0 grid w-12 place-items-center text-muted">${icons[icon]('size-[18px]')}</span>
        <input id="${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" placeholder="${placeholder}"
          value="${escapeHtml(value)}" aria-describedby="${name}-error" aria-invalid="false"
          class="h-13 w-full rounded-full border border-line bg-bg pl-12 ${trailing ? 'pr-12' : 'pr-5'} text-[15px] text-fg outline-none transition placeholder:text-muted focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15 aria-invalid:border-danger aria-invalid:ring-danger/15" />
        ${trailing}
      </div>
      <p id="${name}-error" aria-live="polite" class="mt-1.5 pl-5 text-sm text-danger empty:hidden"></p>
    </div>`;
}

// Form-level message (wrong credentials, email already taken). Hidden while empty.
export const formError = () =>
  `<div data-form-error role="alert" hidden class="mt-6 flex items-start gap-2 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger"></div>`;

// Full-width dark pill; turns into a spinner while busy without changing size or name.
export function submitButton(text) {
  return `
    <button type="submit" data-submit
      class="relative mt-7 flex h-13 w-full items-center justify-center rounded-full bg-fg font-semibold text-bg transition hover:bg-accent hover:text-accent-fg active:scale-[0.99] disabled:pointer-events-none disabled:opacity-80 ${focusRing}">
      <span data-label class="inline-flex items-center gap-2">${text} ${icons.arrow('size-4')}</span>
      <span data-spinner hidden class="absolute inset-0 grid place-items-center"><span class="spinner"></span></span>
    </button>`;
}

export const heading = (title, subtitle) => `
  <h1 class="text-3xl font-semibold tracking-tight">${title}</h1>
  <p class="mt-2 text-muted">${subtitle}</p>`;

export const alertIcon = () => icons.alert('mt-0.5 size-4 shrink-0');
