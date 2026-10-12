// PROTOTYPE — throwaway. Three variants of the Log in / Sign up screens on /prototype/login/,
// switchable via ?variant=A|B|C (and ?screen=login|signup). In-memory only; nothing is saved.
//
// Try: Log in succeeds only with password "password1"; Sign up with taken@example.com hits
// the "email already exists" error.
import { mountSwitcher } from '../switcher.js';
import { icons } from './icons.js';
import variantA from './variant-a.js';
import variantB from './variant-b.js';
import variantC from './variant-c.js';

const variants = { A: variantA, B: variantB, C: variantC };
const params = new URLSearchParams(location.search);
const state = {
  variant: variants[params.get('variant')] ? params.get('variant') : 'A',
  screen: params.get('screen') === 'signup' ? 'signup' : 'login',
  theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  prefillEmail: '',
};

function syncUrl() {
  const p = new URLSearchParams({ variant: state.variant, screen: state.screen });
  history.replaceState(null, '', `?${p}`);
}

function render() {
  document.documentElement.dataset.theme = state.theme;
  const app = document.getElementById('app');
  app.innerHTML = variants[state.variant].render(state) + themeToggle();
  wireForm(app);
  app.querySelector('[data-theme-toggle]').onclick = () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    render();
  };
  syncUrl();
  mountSwitcher({
    variants,
    current: state.variant,
    status: `screen: ${state.screen} · theme: ${state.theme}`,
    onChange: (v) => {
      state.variant = v;
      render();
    },
  });
}

function themeToggle() {
  const dark = state.theme === 'dark';
  return `<button type="button" data-theme-toggle aria-label="Switch to ${dark ? 'light' : 'dark'} mode"
    class="fixed top-4 right-4 z-40 grid size-10 place-items-center rounded-full border border-line bg-surface/80 text-fg backdrop-blur transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
    ${dark ? icons.sun() : icons.moon()}</button>`;
}

function switchScreen(screen) {
  state.screen = screen;
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(render);
  } else {
    render();
  }
}

// --- Shared form behaviour (same rules for every variant; only the markup differs) ---

const rules = {
  name: (v) => (!v.trim() ? 'Enter your name' : v.trim().length > 50 ? 'Keep it under 50 characters' : ''),
  email: (v) => (!v.trim() ? 'Enter your email' : !/^\S+@\S+\.\S+$/.test(v.trim()) ? 'That doesn’t look like an email' : ''),
  password: (v, screen) => {
    if (!v) return 'Enter your password';
    if (screen === 'signup' && (v.length < 8 || !/[a-z]/i.test(v) || !/\d/.test(v)))
      return 'Use 8+ characters with a letter and a number';
    return '';
  },
};

function strength(v) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[a-z]/i.test(v) && /\d/.test(v)) s++;
  if (v.length >= 12) s++;
  if (/[^a-z0-9]/i.test(v) || (/[a-z]/.test(v) && /[A-Z]/.test(v))) s++;
  return s;
}
const strengthLabels = ['Too weak', 'Weak', 'Okay', 'Strong', 'Great'];
const strengthColors = ['var(--danger)', 'var(--danger)', 'var(--sun-3)', 'var(--accent)', 'var(--accent)'];

function wireForm(root) {
  const form = root.querySelector('[data-form]');
  const showError = (name, msg) => {
    const input = form.elements[name];
    const el = form.querySelector(`[data-error="${name}"]`);
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (el) el.textContent = msg;
  };
  const check = (name) => {
    const msg = rules[name](form.elements[name].value, state.screen);
    showError(name, msg);
    return !msg;
  };

  root.querySelectorAll('[data-switch]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (a.hasAttribute('data-prefill')) state.prefillEmail = form.elements.email.value.trim().toLowerCase();
      switchScreen(a.dataset.switch);
    }),
  );

  root.querySelectorAll('[data-toggle-pw]').forEach((b) =>
    b.addEventListener('click', () => {
      const input = form.elements.password;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      b.setAttribute('aria-pressed', String(show));
      b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      b.innerHTML = show ? icons.eyeOff(b.dataset.iconClass) : icons.eye(b.dataset.iconClass);
    }),
  );

  for (const input of form.querySelectorAll('input[name]')) {
    input.addEventListener('blur', () => input.value && check(input.name));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') check(input.name);
      if (input.name === 'password') paintStrength(input.value);
    });
  }

  function paintStrength(v) {
    const meter = form.querySelector('[data-strength]');
    if (!meter) return;
    const s = v ? strength(v) : -1;
    meter.querySelectorAll('[data-bar]').forEach((bar, i) => {
      bar.style.background = i < s ? strengthColors[s] : 'var(--line)';
    });
    const label = meter.querySelector('[data-strength-label]');
    label.textContent = s < 0 ? '' : strengthLabels[s];
  }

  const formError = form.querySelector('[data-form-error]');
  const setFormError = (html) => {
    formError.innerHTML = html;
    formError.hidden = !html;
    formError.querySelectorAll('[data-switch]').forEach((a) =>
      a.addEventListener('click', (e) => {
        e.preventDefault();
        state.prefillEmail = form.elements.email.value.trim().toLowerCase();
        switchScreen(a.dataset.switch);
      }),
    );
  };
  setFormError('');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFormError('');
    const names = [...form.querySelectorAll('input[name]')].map((i) => i.name);
    const ok = names.map(check).every(Boolean);
    if (!ok) {
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const btn = form.querySelector('[data-submit]');
    const label = btn.querySelector('[data-label]');
    const original = label.innerHTML;
    btn.disabled = true;
    label.innerHTML = `<span class="spinner inline-block align-[-0.15em]"></span>`;
    await new Promise((r) => setTimeout(r, 700));
    btn.disabled = false;
    label.innerHTML = original;

    const email = form.elements.email.value.trim().toLowerCase();
    if (state.screen === 'login' && form.elements.password.value !== 'password1') {
      setFormError(`${icons.alert('size-4 shrink-0')}<span>Email or password is incorrect.</span>`);
    } else if (state.screen === 'signup' && email === 'taken@example.com') {
      setFormError(
        `${icons.alert('size-4 shrink-0')}<span>An Account with this email already exists. <a href="#" data-switch="login" class="font-semibold underline underline-offset-2">Log in</a></span>`,
      );
    } else {
      const result = form.querySelector('[data-result]');
      result.hidden = false;
      result.textContent =
        state.screen === 'login' ? 'Prototype: would go to Home now.' : 'Prototype: would go to the Sign-up success page now.';
    }
  });
}

render();
