import { refreshCaptcha } from '../components/captcha.js';

function showFeedback(form, message, kind = 'error') {
  const feedback = form.querySelector('.auth-feedback');
  if (!feedback) return;
  feedback.className = `auth-feedback auth-feedback--${kind}`;
  feedback.textContent = message;
  feedback.hidden = false;
}

function getCaptchaError(form) {
  const input = form.elements.namedItem('captcha');
  if (!input?.value.trim()) return 'Please enter the CAPTCHA code.';
  if (input.value.trim().toUpperCase() !== input.dataset.expected) {
    return 'CAPTCHA code does not match. Please try again.';
  }
  return '';
}

function emailIsValid(form) {
  const email = form.elements.namedItem('email');
  return email?.value.trim() && email.validity.valid;
}

function validateLogin(form) {
  const email = form.elements.namedItem('email');
  const password = form.elements.namedItem('password');
  if (!email.value.trim() || !password.value) {
    return 'Please enter your email and password.';
  }
  if (!email.validity.valid) return 'Please enter a valid email address.';
  return getCaptchaError(form);
}

function validateRegistration(form) {
  const name = form.elements.namedItem('name');
  const email = form.elements.namedItem('email');
  const password = form.elements.namedItem('password');
  const confirmation = form.elements.namedItem('confirmPassword');
  const ageConfirmed = form.elements.namedItem('ageConfirmed');

  if (!name.value.trim() || !email.value.trim() || !password.value || !confirmation.value) {
    return 'Please fill in all required fields.';
  }
  if (!email.validity.valid) return 'Please enter a valid email address.';
  if (password.value !== confirmation.value) return 'Your passwords do not match.';
  if (!ageConfirmed.checked) return 'Please confirm that you are 18 years of age or older.';
  return getCaptchaError(form);
}

function resetFormContent(main) {
  const template = main.dataset.resetTemplate;
  if (!template) {
    console.error('Password reset form template is unavailable.');
    return;
  }

  const content = main.querySelector('[data-login-content]');
  if (!content) {
    console.error('Login form container is unavailable.');
    return;
  }

  content.innerHTML = decodeURIComponent(template);
  initializeCaptcha(content);
}

function initializeCaptcha(container) {
  container.querySelectorAll('.captcha-field').forEach((field) => {
    refreshCaptcha(field);
  });
}

function initializePasswordToggles(container) {
  container.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-password-toggle]');
    if (!toggle) return;

    const input = container.querySelector(`#${CSS.escape(toggle.dataset.passwordToggle)}`);
    if (!input) {
      console.error(`Password field "${toggle.dataset.passwordToggle}" was not found.`);
      return;
    }

    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(visible));
    toggle.setAttribute('aria-label', `${visible ? 'Hide' : 'Show'} password`);
    toggle.innerHTML = `<span aria-hidden="true">${visible ? '◉' : '○'}</span> ${visible ? 'HIDE' : 'SHOW'}`;
  });
}

function initializeAuthForm(container, main) {
  container.addEventListener('click', (event) => {
    const refresh = event.target.closest('.captcha-refresh');
    if (refresh) refreshCaptcha(refresh.closest('.captcha-field'));

    if (event.target.closest('[data-show-reset]')) resetFormContent(main);
    if (event.target.closest('[data-show-login]')) window.location.reload();
  });

  container.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-auth-form]');
    if (!form) return;
    event.preventDefault();

    if (!emailIsValid(form)) {
      const email = form.elements.namedItem('email');
      if (email?.value.trim() && !email.validity.valid) {
        showFeedback(form, 'Please enter a valid email address.');
        email.focus();
        return;
      }
    }

    let error = '';
    if (form.dataset.authForm === 'login') error = validateLogin(form);
    if (form.dataset.authForm === 'register') error = validateRegistration(form);
    if (form.dataset.authForm === 'reset') {
      if (!form.elements.namedItem('email').value.trim()) {
        error = 'Please enter your email address.';
      } else if (!form.elements.namedItem('email').validity.valid) {
        error = 'Please enter a valid email address.';
      } else {
        error = getCaptchaError(form);
      }
    }

    if (error) {
      showFeedback(form, error);
      form.querySelector(':invalid')?.focus();
      return;
    }

    const message =
      form.dataset.authForm === 'login'
        ? 'Demo only: sign-in is unavailable because no authentication service is connected. Your credentials were not sent.'
        : form.dataset.authForm === 'register'
          ? 'Demo only: account creation is unavailable because no registration service is connected. Your information was not sent.'
          : 'Demo only: password reset is unavailable because no email service is connected. No reset email was sent.';
    showFeedback(form, message, 'info');
  });

  initializePasswordToggles(container);
  initializeCaptcha(container);
}

export function initializeAuth() {
  const main = document.querySelector('.auth-main');
  const container = document.querySelector('.auth-card__content');
  if (!main || !container) return;
  initializeAuthForm(container, main);
}
