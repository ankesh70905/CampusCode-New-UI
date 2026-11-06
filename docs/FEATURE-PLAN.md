# CampusCode ReBuild '26 — Feature Plan

Priorities are proposed for a frontend-only hackathon prototype. “P0” means required to demonstrate the core experience, not a claim about a backend service.

## P0 — Core journeys

| Feature | Scope | Acceptance notes |
|---|---|---|
| Landing | Editorial introduction, platform explanation, featured mock events, how it works, opportunities, join/login links, footer | No invented community metrics or unsupported claims |
| Login and register | Required fields, validation, password visibility, remember-me demo control, strength feedback, age confirmation, navigation | All feedback identifies local demo behavior; no real authentication/verification |
| Dashboard shell | Implemented overview and navigation across dashboard and event routes | Desktop-first; local-data disclosure, reset path, and route-specific empty states |
| Discover Events | Implemented search, combined filters, sorting, bookmarks, event details, and demo registration | Fictional listings; filters use catalog fields and registration status |
| My Events | Implemented registration tracker and independent saved/bookmarked view | Shared versioned local state; saved and registered remain distinct |
| Local demo persistence | Small, versioned LocalStorage state with safe initialization and reset | No credentials stored; reset restores documented demo seed |

## Phase 3 — Dashboard foundation and local workspace (complete)

| Feature | State | Notes |
|---|---|---|
| Dashboard seed records | Implemented | Project/activity/notification seed records are illustrative and isolated in `src/data/dashboardMockData.js`; fictional events are in `src/data/eventsMockData.js`. |
| Versioned local dashboard state | Implemented | Reads the existing registration profile and migrates v1 state to v2; malformed or unsupported stored state throws an explicit error; shell surfaces recovery/reset controls. |
| Streak date rules | Implemented | Local calendar date captured at qualifying action time; one qualifying activity per day; open/refresh does not count. Timezone assumption documented in architecture. |
| Derived dashboard metrics | Implemented | Participation and certificate views derive from event registration records; project and example achievement state derive from workspace/demo records; weekly activity derives from qualifying local records. |
| Dashboard shell and overview | Implemented | Nested navigation, local-data disclosure, responsive overview, derived summary/activity, deadlines/feed examples, and qualifying learning-session action. |
| Profile and skills | Implemented | Non-sensitive fields and skill list save locally; email is displayed as an unverified demo profile value. |
| Project workspace | Implemented | Create/edit/remove sample and locally added projects; save is a qualifying activity at most once per local date. |
| Activity calendar and weekly goal | Implemented | Calendar displays only recorded local qualifying activity; weekly goal is adjustable from 1 to 7 days. |
| Notifications and preferences | Implemented | Local read/dismiss actions and reminder filters; no email or push delivery. |
| Achievements and certificates | Implemented | Badges derive from illustrative records; certificate preview is clearly marked sample and invalid. |
| Events ecosystem | Implemented in Phase 4 | Discover, details, local registration, bookmarks, My Events, rounds, team, submissions, sample results, certificate preview, and announcements; all participation and content are explicitly demo-only. |

## Phase 5 — Student growth ecosystem (implemented)

| Feature | State | Notes |
|---|---|---|
| Streak milestones | Implemented | Current and longest streaks plus total active days; 3/7/14/30/60/100-day records derive from deliberately recorded local activity. |
| Monthly activity calendar | Implemented | Month navigation, per-day action counts and selected-day details; data comes from the local/sample activity log and is labeled accordingly. |
| Project workspace | Expanded | Metadata, optional registered-event link, seven milestones, project history/detail route, status, and event-submission activity. No shared editor or remote publishing. |
| Achievements | Expanded | Eight visible criteria, progress, category filters, details, and deduplicated local unlock records. These are demo badges, not official awards. |
| Certificate collection | Implemented | Deduplicated preview records derive from completed sample/local registrations; no certificate is issued or verified. |
| Activity feed | Implemented | Chronological local/sample actions, event timeline entries, type filtering, and project/event links. |
| Profile preview | Implemented | Local visibility choices and growth summary preview; profile is not published or shared. |
| Dashboard growth snapshot | Implemented | Connects active projects, recent achievements, certificate previews, activity, and calendar without inventing user totals. |

## P1 — High-value student workflow

| Feature | Scope | Acceptance notes |
|---|---|---|
| Registration tracker | Implemented | Local demo registration, dates, status, team, and round progress; no real registration claim |
| Project workspace | Implemented in Phase 5 | Rich local project metadata and milestones; sample records remain labeled and real collaboration is out of scope |
| Profile and skills | Edit local profile details and skills | Stored only on this device; minimal personal data |
| Notifications and deadlines | Local reminders based on mock events and local settings | No email, push, or external delivery implied |
| Weekly activity goal | User-adjustable local goal and progress | Define what counts; no pressure or fabricated totals |
| Streaks | Implemented in Phase 5 | Deliberate local actions only; one streak record per device-local day and no inferred history |

## P2 — Polish after core validation

| Feature | Scope | Acceptance notes |
|---|---|---|
| Activity calendar | Implemented in Phase 5 | Navigable monthly calendar, day details, and activity source disclosure |
| Achievements | Implemented in Phase 5 | Criteria-based progress and unlock dates; sample unlocks are labeled |
| Certificate preview | Implemented in Phase 5 | Shared, deduplicated source of non-valid sample previews |
| Activity feed | Implemented in Phase 5 | Local/sample actions only; no platform-wide or community activity is represented |
| Motion polish | Selected transitions and progress feedback | Reduced-motion support; retain functionality without motion |

## Deferred / out of scope

- Server/API, real login, email verification or password reset.
- Real event registration, organizer workflows, or event data ingestion.
- Real analytics, community statistics, public rankings, or real certificates.
- Multi-user collaboration, payments, chat, or a presentation round.
- Additional dependencies unless a proven requirement justifies them.

## Data and persistence rules

- Keep mock event records in a dedicated data module with stable IDs and clearly fictional/sample titles and descriptions.
- Give each event only the fields needed for display and filtering (for example title, organizer label, format, dates, tags, description, round labels, and deadline).
- Model user-controlled state separately: profile, bookmarks, local participation, project notes, goals, check-ins, notification preferences, and dismissed items.
- Store no password. Never represent a local demo action as a request delivered to a server.
- Make seeded sample entries visibly labeled. Derive counts and visualizations from the displayed local records.
- Include schema/version handling and reset behavior; surface storage failures instead of silently showing success.
