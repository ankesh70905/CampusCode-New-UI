# CampusCode ReBuild '26 — Product Brief

## Product

CampusCode is a frontend-only student innovation platform concept for Round 2 of CampusCode ReBuild '26. It brings event discovery, participation tracking, project work, and student opportunities into one coherent experience.

## Goal

Create a polished, original, desktop-first experience that makes it easy for a student to:

1. Understand what CampusCode offers.
2. Explore hackathons and other opportunities.
3. Create a local demo profile and enter the student dashboard.
4. Track events they have saved or joined, and see their project and learning progress.

The experience is a prototype. It must not imply real accounts, email verification, event registration, certificates, or server-backed activity.

## Audience and context

- Primary user: a student looking for innovation events and a place to organize participation.
- Participation model for the hackathon: individual.
- Students need useful, legible information without fabricated claims about the community or platform.
- Public content, sample profiles, events, and activity must be clearly identified as illustrative mock data.

## Required experiences

- **Landing:** explain the platform, introduce opportunities, describe how it works, and link to account entry points.
- **Login:** demonstrate validated form behavior and a clearly labeled local demo sign-in.
- **Register:** collect demo profile fields, show password strength and age confirmation, and give honest demo verification feedback.
- **Student dashboard:** provide overview, event discovery, My Events, event detail/hub, projects, streaks, achievements, certificates, notifications, and profile.

## Product principles

- **Trust over polish:** label mock content and local-only actions; never suggest backend behavior.
- **Student agency:** prioritize clear next steps and useful controls over gamification pressure.
- **Explainability:** keep the implementation understandable to the participant.
- **Originality:** use references to derive requirements, not to reproduce a layout or template.
- **Accessibility:** keyboard support, readable contrast, reduced-motion support, and semantic forms are baseline requirements.
- **Privacy by default:** use only the demo profile data needed for the prototype; do not collect or transmit it.

## Success criteria

- The four required experiences can be reached through coherent navigation.
- A student can use the dashboard's required areas and understand event state at a glance.
- Key demo state survives a refresh using LocalStorage, with a way to distinguish/reset demo data.
- Every statistic, event, badge, certificate, and feed item is visibly sample content or derived from the current local demo state.
- No claim of production authentication, email delivery, or backend persistence is made.
- The code and design decisions can be explained by the participant and comply with the organizers' current AI-use rules.

## Scope boundaries

### In scope

Responsive presentation with a desktop-first composition, React/Vite frontend, client-side routing, mock data, local demo state, forms with validation, accessible interactions, and the documentation in this Phase 0 package.

### Out of scope

Backend services, real authentication, email verification, real event registration, real student analytics, real certificates, multi-user collaboration, and presentation-round features.

## Decisions still needed

- Official AI-generated-code allowance/threshold and required disclosure wording.
- Official logo source file and usage asset; the three-slash mark must be used unchanged.
- Hackathon-submission constraints and any required browser/device support.
- Participant's consistent team name for tracking (the participation format remains individual).
- Whether the optional animation library is justified after an implementation prototype.
