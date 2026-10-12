// Behaviour shared by the Log in and Sign up forms.

export const valuesOf = (form) => Object.fromEntries(new FormData(form));

export function showFieldError(form, name, message) {
  const input = form.elements.namedItem(name);
  if (!input) return;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  form.querySelector(`#${name}-error`).textContent = message;
}

// Shows each field's error (clearing the rest) and focuses the first invalid field.
export function showFieldErrors(form, errors = {}) {
  for (const input of form.querySelectorAll('input[name]')) showFieldError(form, input.name, errors[input.name] ?? '');
  form.querySelector('[aria-invalid="true"]')?.focus();
}

export function showFormError(form, html) {
  const box = form.querySelector('[data-form-error]');
  box.innerHTML = html;
  box.hidden = !html;
}

export function setBusy(form, busy) {
  const button = form.querySelector('[data-submit]');
  button.disabled = busy;
  button.setAttribute('aria-busy', String(busy));
  button.querySelector('[data-label]').classList.toggle('invisible', busy);
  button.querySelector('[data-spinner]').hidden = !busy;
}
