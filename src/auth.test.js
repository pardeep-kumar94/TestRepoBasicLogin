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

const ada = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'engine1843' };

describe('Sign up', () => {
  it('creates an Account without starting a Session', async () => {
    const { auth } = setup();
    expect(await auth.signUp(ada)).toEqual({ ok: true });
    expect(await auth.currentSession()).toBeNull();
  });

  it('never stores the password in plain text', async () => {
    const { auth, storage } = setup();
    await auth.signUp(ada);
    expect(storage.dump()).toContain('ada@example.com');
    expect(storage.dump()).not.toContain('engine1843');
  });

  it.each([
    ['name', 'missing', { name: '' }],
    ['name', 'only spaces', { name: '   ' }],
    ['name', 'longer than 50 characters', { name: 'a'.repeat(51) }],
    ['email', 'missing', { email: '' }],
    ['email', 'not shaped like an email', { email: 'ada.example.com' }],
    ['password', 'shorter than 8 characters', { password: 'abc1234' }],
    ['password', 'letters only', { password: 'abcdefgh' }],
    ['password', 'digits only', { password: '12345678' }],
  ])('rejects a %s that is %s, creating no Account', async (field, _why, override) => {
    const { auth } = setup();
    const result = await auth.signUp({ ...ada, ...override });
    expect(result.ok).toBe(false);
    expect(Object.keys(result.fieldErrors)).toEqual([field]);
    expect(await auth.consumeSignUpSuccess()).toBeNull();
  });

  it.each([
    ['a 50-character name', { name: 'a'.repeat(50) }],
    ['a non-Latin name', { name: '李明' }],
    ['a name with an apostrophe and accent', { name: "Zoë O'Brien" }],
    ['an 8-character password with a letter and a number', { password: 'abcdefg1' }],
  ])('accepts %s', async (_what, override) => {
    const { auth } = setup();
    expect(await auth.signUp({ ...ada, ...override })).toEqual({ ok: true });
  });

  it.each(['ada@example.com', '  ADA@Example.com '])('rejects an email that already has an Account (%j)', async (email) => {
    const { auth } = setup();
    await auth.signUp(ada);
    expect(await auth.signUp({ ...ada, email })).toEqual({ ok: false, error: 'email-taken' });
  });
});

describe('Sign-up success page', () => {
  it('is reachable exactly once after Sign up, carrying the email for Log in', async () => {
    const { auth } = setup();
    await auth.signUp({ ...ada, email: ' Ada@Example.com ' });
    expect(await auth.consumeSignUpSuccess()).toBe('ada@example.com');
    expect(await auth.consumeSignUpSuccess()).toBeNull();
  });

  it('is not reachable without a Sign up', async () => {
    const { auth } = setup();
    expect(await auth.consumeSignUpSuccess()).toBeNull();
  });

  it('is not reachable after a rejected Sign up', async () => {
    const { auth } = setup();
    await auth.signUp(ada);
    await auth.consumeSignUpSuccess();
    await auth.signUp(ada);
    expect(await auth.consumeSignUpSuccess()).toBeNull();
  });
});

describe('Session', () => {
  it('has no Session before anyone has logged in', async () => {
    const { auth } = setup();
    expect(await auth.currentSession()).toBeNull();
  });
});
