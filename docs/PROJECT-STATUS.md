# Project status

Updated: 2026-11-04

## What is implemented

- Responsive CampusCode public landing page and its sign-in and registration previews.
- Distinct light and dark themes, with the selected theme persisted locally.
- Animated “Build. Compete. Ship.” hero, section navigation, and reduced-motion support.
- Local Inter and Plus Jakarta Sans variable fonts with SIL Open Font License notices.
- Form validation and client-side preview interactions.

## Validation

- `npm ci`: passed; 17 packages audited, 0 vulnerabilities reported.
- `npm run build`: passed.
- All three static routes are included in the production build.
- Real browser screenshots were captured at desktop and mobile viewport sizes in both themes; see [screenshots](./screenshots/).
- GitHub Pages subpath build and local font paths were verified in the prior QA cycle.

## Known limitations

- The project is a public frontend, not a connected authenticated dashboard.
- Login, account creation, CAPTCHA, and password reset are demo-only; no form data is sent.
- There is no backend, live event data, account service, or deployment URL.
- Automated accessibility audits and physical-device testing have not been performed.

## Release status

The local project is being prepared for GitHub. It is not yet a Git repository and has not been published. Public repository creation requires the owner's confirmation; GitHub write authentication is not yet verified.
