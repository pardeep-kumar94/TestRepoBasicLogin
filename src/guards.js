import { auth } from './app-auth.js';

// For Log in and Sign up: true when nobody is logged in. Otherwise heads to Home, now or as
// soon as another tab logs in.
export async function requireNoSession() {
  if (await auth.currentSession()) {
    location.replace('/');
    return false;
  }
  auth.onSessionChange((session) => session && location.replace('/'));
  return true;
}
