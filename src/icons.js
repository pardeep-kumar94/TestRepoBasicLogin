// Inline SVG icons; stroke follows currentColor.
const svg = (paths, cls = 'size-5') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

export const icons = {
  sun: (cls) => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>', cls),
  moon: (cls) => svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', cls),
  user: (cls) => svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', cls),
  mail: (cls) => svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', cls),
  lock: (cls) => svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', cls),
  arrow: (cls) => svg('<path d="M5 12h14M13 6l6 6-6 6"/>', cls),
  check: (cls) => svg('<path d="m5 12 5 5L20 7"/>', cls),
  alert: (cls) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>', cls),
};
