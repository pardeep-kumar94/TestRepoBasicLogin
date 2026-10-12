// A short message for the next page to announce (e.g. after Log out), kept in sessionStorage
// so it survives exactly one navigation in this tab.

const NOTICE_KEY = 'notice';

export function passNotice(text) {
  try {
    sessionStorage.setItem(NOTICE_KEY, text);
  } catch {
    // Storage unavailable: the next page just won't show the message.
  }
}

export function takeNotice() {
  try {
    const text = sessionStorage.getItem(NOTICE_KEY);
    sessionStorage.removeItem(NOTICE_KEY);
    return text;
  } catch {
    return null;
  }
}
