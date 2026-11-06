# CampusCode ReBuild '26 — Design System

## Design concept: Field Notes

Pair an editorial, print-inspired landing experience with a more utilitarian student workspace. Use an off-white canvas, confident type scale, thin rules, precise metadata, and small lime accents. Purple identifies primary actions and active states; black carries the main content. Avoid the familiar copied-dashboard pattern of a permanent left sidebar and a grid of interchangeable cards. Prefer a compact top-level dashboard navigation, varied content widths, and clear editorial section headings.

This visual direction is implemented across the landing, authentication, and student-workspace routes and was refined during Phase 6. The system should continue to evolve through participant review; its implementation does not replace understanding or official policy review.

## Brand constraints

Preserve the supplied official palette:

| Token | Value | Intended use |
|---|---|---|
| Purple | `#7665ff` | Primary actions, active navigation, focus accents |
| Lime | `#a8e62e` | Small emphasis, status highlights, progress details |
| Ink | `#111111` | Primary text and dark surfaces |
| Canvas | `#f7f7f4` | Main page background |
| White | `#ffffff` | Raised surfaces and form fields |

Use the official CampusCode three-slash logo asset without modification. Do not redraw, recolor, distort, or substitute a new mark. The supplied PNG is bundled unchanged at `public/assets/brand/campuscode-logo.png`; `src/assets/brand.js` builds its public URL from Vite's `BASE_URL` so project subpath deployments can use the configured base path.

## Typography

- **Inter:** headings, body copy, navigation, and form labels.
- **DM Mono:** compact technical labels, event metadata, dates, and numeric annotations.
- Use a clear type scale rather than many one-off sizes. Suggested desktop scale: display 64–80px, page heading 40–56px, section heading 28–36px, card heading 18–24px, body 16–18px, supporting 14px, metadata 11–12px.
- Load fonts only through an approved source or bundled assets after licensing and network requirements are confirmed. Keep robust system fallbacks.
- Favor expressive line breaks and weight contrast; do not reduce body text for stylistic effect.

## Layout and spacing

- Desktop-first content width: approximately 1200px, with generous outer margins.
- Use a consistent 4px base spacing unit and a small set of recurring spacing steps (8, 12, 16, 24, 32, 48, 64, 96).
- Landing pages may use asymmetrical columns and full-bleed editorial moments; dashboard content should remain scannable and aligned to a predictable grid.
- Authentication pages should feel distinct through a split editorial/form composition, not by adding ornamental complexity.
- At narrower widths, collapse grids and navigation intentionally; avoid horizontal overflow.

## Surface and component treatment

- Use thin neutral borders, restrained corner radii (roughly 8–14px), and minimal shadows.
- Cards are reserved for bounded, actionable content; vary hierarchy and size rather than repeating identical tiles.
- Buttons have distinct primary, secondary, quiet, and destructive treatments. Include visible hover, focus, active, and disabled states.
- Status must include text or icon as well as color.
- Use Lucide React icons only where they improve recognition; pair unfamiliar icons with labels.

## Data visualization

- Keep axes, labels, time ranges, and units explicit.
- Do not imply real aggregate student data. Activity visuals should be empty, locally derived, or clearly labeled sample data.
- Provide a text equivalent for non-trivial charts and a useful empty state.

## Motion and accessibility

- Motion should communicate hierarchy or state, not decorate every element.
- Use short, restrained entrance transitions, hover elevation, active navigation indicators, progress transitions, and purposeful modal/toast transitions.
- Disable or simplify nonessential movement for `prefers-reduced-motion: reduce`.
- Never make motion the only way to detect a state change; preserve keyboard focus and status announcements.
- Maintain WCAG-conscious contrast, semantic heading order, visible focus, keyboard-operable controls, and appropriately labeled fields.

## Implemented CSS tokens

```css
:root {
  --purple: #7665ff;
  --lime: #a8e62e;
  --lime-dark: #82b91a;
  --ink: #111111;
  --canvas: #f7f7f4;
  --white: #ffffff;
  --line: #deded8;
  --sans: "Inter", Arial, sans-serif;
  --mono: "DM Mono", "Courier New", monospace;
  --radius-control: 4px;
  --radius-card: 8px;
  --motion-fast: 160ms;
  --motion-standard: 220ms;
  --page-width: 1240px;
  --type-display: clamp(4rem, 7.25vw, 6.5rem);
  --type-page-title: clamp(2rem, 4vw, 2.875rem);
  --type-section-title: clamp(1.5rem, 2.7vw, 2rem);
  --type-card-title: 1.125rem;
  --type-body: 1rem;
  --type-supporting: .875rem;
  --type-label: .75rem;
  --type-metadata: .6875rem;
  --type-technical: .625rem;
}
```

The dark theme changes semantic surface, neutral text, border, feedback, and shadow tokens while keeping the official purple and lime values intact. Lavender is used selectively for dark-surface text where the original purple would be too subdued. The `ThemeProvider` persists only the user's theme preference; a first-visit OS preference is applied before the app renders. The stylesheet also defines muted/error/success/purple text colors, card shadow, and easing tokens. Focus uses a visible outline with a canvas-colored separation ring; error and success meanings are paired with text/icons rather than color alone. Token presence is not a formal contrast audit.

Typography role tokens are available for the display, page, section, card, body, supporting, label, metadata, and technical roles. Existing page-specific composition remains intentionally expressive; the shared roles should guide new or materially revised elements rather than flattening every page into identical sizing.

## Phase 6 implementation notes

- Essential form labels, fields, event descriptions, and dashboard/workspace copy received a targeted readability pass; the smallest remaining type is reserved for supplemental metadata and compact data labels.
- Reduced motion disables nonessential animation and forces scroll-reveal content visible. The interface uses CSS rather than a motion dependency.
- The password-strength display exposes a progressbar role and both numeric and text values.
- Achievement and certificate dialogs support keyboard dismissal. A formal color-contrast measurement and a broader assistive-technology audit remain to be done.
