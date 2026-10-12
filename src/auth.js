// Mock auth (ADR 0001): Accounts and the Session live in browser storage behind this module,
// so a real backend can replace it without touching the pages.

const ACCOUNTS_KEY = 'auth.accounts';
const SESSION_KEY = 'auth.session';
const SIGN_UP_SUCCESS_KEY = 'auth.signUpSuccess';

// Emails identify Accounts case-insensitively and ignore surrounding spaces.
const normalizeEmail = (email) => email.trim().toLowerCase();

const rules = {
  name(value) {
    const name = value.trim();
    if (!name) return 'Enter your name';
    if ([...name].length > 50) return 'Keep your name to 50 characters or fewer';
    return '';
  },
  email(value) {
    const email = value.trim();
    if (!email) return 'Enter your email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter an email like name@example.com';
    return '';
  },
  password(value, screen) {
    if (!value) return screen === 'signup' ? 'Create a password' : 'Enter your password';
    if (screen === 'signup' && (value.length < 8 || !/\p{L}/u.test(value) || !/\d/.test(value)))
      return 'Use 8+ characters with a letter and a number';
    return '';
  },
};

// The error message for one field, or '' when it is valid. `screen` is 'login' or 'signup'.
function validateField(field, value, screen) {
  return rules[field](value ?? '', screen);
}

function fieldErrors(values, screen) {
  const errors = {};
  for (const [field, value] of Object.entries(values)) {
    const message = validateField(field, value, screen);
    if (message) errors[field] = message;
  }
  return Object.keys(errors).length ? errors : null;
}

const publicAccount = ({ name, email }) => ({ name, email });

// SHA-256 of email + password, hex-encoded. Mixing in the email stops identical passwords
// from producing identical hashes across Accounts.
async function hashPassword(email, password) {
  const bytes = new TextEncoder().encode(`${email}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function createAuth({ storage = globalThis.localStorage, delayMs = 700 } = {}) {
  const latency = () => new Promise((resolve) => setTimeout(resolve, delayMs));
  const readAccounts = () => JSON.parse(storage.getItem(ACCOUNTS_KEY) ?? '{}');

  return {
    async signUp({ name, email, password }) {
      await latency();
      const errors = fieldErrors({ name, email, password }, 'signup');
      if (errors) return { ok: false, fieldErrors: errors };
      email = normalizeEmail(email);
      const accounts = readAccounts();
      if (accounts[email]) return { ok: false, error: 'email-taken' };
      accounts[email] = { name: name.trim(), email, passwordHash: await hashPassword(email, password) };
      storage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      storage.setItem(SIGN_UP_SUCCESS_KEY, email);
      return { ok: true };
    },

    // The Sign-up success page is shown once: this returns the new Account's email, then null.
    async consumeSignUpSuccess() {
      const email = storage.getItem(SIGN_UP_SUCCESS_KEY);
      storage.removeItem(SIGN_UP_SUCCESS_KEY);
      return email;
    },

    async logIn({ email, password }) {
      await latency();
      const errors = fieldErrors({ email, password }, 'login');
      if (errors) return { ok: false, fieldErrors: errors };
      email = normalizeEmail(email);
      const account = readAccounts()[email];
      if (!account || account.passwordHash !== (await hashPassword(email, password)))
        return { ok: false, error: 'invalid-credentials' };
      storage.setItem(SESSION_KEY, email);
      return { ok: true, account: publicAccount(account) };
    },

    async logOut() {
      storage.removeItem(SESSION_KEY);
    },

    // No simulated latency: page guards read this before showing anything.
    async currentSession() {
      const account = readAccounts()[storage.getItem(SESSION_KEY)];
      return account ? publicAccount(account) : null;
    },
  };
}
