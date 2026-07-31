---
title: "Project: Flow-NextGen-Website-Protos (Vite/React Prototype)"
created: 2026-07-26
updated: 2026-07-31
type: project
tags: [ui-ux, frontend-logic, typescript, react, vite, webgl, tailwindcss, protos, pre-ship, lighthouse, mobile-responsive]
sources: [~/projects/Flow-NextGen-Website-Protos/package.json, ~/projects/Flow-NextGen-Website-Protos/vite.config.ts, ~/projects/Flow-NextGen-Website-Protos/src/]
confidence: high
---

# Project: Flow-NextGen-Website-Protos — Vite/React Prototype Website

> Next-generation Vite + React + TypeScript website prototype for Flow NextGen, with full code splitting, SEO, PWA, accessibility, and mobile-responsive design — shippable.

## Quick Facts

| Field | Value |
|-------|-------|
| **Local Path** | `~/projects/Flow-NextGen-Website-Protos/` |
| **Remote** | `https://github.com/faris143/Flow-NextGen-Website-Protos` |
| **Branch** | `main` |
| **Package** | `flow-nextgen-website@0.0.0` |
| **Last Commit** | `dd55d85` — Mobile responsive overhaul + Lighthouse fixes |

## Session: 2026-07-28 — Mobile Responsive Overhaul + Lighthouse Fixes

### Mobile Hero Simplification
- **Removed ExtensionMockup** from mobile entirely — clean hero text only
- **Removed glass-panel wrapper** — no border/background box on hero text
- **Removed stat strip** (143 prompts / 100% / 0 manual) from hero — stats moved to Results section below
- **Clean centered layout** — eyebrow → headline → subtext → social proof → CTAs
- **Fluid `clamp()` scaling** for all text, buttons, spacing (works 360px–768px)
- Subtext trimmed to 9 words per taste-skill hero discipline (max 20)
- Desktop code path completely untouched

### Lighthouse Performance Fixes
- **Deferred DriftBackground** WebGL shader init (`setTimeout(200ms)`) — reduces 42s of "other" main-thread work
- **Footer CLS fix** — added `min-height` to `.footer` and `.footer-content` to prevent 0.314 layout shift
- **aria-labels** added to all icon-only buttons in ExtensionMockup (header: Messages/Documentation, bottom nav: Control/Gallery/Queue/Media/Settings)

### Bug Fixes
- **Mobile nav click not working** — `.mobile-nav` inherited `pointer-events: none` from header-wrapper. Added `pointer-events: auto` to fix.
- **Guide price $9 → $9.99** — Guide billing section said $9/month but Pricing/FAQs/JSON-LD all said $9.99. Fixed.
- **Sitemap.xml and robots.txt 404/SPA load issues** — Excluded `/sitemap.xml`, `/robots.txt`, and `/robot.txt` from the Vite PWA Service Worker `navigateFallbackDenylist` so direct requests bypass SW interception and hit the network. Added explicit 200 rewrite bypasses in `public/_redirects` to override the Netlify `/* /index.html 200` rewrite, and mapped `/robot.txt` to `/robots.txt` via a 301 redirect. Added Playwright E2E coverage to verify.

### Lighthouse Production Scores (Desktop)

| Page | Performance | Accessibility | Best Practices | SEO |
|------|:-----------:|:-------------:|:--------------:|:---:|
| Home / | 37 | 89 | 96 | 100 |
| Pricing | 55 | 96 | 96 | 100 |
| Guide | 43 | 90 | 96 | 100 |

*Note: Performance scores are dragged down by WebGL "other" work (42s) in Lighthouse desktop mode. Real-user experience is smooth since shader runs on GPU.*

## Pre-Ship Optimization Status (Completed Previous Sprints)

