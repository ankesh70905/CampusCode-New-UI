# Phase 8 Security Review and Limitations

**Date:** 2026-11-07
**Scope:** Frontend prototype inspection and dependency advisory scan; not a penetration test.

## Architecture and security boundaries

- The application has no backend. Login, registration, human-check prompts, event registration, reminders, and organizer interactions are local demonstrations, not security controls or live services.
- Profile, participation, and preference data are stored in browser LocalStorage and can be read or changed by the person using that browser. Do not store passwords, access tokens, secrets, or sensitive personal information there.
- Login/register flows were checked to ensure password inputs are not persisted. Registration persists only non-sensitive demo profile fields.
- The simulated human check is not a CAPTCHA, and there is no real identity or email verification, session management, authorization boundary, rate limiting, or server-side validation.
- The tested project-creation flow rejects a `javascript:` URL scheme. This focused check is not a complete URL/output-sanitization review.

## Dependency scan

`npm audit --json` reported **0 known vulnerabilities** across **121 dependencies** at the time of this check. Advisory databases change; this does not establish that the application code is secure or that dependencies have no undisclosed vulnerabilities.

## Not assessed

No backend/API exists to assess for authentication, authorization, injection, CSRF, SSRF, transport, or secret-management flaws. No penetration test, full input-fuzzing review, privacy review, or deployment-configuration audit was performed. Reassess before adding services or handling real student data.

## AI and submission note

This project includes substantial AI-generated implementation. The reported hackathon AI-code threshold and disclosure requirements have not been independently confirmed, and no compliance claim is made. Do not disguise AI assistance; obtain the organizers' counting method and required disclosure before deciding whether the project is eligible for submission.
