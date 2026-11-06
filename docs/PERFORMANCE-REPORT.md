# Phase 8 Performance Report

**Date:** 2026-11-07

## Build output

Final local production build (`npm run build`, Vite 6.4.5):

| Asset | Compressed source size | Gzip size |
|---|---:|---:|
| JavaScript bundle | 389.39 kB | 111.20 kB |
| CSS bundle | 135.39 kB | 26.00 kB |
| HTML entry | 1.53 kB | 0.73 kB |
| CampusCode logo | 17.43 kB | Not separately reported |

These are build artifact sizes, not network-transfer measurements under a production CDN.

## Browser timing sample

A prior local production-preview Performance API sample reported approximately 64 ms for FCP and LCP, with CLS 0 after roughly 1.2 seconds. It was a single local/cached browser sample, so it is directional only and must not be presented as a representative field or Lighthouse result.

## Limits and next steps

- No Lighthouse run or repeatable lab profile was completed.
- INP was not measured; no user-interaction timing dataset was collected.
- No physical-device, throttled-network, memory, or long-session profiling was performed.
- Repeat measurements with a documented browser/device/network setup before making performance claims.
