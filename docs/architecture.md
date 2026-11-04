# Project architecture

## Approach

Vite bundles semantic HTML, CSS and native JavaScript modules into a static site. The current public scope is a CampusCode landing experience and the observed login and registration pages. No authenticated dashboard was reachable in the inspected reference, so dashboard data and private views are not fabricated.

## Responsibilities

- `index.html`, `login/index.html`, `register/index.html`: document metadata, early theme preference, and app mount point.
- `src/main.js`: route selection, page rendering, and interaction initialization.
- `src/pages/`: route-level templates for the landing, login and registration pages.
- `src/components/`: reusable brand, header, footer, CAPTCHA, and authentication layout.
- `src/scripts/`: scoped navigation, auth, theme, experience and motion behavior.
- `src/styles/tokens.css`: light/dark palette, type, spacing, shape, elevation and motion tokens.
- `src/styles/base.css`: reset, baseline typography, focus treatment and reduced-motion behavior.
- `src/styles/site.css`, `src/styles/auth.css`: established page/component layout rules.
- `src/styles/redesign.css`: Phase 4 visual layer and theme-specific component treatments.
- `src/assets/fonts/`: self-hosted Inter and Plus Jakarta Sans variable fonts; license notices are in `public/assets/fonts/`.
- `docs/`: reference evidence, interaction map, component inventory, and the current design system.

## Design and motion

The current system is documented in [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md). It uses Plus Jakarta Sans for display and Inter for interface/body text, with CSS custom properties for both themes. Theme preference is stored in localStorage and applied before page styling where storage is available.

Motion is implemented with CSS transitions and a small IntersectionObserver utility. The page reveal script skips animation for reduced-motion users and leaves content visible if the observer API is unavailable. Native View Transitions are used when supported; the app remains navigable without them. No animation library is required.

## Routes and state

Direct routes are `/`, `/login` and `/register`; reset password is an inline login state. The landing menu scrolls to page sections. Password visibility, CAPTCHA refresh, theme selection and front-end validation remain client-side interactions.

Sign-in, account creation, email verification, and password reset require an API/backend. The current forms clearly state that submission is unavailable and do not send or persist personal information.

## Asset and deployment constraints

- Do not redistribute reference video or other third-party assets without permission. The experience panel uses original CSS animation.
- Typography assets are self-hosted; system fallbacks keep text readable if a font file fails to load.
- `npm run build` produces `dist/` for static hosting.
- Set `VITE_BASE_PATH` for GitHub Pages project deployments; keep `/` for domain-root hosting.
