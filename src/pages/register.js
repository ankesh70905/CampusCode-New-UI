import { authCardHeader, authIntro, authLayout } from '../components/auth-layout.js';
import { captchaMarkup } from '../components/captcha.js';

function registrationForm() {
  return `
    ${authCardHeader({
      eyebrow: 'CREATE ACCOUNT',
      title: 'REGISTER',
      description: 'Demo form. Nothing you enter is sent.',
    })}
    <form class="auth-form" data-auth-form="register" novalidate>
      <div class="form-field">
        <label class="form-label" for="register-name">FULL NAME</label>
        <div class="input-shell"><span aria-hidden="true">◇</span><input id="register-name" name="name" type="text" placeholder="Your full name" autocomplete="name" required></div>
      </div>
      <div class="form-field">
        <label class="form-label" for="register-email">EMAIL ADDRESS</label>
        <div class="input-shell"><span aria-hidden="true">@</span><input id="register-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
      </div>
      <div class="form-field">
        <label class="form-label" for="register-account-type">ACCOUNT TYPE</label>
        <div class="input-shell input-shell--disabled"><span aria-hidden="true">♟</span><input id="register-account-type" type="text" value="STUDENT" aria-label="Account type: student only" disabled></div>
        <p class="form-note">Organizer? Accounts are created by our team — contact <a href="mailto:campuscode@gmail.com">campuscode@gmail.com</a></p>
      </div>
      <div class="form-field">
        <label class="form-label" for="register-password">PASSWORD</label>
        <div class="input-shell"><span aria-hidden="true">•</span><input id="register-password" name="password" type="password" placeholder="Create a password" autocomplete="new-password" required><button class="password-toggle" type="button" data-password-toggle="register-password" aria-label="Show password" aria-pressed="false"><span aria-hidden="true">○</span> SHOW</button></div>
      </div>
      <div class="form-field">
        <label class="form-label" for="register-confirm">CONFIRM PASSWORD</label>
        <div class="input-shell"><span aria-hidden="true">•</span><input id="register-confirm" name="confirmPassword" type="password" placeholder="Repeat your password" autocomplete="new-password" required><button class="password-toggle" type="button" data-password-toggle="register-confirm" aria-label="Show password" aria-pressed="false"><span aria-hidden="true">○</span> SHOW</button></div>
      </div>
      ${captchaMarkup()}
      <label class="age-check"><input name="ageConfirmed" type="checkbox" required><span>I confirm that I am 18 years of age or older.</span></label>
      <div class="auth-feedback" role="alert" aria-live="polite" hidden></div>
      <button class="button button--dark auth-submit" type="submit">CHECK REGISTRATION FORM <span aria-hidden="true">↗</span></button>
    </form>
    <div class="auth-card__switch"><span>ALREADY HAVE AN ACCOUNT?</span><a href="${import.meta.env.BASE_URL}login/">LOGIN →</a></div>
  `;
}

export function registerPage() {
  const intro = authIntro({
    title: 'Registration preview.',
    description: 'Account creation is not connected in this preview.',
  });

  return authLayout(
    intro,
    `<div class="auth-card__content">${registrationForm()}</div>`,
    'register',
  );
}
