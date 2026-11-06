# GitHub Release Report

**Checked:** 2026-11-07
**Status:** The React prototype and direct-route fix are deployed from `main` to GitHub Pages.

## Repository and deployment

- Repository: [CampusCode-Recreate](https://github.com/ankesh70905/CampusCode-Recreate), default branch `main`.
- Live site: [https://ankesh70905.github.io/CampusCode-Recreate/](https://ankesh70905.github.io/CampusCode-Recreate/).
- The existing repository initially contained a separate vanilla-JavaScript app. After the participant explicitly authorized connecting the React project, PR #1 replaced the published app while preserving its prior Git history.
- GitHub Pages is configured to deploy through the Actions workflow at `.github/workflows/deploy-pages.yml`.
- Deployment run `42293452570` succeeded for merge commit `5e08039cb79949a4331fc81c692a68c54f830493`.
- The React homepage and production JS, CSS, and logo assets were verified over HTTPS. The live application rendered expected content for direct route visits, but GitHub Pages returned HTTP 404 for nested paths.

## Direct-route follow-up

- PR #2 merged the direct-route fix as `9e3366028b6a03c662d36b2dcb8c7e5c82d03eab`.
- The fix adds static `index.html` entries for the app's known routes, retains `404.html` for unknown paths, and normalizes trailing slashes for route-specific document titles.
- Both root and `/CampusCode-Recreate/` production builds passed. The project-base build generated 30 route entries with base-prefixed assets; seven representative routes returned HTTP 200 in the local GitHub Pages-style simulation.
- Deployment run `42294607939` succeeded. Live browser checks visited the home page, overview, login, registration, event discovery, an Event Hub, a project detail, and student profile. Every URL returned HTTP 200 after any directory redirect, rendered the expected title and main content, and loaded the logo. No failed requests, broken images, or page errors were observed.

## Remaining release limits

- Representative screenshots remain pending reliable capture; the inaccurate images previously generated were removed rather than presented.
- Safari and other physical-device/browser testing were not performed.
- The organizers' AI-written-code counting method and disclosure requirements remain unconfirmed. No threshold compliance claim is made; review `docs/AI-ASSISTANCE-LOG.md` before submission.
