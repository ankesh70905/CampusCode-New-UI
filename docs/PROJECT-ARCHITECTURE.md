# CampusCode ReBuild '26 — Project Architecture

## Implemented stack

- React + Vite, JavaScript, custom CSS.
- React Router for route composition.
- Lucide React for selective interface icons.
- Browser LocalStorage for explicitly local demo state.
- No motion library by default; CSS transitions and keyframes are sufficient unless a later, specific interaction justifies another dependency.

The prototype currently uses this stack with CSS motion; no animation library has been added.

`src/state/ThemeProvider.jsx` owns shared light/dark preference state, updates the document theme, persists the non-sensitive preference, and synchronizes valid changes from another tab. An inline script in `index.html` applies a saved preference or the operating-system preference before React mounts to avoid a theme flash. `src/components/ThemeToggle.jsx` is shared by the public, authentication, workspace, and fallback shells. Theme persistence is separate from dashboard data.

## Current structure

```text
index.html
public/
  assets/brand/campuscode-logo.png
src/
  App.jsx
  main.jsx
  assets/brand.js
  components/
  data/
  pages/
  state/
  utils/
  styles.css
docs/
  product, design, architecture, QA, accessibility, performance,
  security, and AI-assistance records
```

`src/App.jsx` owns route composition; shared shells are in `src/components/`, route content in `src/pages/`, sample records in `src/data/`, persistence/theme logic in `src/state/`, and validation/date helpers in `src/utils/`. Vite serves the original logo from `public/assets/brand/`; `src/assets/brand.js` prefixes it with `import.meta.env.BASE_URL` for subpath hosting.

For the existing GitHub Pages project-site path, `vite.config.js` reads `VITE_BASE_PATH`, `src/main.jsx` passes Vite's base URL to React Router as its basename, and the build emits `dist/404.html` for SPA route fallback. `.github/workflows/deploy-pages.yml` defines the production build/deploy pipeline; it is not active until the repository uses GitHub Actions as its Pages source and the workflow is merged to the deployment branch.

## Route ownership

- Public routes: `/`, `/login`, `/register`.
- Dashboard route family: `/app` and its nested feature routes. `src/App.jsx` mounts `DashboardLayout` at `/app`, with `DashboardOverviewPage` at the index route, event routes for discovery/details/Event Hub/My Events, and workspace routes for profile, projects, achievements, certificates, notifications, and settings. Only genuinely unfinished routes use the placeholder page.
- `DashboardLayout` owns shared navigation, local state loading/saving/reset, storage error feedback, and an outlet context; page components own route-specific composition.
- Use explicit not-found handling and guard invalid event identifiers with an honest empty state.
- A demo-only route guard may guide users to login, but it must not be presented as security or real access control.

## State and data boundaries

### Static sample data

Store example events, project examples, and achievement criteria under `src/data/`. Use stable IDs and mark records as examples where rendered. `src/data/eventsMockData.js` is the authoritative fictional event catalog, including rounds and illustrative event content; dashboard seed records do not duplicate event summaries.

### Local demo state

Use a small provider/context or feature-level state, selected according to actual cross-route sharing needs. The current implementation stores versioned dashboard state in `campuscode.dashboardState` and reads the existing registration profile from `campuscode.demoProfile`. Current shape:

```js
{
  version: 3,
  profile: { name: "", email: "", accountType: "Student", institution: "", skills: [], visibility: {} },
  projects: [], // sample or locally entered metadata, milestones, and history
  activityLog: [], // chronological sample and local action records
  activityRecords: [], // one qualifying streak record per device-local day
  achievementUnlocks: [], // stable, deduplicated local award records
  streakMilestones: [], // stable 3/7/14/30/60/100-day records
  notifications: [], // local illustrative reminders
  registrations: [], // local demo participation keyed by eventId
  bookmarks: [], // event IDs; separate from participation
  weeklyGoal: { target: 3 },
  settings: { deadlineReminders: true, projectReminders: true },
  updatedAt: ""
}
```

