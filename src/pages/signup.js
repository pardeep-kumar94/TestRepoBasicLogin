import { auth } from '../app-auth.js';
import { requireNoSession } from '../guards.js';
import { renderShell, reveal } from '../shell.js';
import { screenSwitch, field, passwordToggle, formError, submitButton, heading, alertIcon, strengthMeter } from '../ui.js';
import { wireAuthForm } from '../form.js';

if (await requireNoSession()) {
  renderShell({
    tagline: 'Start something new.',
    subtitle: 'One Account, everything in its place.',
    content: `
      ${screenSwitch('signup')}
      <form novalidate class="form-transition mt-10" data-form>
        ${heading('Sign up for an Account', 'Just three things and you’re in.')}
        ${formError()}
        <div class="mt-7 space-y-3.5">
          ${field({ name: 'name', label: 'Name', icon: 'person', autocomplete: 'name', placeholder: 'Your name' })}
          ${field({ name: 'email', label: 'Email', icon: 'mail', type: 'email', autocomplete: 'email', placeholder: 'you@example.com' })}
          <div>
            ${field({ name: 'password', label: 'Password', icon: 'lock', type: 'password', autocomplete: 'new-password', placeholder: 'Create a password', trailing: passwordToggle() })}
            ${strengthMeter()}
          </div>
        </div>
        ${submitButton('Sign up')}
      </form>`,
  });
  wireAuthForm(document.querySelector('[data-form]'), {
    screen: 'signup',
    submit: auth.signUp,
    onSuccess: () => location.assign('/signup/success/'),
    errorHtml: {
      'email-taken': `${alertIcon()}<span>An Account with this email already exists. <a href="/login/" class="font-semibold underline underline-offset-2">Log in</a></span>`,
    },
  });
  reveal();
}
