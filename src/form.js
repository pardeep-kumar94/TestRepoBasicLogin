// Behaviour shared by the Log in and Sign up forms.
import { validateField } from './auth.js';
import { icons } from './icons.js';
import { passwordStrength, strengthLabels } from './strength.js';

export const valuesOf = (form) => Object.fromEntries(new FormData(form));

export function showFieldError(form, name, message) {
  const input = form.elements.namedItem(name);
  if (!input) return;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  form.querySelector(`#${name}-error`).textContent = message;
}

// Shows each field's error (clearing the rest); on any error, shakes the form and
// focuses the first invalid field.
export function showFieldErrors(form, errors = {}) {
  for (const input of form.querySelectorAll('input[name]')) showFieldError(form, input.name, errors[input.name] ?? '');
  const firstInvalid = form.querySelector('[aria-invalid="true"]');
  if (!firstInvalid) return;
  form.classList.remove('shake');
  void form.offsetWidth; // restart the animation
  form.classList.add('shake');
  firstInvalid.focus();
}

// The same rules the auth module enforces, checked here so obvious mistakes skip the wait.
export function errorsIn(form, screen) {
  const errors = {};
  for (const input of form.querySelectorAll('input[name]')) {
    const message = validateField(input.name, input.value, screen);
    if (message) errors[input.name] = message;
  }
  return Object.keys(errors).length ? errors : null;
}

// Errors appear when a non-empty field loses focus, then update live while it is fixed.
export function validateAsYouGo(form, screen) {
  const check = (input) => showFieldError(form, input.name, validateField(input.name, input.value, screen));
  for (const input of form.querySelectorAll('input[name]')) {
    input.addEventListener('blur', () => input.value && check(input));
    input.addEventListener('input', () => input.getAttribute('aria-invalid') === 'true' && check(input));
  }
}

export function wirePasswordToggle(form) {
  const button = form.querySelector('[data-password-toggle]');
  const input = form.elements.namedItem('password');
  button.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(show));
    button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    button.innerHTML = show ? icons.eyeOff('size-[18px]') : icons.eye('size-[18px]');
  });
}

const strengthColors = ['var(--danger)', 'var(--danger)', 'var(--sun-3)', 'var(--accent)', 'var(--accent)'];

export function wireStrengthMeter(form) {
  const input = form.elements.namedItem('password');
  const label = form.querySelector('[data-strength-label]');
  const dots = form.querySelectorAll('[data-strength-dot]');
  input.addEventListener('input', () => {
    const score = input.value ? passwordStrength(input.value) : -1;
    label.textContent = score < 0 ? '' : strengthLabels[score];
    dots.forEach((dot, i) => (dot.style.background = i < score ? strengthColors[score] : ''));
  });
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
