# CampusCode

CampusCode is a student innovation platform prototype for discovering hackathons, tracking local participation, and organizing project work. It brings sample opportunities and student workspace tools together in one responsive React experience.

This is a frontend-only prototype. It is not connected to a production service and does not provide real accounts, event registration, organizer communication, or issued credentials.

## Screenshots

Screenshots are not included yet. The available browser capture path did not produce images consistent with the verified viewport dimensions, so inaccurate screenshots were excluded rather than presented as representative desktop/mobile evidence.

## Features

- Editorial landing page with sample opportunities and platform information.
- Demo Login and Register forms with validation and clear simulated-authentication disclosures.
- Student Dashboard with overview, activity, profile, and settings.
- Event discovery with search, filtering, bookmarks, and local registration simulation.
- My Events and a sample Event Hub with rounds, team, submissions, announcements, and results.
- Local project workspace with project details and milestones.
- Daily streaks, weekly goals, and an activity calendar.
- Criteria-based sample achievements and a certificate preview collection.
- Local notification centre.
- Global Light Mode and Dark Mode with saved browser preference.
- Reduced-motion support and responsive desktop/mobile layouts.

## Technology

- React 18 and React DOM
- Vite 6
- React Router 7
- Lucide React
- JavaScript and custom CSS
- Browser LocalStorage for non-sensitive demo state

Fonts use Inter and DM Mono through Google Fonts with system fallbacks. An internet connection may be needed for the hosted font files; the core UI falls back if those requests are unavailable.
The Inter SIL Open Font License notice is retained at [`public/assets/fonts/Inter-OFL.txt`](public/assets/fonts/Inter-OFL.txt).

## Requirements

- Node.js compatible with the installed Vite 6 toolchain
- npm

## Run locally

```sh
git clone https://github.com/ankesh70905/CampusCode-New-UI.git
cd CampusCode-New-UI
npm install
npm run dev
```

Vite prints a local development URL. Stop the server with Ctrl+C.

## Production build

```sh
npm run build
npm run preview
```

The static production output is generated in `dist/`. `npm run preview` serves that output locally for a production-like smoke test.

For GitHub Pages project sites, set `VITE_BASE_PATH` to the repository path, including its leading and trailing slashes. The production build creates static entry files for the app's known routes so direct links load on GitHub Pages; `404.html` remains the fallback for unknown routes.

## Demo limitations

- Login and registration are client-side demonstrations; no credentials are authenticated or sent to a service.
- Event listings and organizer information are fictional sample data.
- Registering for an event only updates LocalStorage on the current browser; it does not contact an organizer.
- Projects, streaks, goals, achievements, notifications, and team/submission examples are local-only and can be edited or cleared by the user.
- Certificates and results are illustrative previews, not issued awards or proof of participation.
- There is no backend, account recovery, email verification, real CAPTCHA, cloud synchronization, or authorization boundary.
- Do not enter real passwords, secrets, or sensitive personal information.

## Links and project status

- GitHub repository: [CampusCode-New-UI](https://github.com/ankesh70905/CampusCode-New-UI) — the React prototype is on the default `main` branch.
- Live demo: [CampusCode on GitHub Pages](https://ankesh70905.github.io/CampusCode-New-UI/).
- Project and release documentation: [`docs/`](docs/), including the [QA results](docs/QA-TEST-RESULTS.md), [architecture](docs/PROJECT-ARCHITECTURE.md), and [AI assistance log](docs/AI-ASSISTANCE-LOG.md).

## AI assistance and submission

AI assistance is recorded in [`docs/AI-ASSISTANCE-LOG.md`](docs/AI-ASSISTANCE-LOG.md). The project includes substantial AI-generated implementation. The reported hackathon limit and disclosure format have not been independently confirmed with organizers; no compliance claim is made. Review the log and confirm the applicable rules before using this prototype for a submission.
