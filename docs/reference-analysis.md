# CampusCode reference analysis

Reference inspected: <https://campus-code-ten.vercel.app/>
Inspection date: 2026-11-04

## Scope and access

The reference is an accessible, long-form marketing landing page, not a logged-in dashboard. It has no sidebar. The public routes directly observed are `/`, `/login`, and `/register`. The login page also exposes an inline password-reset state without changing the route. No credentials were supplied, so any authenticated/student dashboard beyond these pages could not be inspected.

The root page contains a complete sequence of sections from the hero through the footer. Its only image-like content is CSS/vector-style decoration and an embedded video; the landing page does not use conventional bitmap `<img>` assets. The embedded film at `/videos/what-is-campuscode.mp4` played in the browser. The form pages expose working client-side controls and validation, but no real account submission was attempted.

## Page structure

Order observed on `/`:

1. **Header** — CampusCode mark, desktop section navigation, Login, Join; responsive menu replaces the main links on smaller screens.
2. **Hero** — location/eyebrow, `CAMPUSCODE / 001`, oversized “BUILD / COMPETE / SHIP.” headline, explanatory copy, Explore Hackathons action, scroll prompt and `01 / 05` progress indicator.
3. **Marquee** — repeated IDEAS, PEOPLE, PRODUCTS, INNOVATION, COMMUNITY words separated by star glyphs.
4. **About / “Where students build”** — section number 01, short description and a central CC tile with three concentric rings and 01–03 markers.
5. **Experience film** — section 02, “BUILD TOGETHER” title, 00:30 duration, large rounded video frame, play/pause control and watch/scroll labels.
6. **How it works** — section 03, “FROM IDEA TO IMPACT”, four numbered cards: Discover, Team Up, Build, Ship.
7. **Enter the arena** — section 04, View All action and three hackathon-topic rows: AI Innovation (LIVE), Future Web (OPEN), Campus Tech (UPCOMING).
8. **Mission statement** — section 05, “GREAT IDEAS NEED BUILDERS.” and supporting copy over oversized, faint CampusCode lettering.
9. **Community/network** — “FIND YOUR PEOPLE.”, CC orbital graphic and three short community statements.
10. **Call to action** — “YOUR NEXT PROJECT STARTS HERE.” with a Join CampusCode action in a circular/grid motif.
11. **Footer** — brand/copy, Product/Builders/Guides link columns, system status, terms/privacy/contact links, oversized wordmark, copyright, motto and Chennai · India.

The homepage has no page-level sidebar, dashboard widgets, or additional content route reached from its visible hackathon list.

## Page geometry

Measurements are CSS pixels from the rendered page. The browser reserves a 15px vertical scrollbar, so the document content width is viewport width minus that scrollbar. No horizontal document overflow was measured at the requested sizes.

| Viewport | Header | Hero | Document height | Responsive observations |
|---|---:|---:|---:|---|
| 1440 × 900 | 88px | 949px | 7167px | Full desktop navigation; broad margins and large type |
| 1366 × 768 | 88px | 924px | 7083px | Full desktop navigation; hero continues below the fold |
| 768 × 1024 | 90px | 850px | 7655px | Login remains visible; section links collapse into hamburger menu |
| 390 × 844 | 80px | 700px | 7341px | Logo, Login and hamburger; stacked content and compact type |

At 1440px, the header uses `25px 72px` padding. Major desktop section heights measured: marquee 56px, About 720px, Experience 1081px, How It Works 660px, Arena 782px, Mission 890px, Community 707px, CTA 700px and footer 624px. At 390px, the step-card grid stacks vertically; About is 911px, How It Works 1405px, Arena 686px, Community 951px, CTA 600px and footer 869px.

Useful desktop section measurements at 1440px:

| Section | Top | Height | Notable layout |
|---|---:|---:|---|
| Hero | 0 | 949 | Full-bleed; headline begins around x=115 |
| Marquee | 949 | 56 | Single repeating horizontal strip |
| About | 1004 | 720 | Copy above/left of orbital artwork |
| Experience | 1724 | 1081 | Centered heading and wide media frame |
| How It Works | 2805 | 660 | Two-column by two-row card grid |
| Arena | 3465 | 782 | Three horizontal rows with separators |
| Mission | 4246 | 890 | Large editorial headline |
| Community | 5137 | 707 | Editorial heading, orbital graphic and copy |
| CTA | 5844 | 700 | Centered text/action in circular motif |
| Footer | 6544 | 624 | Brand, three link groups, status and wordmark |

