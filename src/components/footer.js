import { brandMarkup } from './brand.js';

const groups = [
  {
    title: 'EXPLORE',
    links: [
      ['About', '#about'],
      ['Workflow', '#how'],
      ['Challenge themes', '#hackathons'],
      ['Community', '#community'],
    ],
  },
  {
    title: 'ACCOUNT',
    links: [
      ['Registration preview', 'register/'],
      ['Sign in', 'login/'],
      ['Contact', 'mailto:campuscode@gmail.com'],
    ],
  },
];

function footerLink(label, href) {
  const resolvedHref = href.startsWith('#')
    ? href
    : href.startsWith('mailto:')
      ? href
      : `${import.meta.env.BASE_URL}${href}`;

  return `<a href="${resolvedHref}">${label}</a>`;
}

export function landingFooter() {
  const columns = groups
    .map(
      ({ title, links }) => `
        <section class="footer-group" aria-label="${title}">
          <h2>${title}</h2>
          <ul>${links.map(([label, href]) => `<li>${footerLink(label, href)}</li>`).join('')}</ul>
        </section>`,
    )
    .join('');

  return `
    <footer class="site-footer" id="footer">
      <div class="site-footer__main">
        <div class="site-footer__identity">
          ${brandMarkup({ link: false })}
          <p>A frontend preview for a student hackathon platform.<br>No backend is connected; form data is not sent.</p>
        </div>
        <div class="site-footer__groups">${columns}</div>
      </div>
      <div class="site-footer__bottom">
        <span>© 2026 CAMPUSCODE</span>
      </div>
    </footer>
  `;
}

export function authFooter() {
  return `
    <footer class="auth-footer">
      <span>CAMPUSCODE © 2026</span>
      <span>PREVIEW ONLY · NO ACCOUNT SERVICE CONNECTED</span>
    </footer>
  `;
}
