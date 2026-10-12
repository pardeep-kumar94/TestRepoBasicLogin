// Behaviour shared by the Log in and Sign up forms.
import { auth } from './app-auth.js';
import { icons } from './icons.js';
import { passwordStrength, strengthLabels } from './strength.js';

const valuesOf = (form) => Object.fromEntries(new FormData(form));

function showFieldError(form, name, message) {
  const input = form.elements.namedItem(name);
  if (!input) return;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  form.querySelector(`#${name}-error`).textContent = message;
}

// Shows each field's error (clearing the rest); on any error, shakes the form and
// focuses the first invalid field.
function showFieldErrors(form, errors = {}) {
  for (const input of form.querySelectorAll('input[name]')) showFieldError(form, input.name, errors[input.name] ?? '');
  const firstInvalid = form.querySelector('[aria-invalid="true"]');
  if (!firstInvalid) return;
  form.classList.remove('shake');
  void form.offsetWidth; // restart the animation
  form.classList.add('shake');
  firstInvalid.focus();
}

function showFormError(form, html) {
  const box = form.querySelector('[data-form-error]');
  box.innerHTML = html;
  box.hidden = !html;
}

function setBusy(form, busy) {
  const button = form.querySelector('[data-submit]');
  button.disabled = busy;
  button.setAttribute('aria-busy', String(busy));
  button.querySelector('[data-label]').classList.toggle('invisible', busy);
  button.querySelector('[data-spinner]').hidden = !busy;
}

// Errors appear when a non-empty field loses focus, then update live while it is fixed.
function validateAsYouGo(form, screen) {
  const check = (input) => showFieldError(form, input.name, auth.validateField(input.name, input.value, screen));
  for (const input of form.querySelectorAll('input[name]')) {
    input.addEventListener('blur', () => input.value && check(input));
    input.addEventListener('input', () => input.getAttribute('aria-invalid') === 'true' && check(input));
  }
}

function wirePasswordToggle(form) {
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

function wireStrengthMeter(form) {
  const meter = form.querySelector('[data-strength]');
  if (!meter) return;
  const input = form.elements.namedItem('password');
  const label = meter.querySelector('[data-strength-label]');
  const dots = meter.querySelectorAll('[data-strength-dot]');
  input.addEventListener('input', () => {
    const score = input.value ? passwordStrength(input.value) : -1;
    label.textContent = score < 0 ? '' : strengthLabels[score];
    dots.forEach((dot, i) => (dot.style.background = i < score ? strengthColors[score] : ''));
  });
}

// Wires a Log in or Sign up form: live checks, password reveal, strength meter (if present),
// and submitting through `submit`. Obviously invalid details skip the simulated wait.
// `errorHtml` maps an auth error code to the form-level message shown for it.
export function wireAuthForm(form, { screen, submit, onSuccess, errorHtml }) {
  validateAsYouGo(form, screen);
  wirePasswordToggle(form);
  wireStrengthMeter(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showFormError(form, '');
    const errors = auth.validate(valuesOf(form), screen);
    if (errors) return showFieldErrors(form, errors);

    setBusy(form, true);
    const result = await submit(valuesOf(form));
    setBusy(form, false);

    if (result.ok) return onSuccess(result);
    showFieldErrors(form, result.fieldErrors);
    if (result.error) showFormError(form, errorHtml[result.error]);
  });
}
