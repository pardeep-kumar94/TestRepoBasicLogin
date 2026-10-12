import { describe, it, expect } from 'vitest';
import { createAuth } from './auth.js';

function memoryStorage() {
  const items = new Map();
  return {
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
    dump: () => [...items.values()].join('\n'),
  };
}

const setup = (storage = memoryStorage()) => ({ storage, auth: createAuth({ storage, delayMs: 0 }) });

describe('Session', () => {
  it('has no Session before anyone has logged in', async () => {
    const { auth } = setup();
    expect(await auth.currentSession()).toBeNull();
  });
});
