import { authFooter } from './footer.js';
import { authHeader } from './header.js';

export function authLayout(intro, card, routeName) {
  return `
    <div class="auth-page auth-page--${routeName}">
      <div class="auth-page__backdrop" aria-hidden="true"></div>
      ${authHeader()}
      <main class="auth-main">
        ${intro}
        <section class="auth-card-wrap" aria-label="${routeName === 'login' ? 'Sign in' : 'Create account'}">
          <div class="auth-card">${card}</div>
        </section>
      </main>
      ${authFooter()}
    </div>
  `;
}

export function authIntro({ title, description }) {
  return `
    <section class="auth-intro">
      <h1>${title}</h1>
      <p class="auth-intro__description">${description}</p>
    </section>
  `;
}

export function authCardHeader({ eyebrow, title, description }) {
  return `
    <div class="auth-card__header">
      <div>
        <span class="auth-card__eyebrow">${eyebrow}</span>
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
    </div>
  `;
}
