import { auth } from '../app-auth.js';
import { passEmailToLogIn } from '../handoff.js';
import { renderShell, reveal } from '../shell.js';
import { screenSwitch, field, passwordToggle, formError, submitButton, heading, alertIcon, strengthMeter } from '../ui.js';
import { valuesOf, showFieldErrors, showFormError, setBusy, errorsIn, validateAsYouGo, wirePasswordToggle, wireStrengthMeter } from '../form.js';

if (await auth.currentSession()) {
  location.replace('/');
} else {
  renderShell({
    tagline: 'Start something new.',
    subtitle: 'One Account, everything in its place.',
    content: `
      ${screenSwitch('signup')}
      <form novalidate class="mt-10" data-form>
        ${heading('Create your Account', 'Just three things and you’re in.')}
        ${formError()}
        <div class="mt-7 space-y-3.5">
          ${field({ name: 'name', label: 'Name', icon: 'user', autocomplete: 'name', placeholder: 'Your name' })}
          ${field({ name: 'email', label: 'Email', icon: 'mail', type: 'email', autocomplete: 'email', placeholder: 'you@example.com' })}
          <div>
            ${field({ name: 'password', label: 'Password', icon: 'lock', type: 'password', autocomplete: 'new-password', placeholder: 'Create a password', trailing: passwordToggle() })}
            ${strengthMeter()}
          </div>
        </div>
        ${submitButton('Create Account')}
      </form>`,
  });
  wire(document.querySelector('[data-form]'));
  reveal();
}

function wire(form) {
  validateAsYouGo(form, 'signup');
  wirePasswordToggle(form);
  wireStrengthMeter(form);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showFormError(form, '');
    const errors = errorsIn(form, 'signup');
    if (errors) return showFieldErrors(form, errors);
    setBusy(form, true);
    const result = await auth.signUp(valuesOf(form));
    setBusy(form, false);

    if (result.ok) {
      location.assign('/signup/success/');
    } else if (result.fieldErrors) {
      showFieldErrors(form, result.fieldErrors);
    } else {
      showFieldErrors(form, {});
      showFormError(
        form,
        `${alertIcon()}<span>An Account with this email already exists. <a href="/login/" data-log-in class="font-semibold underline underline-offset-2">Log in</a></span>`,
      );
      form.querySelector('[data-log-in]').addEventListener('click', () => {
        passEmailToLogIn(form.elements.email.value.trim().toLowerCase());
      });
    }
  });
}
