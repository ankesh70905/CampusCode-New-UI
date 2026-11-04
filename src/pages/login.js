import { authCardHeader, authIntro, authLayout } from '../components/auth-layout.js';
import { captchaMarkup } from '../components/captcha.js';

function loginForm() {
  return `
    ${authCardHeader({
      eyebrow: 'SIGN IN',
      title: 'LOGIN',
      description: 'Demo form. Nothing you enter is sent.',
    })}
    <form class="auth-form" data-auth-form="login" novalidate>
      <div class="form-field">
        <label class="form-label" for="login-email">EMAIL ADDRESS</label>
        <div class="input-shell"><span aria-hidden="true">@</span><input id="login-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
      </div>
      <div class="form-field">
        <label class="form-label" for="login-password">PASSWORD</label>
        <div class="input-shell"><span aria-hidden="true">•</span><input id="login-password" name="password" type="password" placeholder="Enter your password" autocomplete="current-password" required><button class="password-toggle" type="button" data-password-toggle="login-password" aria-label="Show password" aria-pressed="false"><span aria-hidden="true">○</span> SHOW</button></div>
      </div>
      ${captchaMarkup()}
      <div class="auth-feedback" role="alert" aria-live="polite" hidden></div>
      <button class="button button--dark auth-submit" type="submit">CHECK SIGN-IN FORM <span aria-hidden="true">↗</span></button>
      <button class="auth-text-button" type="button" data-show-reset>FORGOT PASSWORD?</button>
    </form>
    <div class="auth-card__switch"><span>DON'T HAVE AN ACCOUNT?</span><a href="${import.meta.env.BASE_URL}register/">CREATE ACCOUNT →</a></div>
  `;
}

function resetForm() {
  return `
    ${authCardHeader({
      eyebrow: 'PASSWORD RESET',
      title: 'RESET',
      description: 'Reset emails are unavailable in this preview.',
    })}
    <form class="auth-form" data-auth-form="reset" novalidate>
      <p class="reset-title">RESET YOUR <strong>PASSWORD</strong></p>
      <div class="form-field">
        <label class="form-label" for="reset-email">EMAIL ADDRESS</label>
        <div class="input-shell"><span aria-hidden="true">@</span><input id="reset-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
      </div>
      ${captchaMarkup()}
      <div class="auth-feedback" role="alert" aria-live="polite" hidden></div>
      <button class="button button--dark auth-submit" type="submit">CHECK RESET FORM <span aria-hidden="true">↗</span></button>
      <button class="auth-text-button" type="button" data-show-login>← BACK TO LOGIN</button>
    </form>
    <div class="auth-card__switch"><span>DON'T HAVE AN ACCOUNT?</span><a href="${import.meta.env.BASE_URL}register/">CREATE ACCOUNT →</a></div>
  `;
}

export function loginPage() {
  const intro = authIntro({
    title: 'Sign-in preview.',
    description: 'The sign-in service is not connected in this preview.',
  });

  return authLayout(
    intro,
    `<div class="auth-card__content" data-login-content>${loginForm()}</div>`,
    'login',
  ).replace('<main class="auth-main">', `<main class="auth-main" data-reset-template="${encodeURIComponent(resetForm())}">`);
}
