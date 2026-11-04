# Performance report

## Production build

Measured with the Vite production build (`npm run build`):

| Output | Raw size | Gzip size |
|---|---:|---:|
| Shared CSS | 60.95 kB | 11.98 kB |
| Shared JavaScript | 27.21 kB | 8.12 kB |
| CSS + JavaScript | 88.16 kB | 20.10 kB |
| Inter variable WOFF2 | 48.25 kB | Not reported by Vite |
| Plus Jakarta Sans variable WOFF2 | 27.34 kB | Not reported by Vite |
| Both font files | 75.59 kB | Not reported by Vite |
| HTML entry pages | 1.01–1.07 kB each | 0.53–0.56 kB each |

The build completed successfully and transformed 23 modules. The app uses native JavaScript modules; Vite is the only declared development dependency.

## Implementation notes

- The hero and preview motion use CSS; no animation library or video download is required.
- Motion is limited to transforms, opacity, and short transitions, with a reduced-motion path.
- The project has no application API calls or third-party runtime libraries.
- Inter and Plus Jakarta Sans are self-hosted as variable WOFF2 assets with system-font fallbacks and SIL Open Font License notices. Font requests stay same-origin; font transfer timing was not profiled.

## Measurement limits

No Lighthouse score, Core Web Vitals, network waterfall, CPU profile, or real-device performance measurement was collected. Bundle sizes above are build output measurements only and should not be read as a Lighthouse result.