`src/state/dashboardState.js` owns initial state, validation, v1/v2-to-v3 migrations, loading, saving, reset, qualifying activity recording, achievement/streak unlock deduplication, notification filtering, and derived summaries. `src/state/growthLogic.js` owns pure streak, monthly calendar, and chronological feed derivation. Registrations reference the static event catalog by `eventId` and contain local team, round progress, submission, and announcement-read state; bookmarks hold catalog IDs separately. Project-event relationships must reference a local registration. `getCertificateRecords` derives one preview per completed event registration. `src/components/DashboardLayout.jsx` calls persistence helpers and provides state/update/reset/notify callbacks through outlet context; its callbacks and context object are memoized to keep toast-only changes from needlessly refreshing route consumers. `src/pages/EventPages.jsx` owns event discovery, details/registration, My Events, and Event Hub; `src/pages/DashboardFeaturePages.jsx` owns project list/detail, achievement, activity, profile, certificate, notification, and settings routes. Achievement and certificate details use native dialogs and retain keyboard dismissal. `DashboardOverviewPage` joins streak/weekly summaries, monthly calendar, activity feed, and growth snapshot. `src/utils/localDate.js` captures the browser-local day at action time; stored keys preserve that day if the device timezone changes. Calendar differences use UTC day numbers to avoid daylight-saving offsets. Dashboard visits do not record activity, and only explicit qualifying actions can create one streak record per local date.

The state shape is versioned. Malformed JSON or an unsupported version produces an explicit error; the UI must surface it with a reset/recovery path rather than silently replacing user data. Never put passwords in this object.

### Persistence

- Isolate LocalStorage reads/writes behind `utils/storage.js`.
- Parse and validate loaded values; handle missing, malformed, outdated, and unavailable storage explicitly.
- Version stored state and define a predictable migration/reset path.
- Keep UI feedback truthful: local write completion means saved on this browser, not synchronized.
- Provide an obvious “Reset demo data” action with confirmation if reset removes user-entered work.

## Form and validation approach

- Keep form state and field validation close to each form.
- Share only small pure helpers if rules repeat (email shape, password confirmation, strength hints).
- Use native form semantics, labels, input types, and submit behavior.
- Do not persist passwords or send form data over the network.
- Treat age confirmation as a user attestation in the demo; do not infer or verify age.

## Styling and motion

- Start with global reset, semantic design tokens, typography, focus styles, and reduced-motion rules.
- Scope styles by component/feature and reuse tokens; avoid a large utility framework.
- CSS is the default motion tool. Animate only selected entrances and state transitions.
- Do not animate values in a way that delays access to content or makes progress misleading.
- The shared `src/styles.css` implements brand/semantic tokens and all responsive routes. Phase 6 corrected the reduced-motion rule boundary so dashboard growth and responsive styles remain active with either motion preference, removed a nonessential looping decoration, and refined essential text readability and focus states.
- The stylesheet provides a persistent light/dark theme through semantic color tokens, with route-family overrides for surfaces that use fixed editorial or data-visualization colors. Shared typography role tokens support consistent new content without removing intentional page-specific scale.
- Password strength is announced as a progress bar with numeric and text values; dialogs support keyboard dismissal. Formal contrast measurement and a broader assistive-technology audit remain future work.

## Testing and quality gates for later phases

- Unit-level checks for pure validation, filtering, and derived progress logic.
- Manual keyboard and reduced-motion review of the core journeys.
- Verify persistence, reset, invalid stored data, and refresh behavior.
- Check no network calls, real student statistics, or credentials are introduced.
- Run the repository's existing lint/build/test commands once application scaffolding exists; do not install test tooling solely for Phase 0.

## Trust boundaries

There is no backend trust boundary in this prototype. Local state is user-controlled and not secure. Never store secrets, imply authorization, or use local values as proof of identity or event attendance.
