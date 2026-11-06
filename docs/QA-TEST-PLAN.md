# Phase 8 QA Test Plan

## Scope

Exercise the frontend prototype's primary public, authentication, dashboard, event, project, growth, theme, persistence, and responsive workflows. Use synthetic browser data only. Verify important user-visible behavior and regressions, then record limits instead of treating automated spot checks as certification.

## Test environment

- React/Vite app, tested in a browser against local development and production-preview servers.
- Viewports: 1440×900, 1366×768, 1024×768, 768×1024, 430×932, 390×844, and 375×812.
- Themes: light and dark.
- State: synthetic demo records in LocalStorage; no real user accounts or services.
- Repository scripts: `npm run build`, `npm run dev`, `npm run preview`. No test or lint script is defined.

## Scenarios and expected results

| ID | Area | Scenario | Expected result |
|---|---|---|---|
| AUTH-01 | Login | Submit missing or malformed fields; toggle password visibility; submit valid demo details | Inline validation and visibility work; success is clearly simulated; password is not persisted |
| AUTH-02 | Register | Check required fields, mismatched passwords, strength, age/terms acknowledgements, and successful demo registration | Errors and strength feedback are visible; consent is required; only non-sensitive demo profile fields are stored |
| EVT-01 | Discovery | Search, apply one or more filters, reach an empty result, and clear filters | Results update, labels remain correct, empty state appears, and clear-all restores results |
| EVT-02 | Participation | Bookmark/register for a sample event and open My Events | Bookmark and simulated registration persist and appear in the appropriate list |
| EVT-03 | Event Hub | Navigate tabs; edit team details; submit work; read an announcement; preview a certificate | Local state updates; certificate/result content remains explicitly illustrative |
| PROJ-01 | Projects | Create a project, reject an unsafe `javascript:` URL, complete a milestone, and delete the project | Valid changes persist; unsafe scheme is rejected; deletion removes the project |
| GROW-01 | Growth | Submit sample work that qualifies for an achievement; review activity and certificate states | Derived records update without duplicating awards; sample credentials remain disclosed as previews |
| DASH-01 | Dashboard | Edit profile/skills, change weekly goal, read notifications, and refresh | Updates persist locally; a refresh alone does not create qualifying activity |
| STATE-01 | Persistence | Load empty and malformed dashboard state | Empty lists render; malformed state presents visible recovery rather than a blank or success-shaped screen |
| THEME-01 | Themes | Toggle light/dark, reload, and emulate OS preference without an explicit choice | Selected theme persists; OS preference is used when no saved preference exists |
| MOTION-01 | Motion | Enable reduced motion and inspect route families | Nonessential animation and smooth scrolling are reduced globally |
| ROUTE-01 | Routing | Open each implemented route and an unknown route directly | Route content or the intentional not-found view renders with a main landmark |
| RESP-01 | Responsive | Sweep routes across seven supplied viewport sizes in both themes | No unexpected horizontal page overflow, blank page, or broken image |
| A11Y-01 | Accessibility | Inspect accessible names/labels/alt text, heading structure, sampled contrast, focus, and dialog actions | Basic structural checks and sampled contrast pass; known small text targets and untested AT cases are recorded |
| SEC-01 | Security boundary | Inspect demo auth, browser persistence, URL validation, and dependency advisories | No claim of backend security or real authentication; tested unsafe project URL is rejected; audit results are reported with limits |

## Explicitly out of scope

No backend penetration test, real identity verification, actual email delivery, real CAPTCHA, duplicate-registration/deadline-boundary audit, full project edit/status audit, physical-device testing, full screen-reader testing, complete WCAG audit, actual print-dialog test, or Lighthouse/INP lab run is performed by this plan.