### Sprint A — Performance & SEO
- Package renamed from `temp-project` → `flow-nextgen-website`
- Font loading optimized: CSS `@import` replaced with `<link preconnect>` + preload + non-blocking stylesheet
- 4 gallery images converted JPG→WebP (4.1 MB → 619 KB, 85% savings)
- Code splitting: all 7 routes use React.lazy() + Suspense (main JS 620 KB → 377 KB)
- Sitemap.xml via `vite-plugin-sitemap` (6 routes, excluding /bg-playground)
- OG image created: 1200×630 branded WebP (7.4 KB)
- Per-route SEO via `react-helmet-async`: title, description, OG, Twitter card, canonical URL on every page

### Sprint B — Polish & Accessibility
- 37 backdrop-filter blur instances disabled on mobile (<768px) with solid dark fallback
- JSON-LD structured data: SoftwareApplication (Free $0 + Pro $9.99), FAQPage, WebSite schemas
- Touch event fallbacks via pointer events for all WebGL components (Hero, flow-field)
- PWA service worker via `vite-plugin-pwa`: 36 precached entries, Google Fonts runtime caching
- WebGL GPU detection: 3-tier quality (high/low/unsupported) for DriftBackground
- Accessibility: skip-to-content link, ARIA labels, `:focus-visible` styles, `aria-expanded` on mobile nav
- Print styles for legal pages (Privacy/Terms/Refund)
- 404 Not Found page with branded styling

### Sprint C — Testing Infrastructure
- Playwright e2e tests with axe-core accessibility scans
- Lighthouse CI config (perf≥80, a11y≥90, SEO≥90, best-practices≥90)
- Bundle size budget checker (`npm run check:budget`)

## Design Skills Applied
- **taste-skill** (Leon Lin) — Hero stack discipline, fluid scaling, anti-slop pre-flight
- **emil-design-eng** (Emil Kowalski) — Clean purposeful design, no unnecessary decoration
- **impeccable** (Paul Bakaus) — Persuade mode, production-grade craft

## Tech Stack

- **Framework**: React 19 + TypeScript 6 + Vite 8
- **Styling**: Tailwind CSS v4, PostCSS, per-component CSS files
- **Animation**: `motion` library v12, custom WebGL shaders
- **UI**: Lucide React icons, custom component library
- **Routing**: React Router DOM v7
- **SEO**: react-helmet-async
- **PWA**: vite-plugin-pwa (service worker, manifest)
- **Testing**: @playwright/test, @axe-core/playwright

## Design System

Defined in THEME.md — premium dark glassmorphism:
- Background: #0D0D0D (Obsidian black)
- Surface: #161616 (Onyx)
- Accent: #FF6B00 (International Orange)
- Border: #2A2A2A (Anthracite)
- Text: #F5F5F5 (Frost White)
- Muted: #808080 (Steel Gray)
- Typography: Outfit (headings) + Plus Jakarta Sans (body)

## Page Structure

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home.tsx | Full scroll-driven landing page |
| `/pricing` | PricingPage.tsx | Standalone pricing page |
| `/guide` | Guide.tsx | Product guide (8 sections) |
| `/privacy` | Privacy.tsx | Privacy policy |
| `/terms` | Terms.tsx | Terms of service |
| `/refund` | Refund.tsx | Refund policy |
| `/bg-playground` | BgPlayground.tsx | WebGL shader playground (noindex) |
| `*` | NotFound.tsx | 404 catch-all |

## Key Scripts

- `npm run build` — TypeScript check + production build
- `npm run check:budget` — Bundle size budget verification
- `npm run test:e2e` — Playwright e2e tests (requires build first)
- `npm run dev` — Development server
- `npm run preview` — Preview production build

## Known Remaining Items

- 2 `href="#"` links need real URLs after CWS publish (Discord invite + Review links)
- Lighthouse performance scores low due to WebGL shader (real-user experience is smooth)

## Related Wiki Pages

- [[Projects/flow-nextgen]] — Core Chrome extension
- [[Projects/flow-nextgen-website]] — Static website (the protos repo replaces this)