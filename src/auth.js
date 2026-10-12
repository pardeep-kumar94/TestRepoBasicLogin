// Mock auth (ADR 0001): Accounts and the Session live in browser storage behind this module,
// so a real backend can replace it without touching the pages.

const SESSION_KEY = 'auth.session';

export function createAuth({ storage = globalThis.localStorage } = {}) {
  return {
    // No simulated latency: page guards read this before showing anything.
    async currentSession() {
      return storage.getItem(SESSION_KEY);
    },
  };
}
