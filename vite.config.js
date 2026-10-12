import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { themeScript, HIDE_ID, hideStyle, transitionStyle } from './src/boot.js';

const page = (path) => resolve(import.meta.dirname, path);

// Every page gets the same head: fonts, pre-paint theme, view-transition opt-in, and
// hidden-until-guarded.
// Page scripts block rendering, so the first frame (and any view transition) shows the
// built page rather than an empty one. Runs last so it also catches Vite's rewritten tags.
const pageHead = {
  name: 'page-head',
  transformIndexHtml: {
    order: 'post',
    handler: (html) => ({
      html: html.replace(/<script type="module"(?![^>]*\bblocking=)/g, '<script type="module" blocking="render"'),
      tags: pageTags,
    }),
  },
};

const pageTags = [
  { tag: 'style', attrs: { id: HIDE_ID }, children: hideStyle, injectTo: 'head-prepend' },
  { tag: 'style', children: transitionStyle, injectTo: 'head-prepend' },
  { tag: 'script', children: themeScript, injectTo: 'head-prepend' },
  { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' }, injectTo: 'head' },
  { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, injectTo: 'head' },
  {
    tag: 'link',
    attrs: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif&display=swap',
    },
    injectTo: 'head',
  },
  {
    tag: 'noscript',
    children:
      '<style>html{visibility:visible}</style><p style="font:16px system-ui;padding:2rem">This page needs JavaScript to Log in or Sign up.</p>',
    injectTo: 'body',
  },
];

export default defineConfig({
  plugins: [tailwindcss(), pageHead],
  build: {
    rollupOptions: {
      input: {
        home: page('index.html'),
        login: page('login/index.html'),
        signup: page('signup/index.html'),
        signupSuccess: page('signup/success/index.html'),
      },
    },
  },
  test: {
    include: ['src/**/*.test.js'],
  },
});
