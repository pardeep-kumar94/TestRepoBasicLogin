import { auth } from '../app-auth.js';
import { requireNoSession } from '../guards.js';
import { takeNotice } from '../notice.js';
import { renderShell, reveal } from '../shell.js';
import { screenSwitch, field, passwordToggle, formError, submitButton, heading, alertIcon, showToast } from '../ui.js';
import { wireAuthForm } from '../form.js';

// Taken before the guard, so a message meant for this visit never lingers to a later one.
const notice = takeNotice();

if (await requireNoSession()) {
  const email = (await auth.takeLogInEmail()) ?? '';
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
  wireAuthForm(form, {
    screen: 'login',
    submit: auth.logIn,
    onSuccess: () => location.assign('/'),
    errorHtml: { 'invalid-credentials': `${alertIcon()}<span>Email or password is incorrect.</span>` },
  });
  reveal();
  if (email) form.elements.password.focus();
  if (notice) showToast(notice);
}
