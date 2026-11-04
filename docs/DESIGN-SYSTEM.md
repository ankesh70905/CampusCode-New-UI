# CampusCode design system

Phase 4 visual direction: **signal in the arena**. Deep mineral navy, cool paper neutrals and a sea-glass teal accent give the product a distinct identity without changing its public information architecture.

## Typography

| Role | Family | Weights | Use |
|---|---|---:|---|
| Display | Plus Jakarta Sans | 500–800 | Hero and section headings, brand wordmark, card titles |
| Interface | Inter | 400–800 | Body copy, navigation, controls, labels, form content |

Inter and Plus Jakarta Sans are self-hosted as variable WOFF2 assets in `src/assets/fonts/`; their SIL Open Font License notices ship in `public/assets/fonts/`. This avoids third-party font requests while preserving system fallbacks. Inter uses tabular numerals for aligned numbers. Small labels use Inter with uppercase text and controlled tracking; no separate mono font is needed.

## Color tokens

### Light theme

| Token | Value | Use |
|---|---|---|
| `--color-background` | `#f3f6f7` | Page canvas |
| `--color-surface` | `#ffffff` | Cards and form surfaces |
| `--color-surface-soft` | `#eaf0f1` | Secondary bands and media backdrop |
| `--color-surface-about` | `#f8faf9` | Quiet content panels |
| `--color-surface-footer` | `#10232e` | Footer |
| `--color-hero` | `#102a36` | Primary dark brand field |
| `--color-text` | `#132b36` | Primary text |
| `--color-text-soft` | `#435b64` | Secondary text |
| `--color-text-muted` | `#5f7279` | Tertiary labels |
| `--color-border` | `#dce5e7` | Rules and controls |
| `--color-primary` | `#176f68` | Actions, links, focus accents |
| `--color-accent` | `#45d6bd` | Brand highlight and active states |
| `--color-accent-secondary` | `#9cafff` | Secondary highlight |
| `--color-accent-warm` | `#f0a27c` | Restrained supporting highlight |

### Dark theme

| Token | Value | Use |
|---|---|---|
| `--color-background` | `#0a171e` | Page canvas |
| `--color-surface` | `#10232d` | Cards and controls |
| `--color-surface-soft` | `#10232d` | Secondary surfaces |
| `--color-surface-about` | `#0d1d25` | Quiet content panels |
| `--color-surface-footer` | `#08141a` | Footer |
| `--color-hero` | `#08191f` | Primary dark brand field |
| `--color-text` | `#edf5f5` | Primary text |
| `--color-text-soft` | `#c0d0d2` | Secondary text |
| `--color-text-muted` | `#91a5a9` | Tertiary labels |
| `--color-border` | `#29414a` | Rules and controls |
| `--color-primary` | `#56d9c3` | Actions, links, focus accents |
| `--color-accent` | `#56d9c3` | Brand highlight and active states |
| `--color-accent-secondary` | `#b0bdff` | Secondary highlight |
| `--color-accent-warm` | `#ffb08a` | Restrained supporting highlight |

The themes are separately tuned rather than inverted. Status colors and focus rings use semantic tokens (`--color-success`, `--color-warning`, `--color-error`, `--color-focus`). Theme preference is stored as `campuscode-theme` and falls back to the operating-system preference until the user chooses a theme.

## Type scale

The primary sizes are 11px micro-label, 14px small text, 16px body, 23px card title, and responsive display sizes defined in `src/styles/tokens.css`. Use 400–500 for body text, 600–700 for interface emphasis, and 700–800 for display type. Headings have close tracking and compact line height; body copy remains at least 1.55 line-height.

## Spacing and shape

The spacing scale is 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 and 112px. Page gutters and section spacing use responsive `clamp()` values. Standard control radius is 11px; content cards use 18px; large feature surfaces use 26px. Avoid applying the largest radius to small controls.

## Elevation

- `--shadow-card`: low-contrast separation for interactive content.
- `--shadow-card-hover`: modest hover lift, paired with a 4px transform.
- `--shadow-auth`: deeper elevation for the primary auth surface.
- Menus use `--shadow-menu`; borders remain visible in both themes.

## Motion

| Motion | Duration | Easing | Application |
|---|---:|---|---|
| Fast control feedback | 160ms | `cubic-bezier(0.2, 0.65, 0.3, 1)` | Buttons, links, toggles |
| Standard interaction | 240ms | Same standard curve | Theme and surface transitions |
| Entrance/reveal | 540–620ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Section reveal and page entrance |
| Route transition | 360ms | Emphasized curve | View Transitions-capable browsers |

`src/scripts/motion.js` applies one-time, viewport-triggered reveals to major content groups. CSS handles control feedback and the landing headline. “BUILD / COMPETE / SHIP” uses restrained text extrusion and a 760ms 3D entrance, staggered by 90ms per line; it settles immediately into the same static depth when reduced motion is requested. The reveal script leaves content visible when reduced motion is requested or IntersectionObserver is unavailable.

## Component rules

- **Navigation:** transparent over the dark hero, with a low-key animated underline; mobile uses a rounded menu panel. The theme control is available in desktop and mobile headers.
- **Buttons:** clear text labels, 11px radius, visible focus, and subtle pressed/hover feedback. Primary actions use the teal token.
- **Content cards:** 1px semantic border, surface fill, 18px radius, and modest shadow. Informational cards do not imply clickability through hover motion.
- **Forms:** 11px radius, clear labels, semantic focus ring, and validation status colors. Theme changes apply to inputs, CAPTCHA, feedback, and surrounding cards.
- **Status:** pair color with readable text, never color alone.
- **Illustration:** use the existing CSS orbit artwork sparingly with teal, periwinkle, and warm accent details.

## Scope note

The publicly inspected project has a landing experience and login/registration flows; no logged-in dashboard, charts, notification center, sidebar, settings screen, dropdown, or data source was accessible. This redesign preserves the implemented public flows and does not fabricate dashboard data or interactions. Add dashboard-specific components only when a real product specification or authorized reference is available.
