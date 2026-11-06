# CampusCode ReBuild '26 — Component Inventory

This inventory describes the current implementation. Proposed enhancements and remaining audit work are identified separately in the roadmap and status notes.

## Shared shell and primitives

| Component | Purpose and likely inputs | State / events | Data flow |
|---|---|---|---|
| `App` | Application entry; mounts router and shared providers | Route transitions | Router connects the four required route families |
| `SiteHeader` | Brand mark, public navigation, login/join actions | Menu open on compact screens; link clicks | Routes to landing, login, register |
| `SiteFooter` | Product links, disclosure, attribution | None beyond navigation | Static copy |
| `ThemeProvider`, `ThemeToggle` | Shared light/dark theme state and accessible control | User selection, cross-tab storage events, persistence failure announcement | Persists only the theme preference in `campuscode.theme`; initial theme is set before React renders |
| `DashboardLayout` | Implemented dashboard header/navigation and nested page outlet | Current route, local state, toast and storage error/reset actions | Loads versioned local state, provides update/reset/notify functions through outlet context |
| `Button` | Consistent action styles; `variant`, `size`, `disabled`, children | Click / keyboard activation | Calls parent callback or navigates |
| `TextField` | Labeled text/password input; label, error, hint, type | Value, touched, visibility when applicable | Controlled by containing form |
| `StatusBadge` | Textual state indicator; status and label | None | Receives explicit state, does not infer a real backend status |
| `SectionHeading` | Heading, optional eyebrow and supporting copy | None | Presentational |
| `EmptyState` | Explain an empty collection and offer a next action | Action click | Callback to parent |
| `ToastRegion` / `Toast` | Announce local demo feedback | Queue and dismissal | UI feedback only; no server action implied |
| `Modal` | Accessible dialog for confirmations/previews | Open, close, escape, backdrop policy | Parent owns dialog content/state |

## Public and account experiences

| Component | Purpose and likely inputs | State / events | Data flow |
|---|---|---|---|
| `LandingHero` | Editorial value proposition and primary calls to action | Minimal reveal state; reduced-motion aware | Links to registration and event discovery |
| `FeaturedEvents` | Curated sample opportunity previews | Optional carousel only if keyboard-accessible and justified | Reads clearly labeled mock event records |
| `HowItWorks` | Explain discovery-to-participation journey | None | Static content |
| `CommunityOpportunities` | Show types of opportunities without invented metrics | Link selection | Static, non-quantified claims |
| `LoginForm` | Email, password, remember-me demo control | Field values, errors, password visibility | Validates locally; invokes demo session action; never authenticates remotely |
| `RegisterForm` | Name, email, account type, password/confirmation, age confirmation | Values, validation, strength, visibility | Creates a local demo profile only; verification feedback explicitly mocked |
| `PasswordStrength` | Explain password strength locally | Derived from current password | Pure derived presentation; no network calls |
| `AuthLayout` | Share the distinctive two-column auth shell, logo/home route, cross-navigation, and local-demo disclosure | Page variant and content are props | Wraps Login/Register page-specific forms |
| `AuthField` | Associate labels, inputs, hints, and validation feedback | Controlled by containing form; optional trailing control | Inputs and field error map belong to Login/Register |
| `DemoHumanCheck` | Provide a frontend-only checkbox interaction | Checked state and error are props | A demo prerequisite only; not a CAPTCHA or security control |
| `AuthToast` | Announce success, error, and informational feedback accessibly | Toast content/type and dismiss callback are props | Parent page owns toast lifecycle |

## Student workspace

