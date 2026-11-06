# CampusCode ReBuild '26 — User Flow

## Route map

| Route | Audience | Purpose |
|---|---|---|
| `/` | Public | Landing page and entry points |
| `/login` | Returning demo user | Local demo login form |
| `/register` | New demo user | Local demo profile creation |
| `/app` | Demo student | Dashboard overview |
| `/app/events` | Demo student | Discover and filter opportunities |
| `/app/events/:eventId` | Demo student | Event Hub / detail |
| `/app/my-events` | Demo student | Saved and locally joined events |
| `/app/projects` | Demo student | Project workspace |
| `/app/progress` | Demo student | Streak, goals, heatmap, achievements, certificates |
| `/app/notifications` | Demo student | Local notification centre |
| `/app/profile` | Demo student | Profile and skills |

Routes are proposals. Whether to split progress sub-pages or keep them in a single view should be decided after implementation scope is confirmed.

## Primary journeys

### Discover and join the demo

Landing → Featured events or “Explore” → Events → Search/filter → Event Hub → “Join demo” → Explicit local-only confirmation → My Events.

“Join demo” changes only local prototype state. The UI must not imply the organizers or event host received a registration.

### Create a demo profile

Landing → Register → Enter name/email/account type/password/confirmation → Confirm age → Submit → Local validation → Explicit “demo profile saved on this device” feedback → Dashboard.

Any verification screen or status is demonstration-only. No email is sent.

### Return to a demo profile

Landing → Login → Enter email/password → Optional remember-me → Local demo validation → Dashboard.

Explain the demo behavior and provide a non-sensitive demo entry method if needed. Do not store or expose a real password; avoid suggesting password recovery or production authentication exists.

### Organize opportunities

Dashboard → Events → Bookmark event → My Events → Event Hub → Review dates/round progress → Join demo → Tracker updates locally.

Removing a bookmark must not silently erase a separate joined state.

### Review growth and profile

Dashboard → Progress → Review weekly goal/streak/activity/achievement state → Open sample certificate preview → Close → Profile → Edit skills → Save locally.

Avoid pressure-oriented streak language. Give users a neutral explanation that progress is local prototype data.

## Navigation and route behavior

- Public header provides landing, login, and register routes.
- Dashboard navigation consistently exposes overview, events, My Events, projects, progress, notifications, and profile.
- Event detail has a clear return path to discovery and to My Events when relevant.
- Unknown event IDs and unknown routes receive an explicit not-found/empty state, not fabricated content.
- Demo profile state should survive refresh on the same browser when local persistence is enabled; a reset action returns to documented seed data.

## Validation and feedback

- Errors appear beside the relevant field and are announced accessibly.
- Successful local actions receive accurate, specific feedback such as “Saved on this device.”
- Empty collections explain how to populate them and provide a useful route/action.
- Destructive local actions require confirmation when they remove meaningful progress or profile data.
