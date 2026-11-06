# Phase 8 Bug Report

**Date:** 2026-11-07

## Resolved

| ID | Severity | Finding | Resolution | Verification |
|---|---|---|---|---|
| QA-01 | Low | Event filter labels produced malformed plurals such as “categorys.” | Corrected the label text in the shared filter control. | Verified the all-category label, combined filters, and clear-all behavior. |
| QA-02 | Medium | Closing/cancelling the event registration dialog could leave its React open-state stale; focus was not restored to the trigger. | Close/cancel now update parent state, and focus returns after the dialog is removed. | Reopened, closed, and dispatched a cancel event; state and focus behavior were checked. Physical Escape-key delivery was not conclusively tested in the browser harness. |
| QA-03 | Medium | Reduced-motion rules covered authentication but not all route families. | Applied the preference globally and disabled smooth scrolling. | Checked landing, auth, dashboard, event, and Event Hub motion styles. |
| QA-04 | Medium | Targeted light/dark text and surface combinations had low contrast or inconsistent event surfaces. | Adjusted theme-specific text/surface styles. | Retested 30 selected foreground/background pairs; none were below 4.5:1. This is a sample, not a complete audit. |
| QA-05 | Medium | A very long unbroken student name overflowed the mobile profile preview. | Added word wrapping to the preview heading. | Retested at 375px; the document no longer overflows horizontally. |

## Open / follow-up

| ID | Severity | Finding | Recommended follow-up |
|---|---|---|---|
| QA-06 | Low | Some visible mobile text links/actions have a height below 24 CSS pixels (for example, small landing event links and authentication text links). | Enlarge important non-inline targets and retest tap usability at narrow widths. Inline link exceptions and actual target spacing should be reviewed in context. |

No other reproducible functional defect was identified in the tested scenarios. This does not imply that untested routes, browsers, assistive technologies, or production integrations are defect-free.
