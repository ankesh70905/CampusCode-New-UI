# Phase 8 QA Test Results

**Date:** 2026-11-07
**Overall:** Targeted functional and regression checks passed after the fixes below. This is not a production-readiness certification.

## Results

| Area | Result | Evidence / limits |
|---|---|---|
| Login and registration | Pass | Validation, visibility toggles, remembered preference, consent/strength feedback, demo success, and no password in LocalStorage were checked. Verification is simulated, not real. |
| Events and Event Hub | Pass | Search, filters, combined filters, empty state, clear-all, bookmark persistence, simulated registration/My Events synchronization, tabs, team edits, submissions, announcement read state, and sample certificate preview were exercised. |
| Projects and growth | Pass | Project creation, unsafe URL-scheme rejection, milestone persistence, deletion, achievement unlock, profile/skill edits, weekly goal, notifications, and activity behavior were exercised. |
| Local state | Pass with limits | Empty states and malformed-state recovery were checked. State is browser-local and can be altered or cleared by a user. |
| Responsive/theme regression | Pass | 17 routes × seven viewports × two themes = 238 checks; no horizontal overflow, unexpected theme, missing main content, blank page, broken image, failed request, console error, or page error was observed. |
| Accessibility samples | Partial | 32 route/theme structural checks and 30 targeted contrast pairs passed the stated checks. Some mobile text actions are below 24 CSS pixels; see the accessibility report. |
| Production build | Pass | `npm run build` succeeded with Vite 6.4.5. |
| Dependency advisory scan | Pass | `npm audit --json`: 0 known vulnerabilities across 121 dependencies. This is not an application security audit. |
| Production-preview smoke | Pass | Seven representative routes, including unknown-route fallback, rendered a main landmark and nonempty content without broken images or page errors. |

## Defects fixed and retested

1. Event filter labels formed incorrect plurals; labels now use correct category wording.
2. Registration dialog close/cancel could leave stale React state and did not restore focus; close/cancel now update parent state and return focus to the trigger.
3. Reduced-motion overrides were limited to authentication pages; they now apply globally and disable smooth scrolling.
4. Targeted light/dark theme combinations had low contrast or mismatched surfaces; sampled colors were adjusted and retested.
5. A very long unbroken profile-preview name caused mobile horizontal overflow; wrapping was added and the 375px regression case no longer overflows.

## Not verified

Duplicate-registration and deadline-boundary rules, full project edit/status workflows, full assistive-technology and screen-reader testing, full keyboard-only coverage, physical-device testing, actual print output, Lighthouse metrics, INP, server-side security, and hackathon AI-policy compliance were not verified. See the individual reports for details.

## Phase 9 deployment-preparation checks

- `npm run build` and `VITE_BASE_PATH=/CampusCode-New-UI/ npm run build` both passed.
- The project-base build generated 30 static entry pages for the declared public, dashboard, event, and project routes, plus `dist/404.html`; JS, CSS, and logo references use the `/CampusCode-New-UI/` base.
- A GitHub Pages-style local host simulation loaded seven representative direct routes (overview, login, registration, event discovery, event hub, project detail, and profile). Each reached HTTP 200 after any directory redirect, rendered the expected page title and main content, and had no broken images, failed requests, or page errors. Query strings and fragments were preserved on the project route.
- After deployment run `42294607939`, live browser checks visited the homepage, overview, login, registration, event discovery, Event Hub, project detail, and profile. All returned HTTP 200 after any directory redirect, showed expected titles and main content, and loaded the logo without failed requests or page errors.
- After the repository rename, the previous `CampusCode-Recreate` Pages URL returned HTTP 404. The first deployment at `CampusCode-New-UI` used stale asset and router paths.
- PR #4 updated the Pages build base; deployment run `42296184855` succeeded. Live browser checks confirmed the homepage, dashboard overview, login, Event Hub, and project detail load with the renamed path, HTTP 200 responses, expected titles/content, and working logo. No failed requests or page errors were observed.
