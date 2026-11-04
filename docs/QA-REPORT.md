# Quality assurance report

## Scope

Validated the public landing page and the sign-in and registration previews. No authenticated dashboard or backend is available in this project, so server-backed account creation, sign-in, email verification, password reset, live hackathon data, and private dashboard features are outside this QA scope.

## Results

| Area | Result |
|---|---|
| Production build | Passed with `npm run build`. |
| GitHub Pages base path | A `/campuscode/` build emitted correctly rebased font URLs and included both font license notices. |
| Production routes | `/`, `/login/`, and `/register/` each returned HTTP 200 and rendered the expected page title. |
| Font delivery | Browser verification confirmed both local variable fonts load on all three routes; no requests to Google Fonts hosts or browser console errors occurred. Sign-in and registration also remained overflow-free at 1440×900 and 390×844. |
| Responsive layouts | Tested all three routes at 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 430×932, 390×844, and 375×812. No document or form horizontal overflow was found. |
| Mobile navigation | Menu opens, Escape closes it and restores focus, and choosing a section closes the menu. |
| Theme | Light/dark toggle works and the selected theme persists through reload. |
| Page progress | Scroll progress updates and exposes its value through `aria-valuenow`. |
| Motion preview | Pointer and keyboard controls start/pause the preview; it resets when out of view. |
| Headline animation | The three hero lines animate with a stagger. With reduced motion enabled, the headline remains visible and the entrance animation is disabled. |
| Sign-in form | Required-field/email validation, password visibility, CAPTCHA refresh, reset-form open/back, and the no-backend message were exercised. |
| Registration form | Required fields, password matching, age confirmation, CAPTCHA, password visibility, and the no-backend message were exercised. |
| Browser console | No console errors were observed during the production-route and interaction checks. |

Form tests used synthetic `example.test` addresses and demo-only values. Valid submissions were intercepted client-side; no account or email operation was attempted.

## Limitations

- The forms are demonstrations and do not authenticate, create accounts, send verification codes, or send password-reset messages.
- Challenge themes are illustrative. No live hackathons or authenticated dashboard are connected.
- Automated accessibility audits, real-device testing, and assistive-technology testing were not run.