| Component | Purpose and likely inputs | State / events | Data flow |
|---|---|---|---|
| `DashboardOverviewPage` | Implemented welcome, summary, momentum panels, deadlines, activity and quick actions | Local date; explicit learning-session action | Derives display from dashboard state and illustrative records |
| `StatTile`, `StreakPanel`, `WeeklyActivityPanel`, `ActivityCalendarPanel`, `WeeklyGoalCard`, `QuickActions`, `DeadlinesPanel`, `RecentActivityPanel` | Overview sections implemented within `DashboardOverviewPage` | Check-in, weekly goal adjustment, and navigation links | Summary and activity derive from local state; deadlines and seed feed are labeled examples |
| `StudentProfilePage` | Edit local identity/skills and preview selected visibility | Controlled fields, add/remove skills, visibility toggles, save | Persists non-sensitive choices; preview is not published or shared |
| `ProjectsPage`, `ProjectDetailPage` | Create/edit/remove projects and inspect metadata, history, event link, and seven milestones | Validated form, confirmation on remove, status changes, milestone completion | Persists local projects; qualifying activity is capped at one streak record per device-local day; event submission requires a local registration |
| `AchievementsPage`, `AchievementDetailDialog` | Filter eight criteria-driven badges and inspect progress/detail | Category filter and native dialog/Escape close | Progress derives from local/sample records; unlock IDs are deduplicated and are not official awards |
| `CertificatesPage`, `CertificateDialog` | Browse a shared collection of sample completion previews | Preview selection, native dialog, Escape close | `getCertificateRecords` derives one preview per completed event registration; no credential is issued or verified |
| `NotificationsPage` | Review local reminders, mark read, dismiss, or mark visible items read | Read/dismiss actions | Persists state; preferences filter examples only; no external delivery |
| `SettingsPage` | Adjust weekly activity goal and local reminder preferences; reset demo state | Goal buttons, preference toggles, confirmed reset | Persists only in this browser; no email/push service |
| `DailyStreak` | `StreakPanel` shows current/longest/total days and 3/7/14/30/60/100-day milestones | Explicit qualifying action and milestone feedback | Derived from one qualifying record per local date; opening the dashboard never counts |
| `WeeklyGoal` | Implemented in `WeeklyGoalCard` and `SettingsPage` | Bounded 1–7 day goal adjustments | Derives progress from local entries; user may edit the goal |
| `ActivityHeatmap` | Monthly `ActivityCalendarPanel` with month navigation and selected-day details | Previous/next month, day selection | Action counts derive from local/sample activity-log entries; weekly streak progress derives separately from qualifying records |
| `DiscoverEventsPage`, `EventCard` | Search, filter, sort, display, and bookmark fictional opportunities | Query, filters, saved-only view, bookmark toggles | Derives cards from `eventCatalog`; bookmark IDs persist in shared local state |
| `EventDetailsPage`, `RegistrationDialog` | Explain an event and collect a simulated local registration | Bookmark, eligibility acknowledgement, optional/required team name | Reads static catalog; stores a registration locally and opens its Event Hub |
| `EventHubPage` | Overview, rounds, team, submissions, results, leaderboard, certificate, announcements | Tab selection, local team/submission edits, announcement read state | Joins catalog content with a registration by `eventId`; no organizer service is contacted |
| `MyEventsPage`, `SavedOpportunityCard` | Filter local registrations and separately browse saved events | Status tab, remove bookmark | Reads shared registrations/bookmark IDs; registration is distinct from saved |
| `RegistrationTracker` | Show local demo participation, team, progress, and next deadline | Selected event and local registration | Derived from registration and event catalog; no real registration claim |
| `ProjectWorkspace` | Implemented by `ProjectsPage` and `ProjectDetailPage` | Metadata form, status, milestones, history, remove confirmation | Reads/writes local projects and logs linked event submission actions |
| `StreaksAndAchievements` | Implemented as overview streak panel and `AchievementsPage` | Check-in, derived badge status | Criteria state derives from demo data, not official achievements |
| `CertificatePreview` | Implemented as `CertificateDialog` | Open/close; Escape supported | Non-valid sample; never implies issuance or verification |
| `NotificationCenter` | Implemented as `NotificationsPage` | Read/dismiss; mark visible items read | Local notification state; no push/email service |
| `StudentProfile` | Implemented as `StudentProfilePage` with a public-style local preview | Edit profile, skills, visibility, and save | Persists only non-sensitive fields; visibility controls affect preview only |
| `ActivityFeed` | Overview preview plus dedicated `ActivityPage` | Chronological display, type filter, load more, project/event links | Derives local/sample entries and completed event timeline entries; no community-wide activity is shown |

## Cross-cutting behavior

- Prefer controlled form inputs and explicit validation messages.
- Persist only the local demo state needed for the experience; isolate it behind a small storage/state module.
- Include a visible demo/reset affordance to restore seed state.
- Shared state updates should drive dependent views (for example, bookmarking an event updates both discovery and My Events).
- Use semantic buttons and links, dialog focus management, keyboard support, and accessible status announcements.
- Keep presentation components mostly stateless; place business rules in feature-level helpers/hooks only when the logic is reused or non-trivial.
