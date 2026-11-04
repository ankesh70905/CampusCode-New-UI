import { brandMarkup } from './brand.js';

const sectionLinks = [
  ['ABOUT', 'about'],
  ['HOW IT WORKS', 'how'],
  ['HACKATHONS', 'hackathons'],
  ['COMMUNITY', 'community'],
];

function themeToggle(className = '') {
  return `
    <button class="theme-toggle ${className}" type="button" data-theme-toggle aria-label="Switch to dark theme">
      <svg class="theme-toggle__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
      <svg class="theme-toggle__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z"/></svg>
      <span class="theme-toggle__label">Dark</span>
    </button>
  `;
}

export function landingHeader() {
  const links = sectionLinks
    .map(
      ([label, id]) =>
        `<button class="site-nav__link" type="button" data-scroll-to="${id}">${label}</button>`,
    )
    .join('');
  const joinHref = `${import.meta.env.BASE_URL}register/`;
  const loginHref = `${import.meta.env.BASE_URL}login/`;

  return `
    <header class="site-header">
      ${brandMarkup()}
      <nav class="site-nav" aria-label="Main navigation">${links}</nav>
      <div class="site-header__actions">
        <a class="site-header__login" href="${loginHref}">LOGIN</a>
        ${themeToggle()}
        <a class="button button--outline site-header__join" href="${joinHref}">ACCOUNT PREVIEW <span aria-hidden="true">↗</span></a>
      </div>
      <a class="site-header__mobile-login" href="${loginHref}">LOGIN</a>
      ${themeToggle('site-header__theme')}
      <button class="menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu">
        <span aria-hidden="true">☰</span>
      </button>
      <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" hidden>
        ${sectionLinks.map(([label, id]) => `<button class="mobile-menu__link" type="button" data-scroll-to="${id}">${label}</button>`).join('')}
        <a class="button button--outline mobile-menu__join" href="${joinHref}">ACCOUNT PREVIEW <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  `;
}

export function authHeader() {
  return `
    <header class="auth-header">
      ${brandMarkup()}
      <div class="auth-header__actions">
        ${themeToggle()}
        <a class="auth-header__back" href="${import.meta.env.BASE_URL}">← BACK TO HOME</a>
      </div>
    </header>
  `;
}
