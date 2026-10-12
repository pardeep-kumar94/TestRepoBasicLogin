// PROTOTYPE — throwaway. Floating variant switcher shared by prototype routes.
// Dev-only: renders nothing in production builds.

export function mountSwitcher({ variants, current, status, onChange }) {
  document.getElementById('proto-switcher')?.remove();
  if (!import.meta.env.DEV) return;

  const keys = Object.keys(variants);
  const i = keys.indexOf(current);
  const go = (step) => onChange(keys[(i + step + keys.length) % keys.length]);

  const bar = document.createElement('div');
  bar.id = 'proto-switcher';
  bar.style.cssText =
    'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:4px;padding:6px;border-radius:9999px;background:#111;color:#fff;font:500 13px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;box-shadow:0 8px 30px rgba(0,0,0,.35);max-width:calc(100vw - 32px)';
  const btn = 'background:#2a2a2a;color:#fff;border:0;border-radius:9999px;width:32px;height:32px;cursor:pointer;font-size:16px;flex:none';
  bar.innerHTML = `
    <button type="button" data-step="-1" style="${btn}" aria-label="Previous variant">‹</button>
    <div style="padding:0 10px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
      <div>${current} · ${variants[current].name}</div>
      <div style="opacity:.6;font-size:11px">${status}</div>
    </div>
    <button type="button" data-step="1" style="${btn}" aria-label="Next variant">›</button>`;
  bar.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]')?.dataset.step;
    if (step) go(Number(step));
  });
  document.body.append(bar);

  window.onkeydown = (e) => {
    if (e.target.closest?.('input, textarea, [contenteditable]')) return;
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  };
}
