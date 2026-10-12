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

describe('Email to pre-fill on Log in', () => {
  it('is the new Account’s email after Sign up, offered once', async () => {
    const { auth } = setup();
    await auth.signUp({ ...ada, email: ' Ada@Example.com ' });
    expect(await auth.takeLogInEmail()).toBe('ada@example.com');
    expect(await auth.takeLogInEmail()).toBeNull();
  });

  it('is the existing Account’s email after Sign up finds it taken', async () => {
    const { auth } = setup();
    await auth.signUp(ada);
    await auth.takeLogInEmail();
    await auth.signUp({ ...ada, email: 'ADA@example.com ' });
    expect(await auth.takeLogInEmail()).toBe('ada@example.com');
  });

  it('is nothing when Sign up was rejected for invalid details', async () => {
    const { auth } = setup();
    await auth.signUp({ ...ada, password: 'short' });
    expect(await auth.takeLogInEmail()).toBeNull();
  });
});

describe('Log in', () => {
  it('starts a Session for an Account created at Sign up', async () => {
    const { auth } = setup();
    await auth.signUp({ ...ada, name: '  Ada Lovelace ' });
    const account = { name: 'Ada Lovelace', email: 'ada@example.com' };
    expect(await auth.logIn({ email: ' ADA@example.com', password: 'engine1843' })).toEqual({ ok: true, account });
    expect(await auth.currentSession()).toEqual(account);
  });

  it.each([
    ['an unknown email', { email: 'nobody@example.com', password: 'engine1843' }],
    ['a wrong password', { email: 'ada@example.com', password: 'engine1844' }],
  ])('gives the same generic answer for %s and starts no Session', async (_what, credentials) => {
    const { auth } = setup();
    await auth.signUp(ada);
    expect(await auth.logIn(credentials)).toEqual({ ok: false, error: 'invalid-credentials' });
    expect(await auth.currentSession()).toBeNull();
  });

  it.each([
    ['email', { email: '', password: 'engine1843' }],
    ['password', { email: 'ada@example.com', password: '' }],
  ])('asks for a missing %s before checking credentials', async (field, credentials) => {
    const { auth } = setup();
    const result = await auth.logIn(credentials);
    expect(result.ok).toBe(false);
    expect(Object.keys(result.fieldErrors)).toEqual([field]);
  });
});

const loggedIn = async () => {
  const ctx = setup();
  await ctx.auth.signUp(ada);
  await ctx.auth.logIn(ada);
  return ctx;
};

describe('Session', () => {
  it('has no Session before anyone has logged in', async () => {
    const { auth } = setup();
    expect(await auth.currentSession()).toBeNull();
  });

  it('survives a reload', async () => {
    const { storage } = await loggedIn();
    const afterReload = createAuth({ storage, delayMs: 0 });
    expect(await afterReload.currentSession()).toEqual({ name: 'Ada Lovelace', email: 'ada@example.com' });
  });
});

describe('Log out', () => {
  it('ends the Session', async () => {
    const { auth } = await loggedIn();
    await auth.logOut();
    expect(await auth.currentSession()).toBeNull();
  });

  it('keeps the Account so it can Log in again', async () => {
    const { auth } = await loggedIn();
    await auth.logOut();
    expect((await auth.logIn(ada)).ok).toBe(true);
  });
});

describe('Field rules', () => {
  const { validateField, validate } = createAuth({ storage: memoryStorage(), delayMs: 0 });

  it.each([
    ['name', 'a'.repeat(50), 'signup'],
    ['name', '李明', 'signup'],
    ['name', "Zoë O'Brien", 'signup'],
    ['name', '  Ada  ', 'signup'],
    ['email', 'ada@example.com', 'signup'],
    ['email', '  Ada@Example.COM ', 'login'],
    ['password', 'abcdefg1', 'signup'],
    ['password', 'pässwörd9', 'signup'],
    ['password', 'x', 'login'],
  ])('accepts %s %j on %s', (field, value, screen) => {
    expect(validateField(field, value, screen)).toBe('');
  });

  it.each([
    ['name', '', 'signup'],
    ['name', '   ', 'signup'],
    ['name', 'a'.repeat(51), 'signup'],
    ['email', '', 'login'],
    ['email', 'ada', 'signup'],
    ['email', 'ada@example', 'signup'],
    ['email', 'ada @example.com', 'signup'],
    ['password', 'abcdef1', 'signup'],
    ['password', 'abcdefgh', 'signup'],
    ['password', '12345678', 'signup'],
    ['password', '', 'login'],
  ])('rejects %s %j on %s with a message', (field, value, screen) => {
    expect(validateField(field, value, screen)).not.toBe('');
  });

  it('checks a whole form the way Sign up does', async () => {
    const { auth } = setup();
    const details = { name: 'a'.repeat(51), email: 'ada', password: 'abcdefgh' };
    const { fieldErrors } = await auth.signUp(details);
    expect(validate(details, 'signup')).toEqual(fieldErrors);
    expect(Object.keys(fieldErrors)).toEqual(['name', 'email', 'password']);
  });

  it('finds nothing wrong with a valid form', () => {
    expect(validate(ada, 'signup')).toBeNull();
  });
});

// Like browser localStorage shared by several tabs: a write in one tab fires a `storage`
// event in every other tab.
function sharedStorage() {
  const tabs = [];
  const shared = memoryStorage();
  const notifyOthers = (writer, key) =>
    tabs.filter((tab) => tab !== writer).forEach((tab) => tab.dispatchEvent(Object.assign(new Event('storage'), { key })));
  return function openTab() {
    const events = new EventTarget();
    tabs.push(events);
    const storage = {
      getItem: shared.getItem,
      setItem: (key, value) => (shared.setItem(key, value), notifyOthers(events, key)),
      removeItem: (key) => (shared.removeItem(key), notifyOthers(events, key)),
    };
    return createAuth({ storage, events, delayMs: 0 });
  };
}

describe('Session changes in another tab', () => {
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

  it('reports a Log in from another tab', async () => {
    const openTab = sharedStorage();
    const [first, second] = [openTab(), openTab()];
    await first.signUp(ada);
    const seen = [];
    second.onSessionChange((session) => seen.push(session));
    await first.logIn(ada);
    await settle();
    expect(seen).toEqual([{ name: 'Ada Lovelace', email: 'ada@example.com' }]);
  });

  it('reports a Log out from another tab', async () => {
    const openTab = sharedStorage();
    const [first, second] = [openTab(), openTab()];
    await first.signUp(ada);
    await first.logIn(ada);
    const seen = [];
    second.onSessionChange((session) => seen.push(session));
    await first.logOut();
    await settle();
    expect(seen).toEqual([null]);
  });

  it('stays quiet when another tab only signs up', async () => {
    const openTab = sharedStorage();
    const [first, second] = [openTab(), openTab()];
    const seen = [];
    second.onSessionChange((session) => seen.push(session));
    await first.signUp(ada);
    await settle();
    expect(seen).toEqual([]);
  });
});
