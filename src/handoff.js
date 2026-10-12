// One-page handoffs between pages, kept in sessionStorage so nothing personal goes in the URL.

const LOG_IN_EMAIL_KEY = 'handoff.logInEmail';

function take(key) {
  try {
    const value = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    return value;
  } catch {
    return null;
  }
}

function put(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the next page just won't be pre-filled.
  }
}

// Pre-fills the email on Log in, from the Sign-up success page or the duplicate-email error.
export const passEmailToLogIn = (email) => put(LOG_IN_EMAIL_KEY, email);
export const takeEmailForLogIn = () => take(LOG_IN_EMAIL_KEY);