The hero is intentionally taller than a single viewport at desktop and laptop sizes. Content is revealed by scrolling; it is not a fixed-height dashboard canvas.

## Visual summary

- **Overall look:** restrained editorial/Swiss-tech layout, warm near-white surfaces, black oversized typography, fine gray rules, small lime and purple accents, delicate grid/radial gradients, sparse animation.
- **Typography:** Inter is the primary rendered family; DM Mono is used for navigation, labels and metadata. Space Grotesk is also loaded by the page. Headings are heavy, uppercase, tightly tracked and often combine solid black text with thin outlined words.
- **Graphics:** logo is three slanted black/purple/lime bars beside the wordmark. The hero uses a faint grid, dashed/orbit-like paths and small purple/lime points. About/community use concentric rings and an outlined CC tile. These graphics are not photographic.
- **Shape language:** most sections and cards are square-cornered with fine rules. The media player is notably rounded (about 22px at desktop); its inset student tile is also rounded. Standard outlined buttons remain nearly square.
- **Images:** no regular raster images were found in the landing page. The experience video is real media and should be treated as a required asset, not replaced by a generic image.

Detailed measured tokens and dimensions are in [design-system.md](./design-system.md); individual regions are in [component-inventory.md](./component-inventory.md).

## Navigation and route observations

- Desktop header section controls scroll within the landing page without changing the URL or adding a hash.
- On the small-screen layout, Toggle menu opens a white panel with About, How It Works, Hackathons, Community and Join CampusCode. Choosing About closed the menu and scrolled to that section. The toggle changes from a hamburger to an X while open.
- Login opens `/login`; Join CampusCode opens `/register`.
- Explore Hackathons and View All both scroll within the landing page; View All does not open a separate catalog route.
- The footer's About, Hackathons, How it works and Community anchors resolve to existing sections. The other footer targets (student, teams, organizers, developers, rules, FAQ, support, contact, terms and privacy) have no matching element IDs in the observed page.
- Topic rows and How It Works cards are semantic-looking content blocks, but the topic rows have no link/button, keyboard target or navigation effect. They are informational, not actionable cards.

The full visible control inventory and observed outcomes are in [interaction-map.md](./interaction-map.md).

## Screenshot references

The integrated browser returned inline captures during this phase. They are visible in the Phase 1 conversation, but the browser tool did not expose a reusable local image path; no fabricated screenshot files were added to the project.

| Reference capture | View or region |
|---|---|
| Landing desktop | 1440 × 900, initial hero |
| Landing laptop | 1366 × 768, initial hero |
| Landing tablet | 768 × 1024, initial hero |
| Landing mobile | 390 × 844, initial hero |
| Mobile menu | 390 × 844, navigation panel open |
| About | Full About section capture |
| Experience | Full video/experience section capture |
| How It Works | Full four-step grid capture |
| Arena | Full three-row category capture |
| Mission | Full mission statement capture |
| Community | Full community/orbit capture |
| CTA | Full CTA capture |
| Footer | Full footer capture |
| Registration | 390 × 844 view of the registration form |

## Existing workspace and implementation proposal

At the time of Phase 1 inspection, the workspace was a very small, non-Git starter: `index.html` contained an unrelated student-table exercise, `style.css` was empty, and `python.py` plus `BMW M5 Competition.jpeg` did not appear related to this reference. There was no package manifest or existing frontend build/test setup. Phase 2 has since replaced the HTML entry with the Vite shell and added the project configuration.

**Phase 2/3 implementation:**

- A static semantic HTML/CSS/JavaScript site is built with Vite for local development and production bundling. It remains publishable to GitHub Pages or Vercel without a runtime server.
- Route-level page modules implement the landing page and public auth pages; shared components, responsive styles, and interactions live in dedicated folders.
- Design tokens and accessibility defaults are in place, and the GitHub Pages base path is configurable through `VITE_BASE_PATH`.
- Use the exact film only if the project owner has rights to use it or supplies it. Do not scrape or redistribute unlicensed media. The reference does not supply an inspectable user dashboard or backend contract; real authentication/registration cannot be made functional without owner-provided API/service details. Client-side-only validation must not imply that an account was created.
- Before implementation, agree how to handle the reference's footer links whose target sections/pages are missing, so the recreation does not invent unsupported destinations.

See [architecture.md](./architecture.md) for the project structure and deployment details.
