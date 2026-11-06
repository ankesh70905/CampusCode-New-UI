# CampusCode ReBuild '26 — Implementation Roadmap

This roadmap records the project phases and current implementation state. See `PROJECT-STATUS.md` for delivered work and verification details.

## Phase 0 — Foundation (completed)

- Establish product brief, design system, component inventory, user flows, feature priorities, architecture, roadmap, and AI assistance log.
- Record open decisions explicitly.
- No application pages, dependency installation, or implementation in this phase.

**Exit:** participant reviews and can explain the plan; official AI policy/threshold and required assets are checked before code-generation decisions.

## Phase 1 — Setup and design validation

- Confirm scope, official logo asset, team-name tracking convention, target browser, and AI policy.
- Scaffold the smallest React/Vite app and install only approved, needed dependencies.
- Establish routes, global tokens, font strategy, responsive grid, focus styles, and reduced-motion defaults.
- Validate the editorial landing and dashboard visual direction with small, participant-reviewed wireframes/prototypes.

**Exit:** routes load, baseline visual system is reviewed, and no template has been adopted as-is.

## Phase 2 — Required journeys

- Implement landing, login, register, dashboard overview, Events, My Events, and Event Hub.
- Use clearly labeled, restrained mock data and local-only feedback.
- Make search/filter, bookmark, and demo join state coherent across views.
- Add field validation and accessible feedback.

**Exit:** core discover-and-track journey works after refresh, and demo limitations are explicit.

## Phase 3 — Student dashboard foundation and tools (complete)

- Establish mock dashboard records, versioned local state, safe profile adaptation, derived metrics, and local-calendar streak rules.
- Build the dashboard shell and overview, then add profile/skills, notifications/reminders, weekly goal, and qualifying streak actions in reviewable slices.
- Add activity calendar, achievement criteria, certificate preview, and feed only if they can use transparent and explainable data.
- Add selective animation after functionality and reduced-motion behavior are verified.

**Exit:** no visual suggests real analytics, issued certificates, or server-side activity.

## Phase 4 — Events ecosystem (implemented)

- Implement Discover Events, My Events, and Event Hub using the existing illustrative event data and dashboard state.
- Add working search, filters, bookmarks, local demo registration tracking, and event round progress.
- Keep sample listings and simulated participation clearly distinct from real events or registrations.
- Migrate legacy dashboard state without retaining duplicate event summaries.

**Checks completed:** production build and dependency audit; version-1 migration and reload; core search/filter, bookmark-to-My Events, registration validation, Event Hub, and persistence interactions; responsive overflow checks for Discover, detail, My Events, and Event Hub at all seven requested viewport sizes.

## Phase 5 — Student growth ecosystem and quality checks (implemented)

- Expand the versioned dashboard model with streak milestones, monthly activity, project milestones/history, criteria-driven achievements, certificate collection, action-derived feed, and profile visibility.
- Integrate the growth features into the dashboard and preserve explicit local/sample-data disclosures.
- Run production build, focused model/migration checks, feature interactions, reduced-motion check, and responsive route overflow regression checks.
- Record AI-generated work and remaining policy questions accurately in the assistance log.

**Exit:** implementation and the documented functional/responsive checks pass. A formal contrast audit, broader assistive-technology review, participant understanding review, and organizer AI-policy confirmation remain outstanding.

## Phase 6 — Visual polish and accessibility refinement (implemented)

- Refine shared typography, focus treatment, surface tokens, and responsive readability without redesigning completed pages.
- Review animation use and reduced-motion behavior; keep motion purposeful and remove unnecessary looping decoration.
- Verify key keyboard interactions, form feedback, dialog dismissal, event search, and registration strength semantics.
- Review callback/context stability and run focused cross-route checks at the seven requested viewport sizes.
- Update the design-system, architecture, status, and AI-assistance records with actual changes and remaining gaps.

**Exit:** production build and targeted route, responsive, motion-preference, and interaction checks pass. Formal contrast measurement and a broader assistive-technology audit remain outstanding.

## Phase 7 — Global themes, typography, and consistency (implemented)

- Added a persistent, accessible light/dark theme shared across public, auth, dashboard, event, and workspace routes.
- Established reusable typography roles while preserving intentional page-specific display composition.
- Replaced inaccurate planned/not-yet-built copy and removed only verified dead code.
- Documented theme behavior, remaining checks, and AI assistance accurately.
- Verified the production build, theme persistence, key route surfaces, keyboard access, and responsive layouts.

**Checks completed:** both themes passed the 182-case route/viewport sweep; preference initialization, persistence, cross-tab updates, storage-failure feedback, keyboard focus, mobile navigation, and reduced-motion behavior were checked. Formal contrast measurement and a broader assistive-technology audit remain outstanding.

## Phase 8 — Comprehensive QA and submission preparation (not started)

- Perform the participant-led final review, confirm the official AI policy and disclosure requirements, and assess the actual implementation against them.
- Verify run/build instructions, supported browsers, complete journeys, and approved submission materials.
- Remove only confirmed development-only clutter; preserve truthful prototype and sample-data disclosures.
- Submit only after the participant confirms readiness and official compliance requirements are understood.

**Start condition:** begin only after Phase 7 is reviewed and the participant explicitly requests submission preparation.

## Gate: AI policy clarification

The project brief references an organizer-defined AI code threshold but does not state its value or measurement method. Do not assume a threshold. Before any submission preparation, obtain the current official rule and disclosure requirements. If generated code would exceed the allowed limit, pause and revise through genuine participant implementation; never disguise authorship or optimize for detector evasion.
