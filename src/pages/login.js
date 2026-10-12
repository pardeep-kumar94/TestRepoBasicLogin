import { auth } from '../app-auth.js';
import { takeEmailForLogIn, takeNotice } from '../handoff.js';
import { renderShell, reveal } from '../shell.js';
import { screenSwitch, field, passwordToggle, formError, submitButton, heading, alertIcon, showToast } from '../ui.js';
import { valuesOf, showFieldErrors, showFormError, setBusy, errorsIn, validateAsYouGo, wirePasswordToggle } from '../form.js';

if (await auth.currentSession()) {
  location.replace('/');
} else {
  const email = takeEmailForLogIn() ?? '';
  renderShell({
    tagline: 'Welcome back.',
    subtitle: 'Your space is right where you left it.',
    content: `
      ${screenSwitch('login')}
      <form novalidate class="form-transition mt-10" data-form>
        ${heading('Log in to your Account', 'Enter your details to continue.')}
        ${formError()}
        <div class="mt-7 space-y-3.5">
          ${field({ name: 'email', label: 'Email', icon: 'mail', type: 'email', autocomplete: 'email', placeholder: 'you@example.com', value: email })}
          ${field({ name: 'password', label: 'Password', icon: 'lock', type: 'password', autocomplete: 'current-password', placeholder: 'Password', trailing: passwordToggle() })}
        </div>
        ${submitButton('Log in')}
      </form>`,
  });
  const form = document.querySelector('[data-form]');
  wire(form);
  reveal();
  auth.onSessionChange((session) => session && location.replace('/'));
  if (email) form.elements.password.focus();
  const notice = takeNotice();
  if (notice) showToast(notice);
}

function wire(form) {
  validateAsYouGo(form, 'login');
  wirePasswordToggle(form);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showFormError(form, '');
    const errors = errorsIn(form, 'login');
    if (errors) return showFieldErrors(form, errors);
    setBusy(form, true);
    const result = await auth.logIn(valuesOf(form));
    setBusy(form, false);

    if (result.ok) {
      location.assign('/');
    } else if (result.fieldErrors) {
      showFieldErrors(form, result.fieldErrors);
    } else {
      showFieldErrors(form, {});
      showFormError(form, `${alertIcon()}<span>Email or password is incorrect.</span>`);
    }
  });
}
