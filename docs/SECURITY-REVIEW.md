# Security review

## Scope and summary

Reviewed the static frontend, its client-side forms, local theme preference, and font loading. No exploitable vulnerability was identified in the reviewed client-side code. The low-severity third-party font privacy finding has been remediated by self-hosting both fonts. No authentication or backend service was provided for review.

## Findings

| # | Severity | File | Lines | Vulnerability | Confidence |
|---|---|---|---|---|---|
| 1 | ⚪ LOW | `index.html`; `login/index.html`; `register/index.html` | 12–15; 9–12; 9–12 (removed) | At the time of the initial review, Google Fonts requests could disclose visitors’ IP addresses and request metadata to Google. The external links were removed and both font families are now served locally. | 9/10 |

## Review notes

- Sign-in, registration, and reset forms are validated locally and do not send or persist the entered personal data.
- The CAPTCHA is client-side demonstration UI, not an authentication or server-side security control.
- The only persisted user setting is the light/dark theme preference.
- Font requests now use same-origin WOFF2 assets; no Google Fonts request is required.
- No server, API, credentials, or authenticated routes were in scope.

## Remediation status

The low-severity privacy finding is resolved. Inter and Plus Jakarta Sans are self-hosted under the SIL Open Font License, and the license notices are included with the public assets. No open findings remain within the reviewed scope.
