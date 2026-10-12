import './styles.css';
import { HIDE_ID } from './boot.js';
import { mountThemeToggle } from './theme.js';

const blobs = '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="grain"></div>';

// Variant C "Framed bento": a rounded, inset Sunset card beside a centred content column.
// `content` is trusted markup; escape anything visitor-supplied before passing it in.
export function renderShell({ tagline, subtitle, content }) {
  document.getElementById('app').innerHTML = `
    <main class="grid min-h-dvh gap-3 p-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-4 lg:p-4">
      <aside class="sunset flex h-40 flex-col justify-end rounded-[28px] p-5 lg:h-auto lg:p-10">
        ${blobs}
        <div class="hidden max-w-md rounded-3xl border border-white/30 bg-white/15 p-7 text-on-sun backdrop-blur-xl lg:block">
          <p class="font-serif text-4xl leading-tight xl:text-5xl">${tagline}</p>
          <p class="mt-3 opacity-80">${subtitle}</p>
        </div>
      </aside>
      <section class="flex items-center justify-center px-3 py-10 sm:px-8">
        <div class="w-full max-w-[400px]">${content}</div>
      </section>
    </main>`;
  mountThemeToggle();
}

// Shows the page; call once the page's guard has decided to stay.
export function reveal() {
  document.getElementById(HIDE_ID)?.remove();
}
