import { createAuth } from './auth.js';

// The auth instance the pages share: browser localStorage with simulated network latency.
export const auth = createAuth();
