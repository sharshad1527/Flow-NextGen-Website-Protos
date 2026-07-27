# Sprint A — Consolidated Execution Plan (Verified)

**Project:** Flow-NextGen-Website-Protos
**Stack verified:** Vite 8.0.16 · React 19.2.6 · TypeScript ~6.0.2 · react-router-dom 7.18.0 · Tailwind v4.3.1 · motion 12.40.0

---

## 🔍 Research Verification Summary

### ✅ Verified — Packages exist at specified versions

| Package | Claimed | Actual | Status |
|---------|---------|--------|--------|
| `react-helmet-async` | ^3.0.0 | 3.0.0 | ✅ |
| `vite-plugin-sitemap` | ^0.8.2 | 0.8.2 | ✅ |
| `rollup-plugin-visualizer` | ^7.0.1 | 7.0.1 | ✅ |
| `vite-plugin-pwa` | ^1.3.0 | 1.3.0 | ✅ |
| `@fontsource/outfit` | (implied) | 5.3.0 | ✅ |
| `@fontsource/plus-jakarta-sans` | (implied) | 5.3.0 | ✅ |
| `@axe-core/react` | (implied) | 4.12.1 | ✅ |
| `focus-trap-react` | (implied) | 12.0.3 | ✅ |

### ❌ Corrections Needed

1. **`react-gtm-hook@^2.0.0` does NOT exist.** Latest version is 0.0.1 (2024) — effectively abandoned. The plan's import of `TagManager` component doesn't match the package's actual API. **Fix:** Skip this package entirely. The plan already recommends Plausible/Umami as the better option for a marketing site (no cookie banner needed).

2. **`vite-plugin-imagemin@0.6.1` last published Jan 2022.** Likely incompatible with Vite 8 (Rollup 4+). This package is optional in the plan and should be **removed** from recommendations. The plan's image optimization strategy (manual WebP conversion + `<picture>` element) works without it.

3. **`cwebp` and `avifenc` not installed on this system.** ImageMagick (`convert`) IS available. Conversion commands need adjustment — use `convert` for WebP or install `webp` and `libavif-bin` first.

4. **All VS Code extension references** (axe Linter, Webhint) are dev-env dependent and correct as suggestions.

### ✅ Pattern Verification (React 19 + TS 6 + Vite 8 + RRD v7)

| Pattern | Status | Notes |
|---------|--------|-------|
| `React.lazy()` + `Suspense` | ✅ | Correct for React 19 |
| `BrowserRouter`, `Routes`, `Route`, `useLocation` | ✅ | Correct for react-router-dom v7 |
| `manualChunks` in Vite config | ✅ | Valid Vite 8 build option |
| `target: "es2022"` | ✅ | Valid for Vite 8 |
| `cssMinify: "lightningcss"` | ✅ | Requires `lightningcss`; valid option |
| `visualizer()` from `rollup-plugin-visualizer` | ✅ | Named export, correct for v7 |
| `import Sitemap from 'vite-plugin-sitemap'` | ✅ | Default export maps to `sitemapPlugin` |
| `HelmetProvider` + `<Helmet>` | ✅ | Correct for react-helmet-async v3 |
| Named export → lazy adapter `.then(m => ({default: m.Home}))` | ✅ | Required — all pages use `export function` (no default export) |

---

## Sprint A — Execution Order

### Dependency graph (what blocks what)

```
Package rename ── (nothing blocked)
     │
Font optimization ── (nothing blocked)
     │
Image optimization ── (nothing blocked)
     │
OG image creation ── (nothing blocked)
     │
     ├──────┐
     ↓      ↓
Code splitting  Sitemap + robots.txt
     │              │
     └──────┬───────┘
            ↓
    react-helmet-async + per-route meta
```

All Sprint A tasks are **independent** except the final `react-helmet-async` task, which should come last because it touches every page file and takes advantage of the lazy-loaded routes already being in place.

---

### Task 1: Package Rename

| Field | Value |
|-------|-------|
| **Risk** | 🟢 LOW |
| **Review needed?** | No |
| **Time** | 2 min |
| **Files** | `package.json` |

**Action:** Change `"name": "temp-project"` → `"flow-nextgen-website"`

Verified: No build-breaking side effects. The `name` field is cosmetic for local dev.

---

### Task 2: Font Optimization (preconnect + preload)

| Field | Value |
|-------|-------|
| **Risk** | 🟢 LOW |
| **Review needed?** | No |
| **Time** | 5 min |
| **Files** | `index.html`, `src/index.css` |

**Actions:**
1. Remove `@import url(...)` line from `src/index.css` (line 1)
2. Add `preconnect`, `preload as="style"`, and `media="print"`/`onload="this.media='all'"` pattern to `index.html <head>` for both Outfit and Plus Jakarta Sans
3. Add `font-display: swap` CSS block in `<style>` tag

**Verified:** The `preconnect` + `preload` + `media="print"` pattern is a well-established Web Font Optimization (Zach Leatherman pattern). All major browsers support it. Correct for 2026.

**⚠️ Alternative (better perf):** Self-host with `@fontsource/outfit` and `@fontsource/plus-jakarta-sans` (both at v5.3.0). This eliminates the Google Fonts round-trip entirely. If the site ships to Cloudflare Pages, a same-origin font request is optimal. Add 5 min for this variant.

---

### Task 3: Image Optimization (WebP + Lazy Loading)

| Field | Value |
|-------|-------|
| **Risk** | 🟢 LOW |
| **Review needed?** | No |
| **Time** | 15 min (manual WebP) or 25 min (manual WebP + `<picture>` elements) |
| **Files** | `public/result_space.jpg`, `public/result_city.jpg`, `public/result_samurai.jpg`, `public/result_anime.jpg`, `public/inextensionss_1.png`–`4.png`, `src/components/ExtensionMockup.tsx`, `src/components/ScrollJourney.tsx` (if `<picture>` used) |

**Actions:**
1. Convert all 4 JPGs to WebP using ImageMagick (since `cwebp` is not installed):
   ```bash
   cd public
   for img in result_space result_city result_samurai result_anime; do
     convert "${img}.jpg" -quality 80 "${img}.webp"
   done
   for img in inextensionss_1 inextensionss_2 inextensionss_3 inextensionss_4; do
     convert "${img}.png" -quality 85 "${img}.webp"
   done
   ```
2. Add `loading="lazy"` and `decoding="async"` to all `<img>` tags in components
3. **Optional (higher savings):** Replace `<img>` with `<picture>` element + WebP source

**Verified:** `convert` (ImageMagick) is installed. Can produce WebP output directly. The `loading="lazy"` attribute is supported in all modern browsers (Chrome 77+, Firefox 75+, Safari 15.4+). Correct for 2026 shipping.

**⚠️ Note:** AVIF conversion (`avifenc`) is skipped — not installed and adds complexity for marginal gain. WebP covers all modern browsers.

---

### Task 4: OG Image Creation

| Field | Value |
|-------|-------|
| **Risk** | 🟢 LOW |
| **Review needed?** | No |
| **Time** | 10 min |
| **Files** | `public/og-default.png`, `public/og-default.webp` (created) |

**Actions:**
1. Generate a 1200×630 px OG image with ImageMagick:
   ```bash
   convert -size 1200x630 \
     -define gradient:direction=south \
     gradient:'#0D0D0D'-'#1A0A00' \
     -font Helvetica-Bold -pointsize 72 \
     -fill white -gravity center \
     -annotate +0-60 'Flow NextGen' \
     -pointsize 36 \
     -fill '#FF9100' -gravity center \
     -annotate +0+40 'Bulk AI Generation for Google Flow' \
     public/og-default.png
   ```
2. Convert to WebP:
   ```bash
   convert public/og-default.png -quality 90 public/og-default.webp
   ```

**Verified:** ImageMagick `convert` is available. Approach is sound. For a more polished image, use Figma/Canva — the ImageMagick approach produces a basic text-on-gradient. The spec (1200×630px, 1.91:1, <300KB) is the universal social card standard.

---

### Task 5: Sitemap + robots.txt

| Field | Value |
|-------|-------|
| **Risk** | 🟢 LOW |
| **Review needed?** | No |
| **Time** | 10 min |
| **Files** | `vite.config.ts` (modify), `public/robots.txt` (create) |

**Actions:**
1. `npm install -D vite-plugin-sitemap` (v0.8.2 confirmed)
2. Add Sitemap plugin to `vite.config.ts` with routes array (6 routes, exclude `/bg-playground`)
3. Create `public/robots.txt` with disallow for `/bg-playground` and sitemap reference

**Verified:** `vite-plugin-sitemap@0.8.2` exports `sitemapPlugin as default`, importable as `import Sitemap from 'vite-plugin-sitemap'`. Compatible with Vite 8 (Rollup 4).

**⚠️ Note:** The plan also sets `generateRobotsTxt: false` and passes a `robots: [...]` array — the `robots` config only applies when `generateRobotsTxt: true`. Since the plan creates `robots.txt` manually anyway, this is harmless but slightly redundant. Recommended: remove the `robots` array or change to `generateRobotsTxt: true`.

---

### Task 6: Code Splitting (Lazy Routes + manualChunks)

| Field | Value |
|-------|-------|
| **Risk** | 🟡 MEDIUM |
| **Review needed?** | ✅ YES — review agent should verify |
| **Time** | 25 min |
| **Files** | `src/App.tsx` (modify — lazy imports + Suspense wrapper), `src/components/PageLoading.tsx` (create), `vite.config.ts` (modify — add manualChunks + visualizer) |

**Actions:**
1. Create `src/components/PageLoading.tsx` — spinner component
2. Rewrite `src/App.tsx`:
   - Replace static page imports with `React.lazy(() => import(...).then(m => ({default: m.ComponentName})))`
   - Wrap `<Routes>` in `<Suspense fallback={<PageLoading />}>`
3. Add `rollup-plugin-visualizer` (v7.0.1 confirmed) to vite config
4. Add `manualChunks` splitting: `vendor-react`, `vendor-motion`, `vendor-lucide`
5. Set `build.target: "es2022"`, `cssMinify: "lightningcss"`, `cssCodeSplit: true`

**Verified library compatibility:**
- `rollup-plugin-visualizer@7.0.1` exports `{ visualizer }` as a named function — correct
- React.lazy() + `.then()` adapter for named exports — correct pattern for React 19
- `Suspense` wrapping entire `<Routes>` block — correct (single loading state)
- `manualChunks` with string arrays — correct for Vite 8's Rollup config

**⚠️ Caution:** The named-export adapter pattern `.then(m => ({ default: m.Home }))` adds ~100 bytes per route but avoids needing to modify page files. Verified all 7 pages use `export function` (no default exports).

---

### Task 7: react-helmet-async + Per-Route Meta Tags

| Field | Value |
|-------|-------|
| **Risk** | 🟡 MEDIUM |
| **Review needed?** | ✅ YES — review agent should verify all pages have correct meta |
| **Time** | 20 min |
| **Files** | `npm install react-helmet-async` (v3.0.0 confirmed), `src/components/SEO.tsx` (create), `src/main.tsx` (modify — wrap with HelmetProvider), `src/pages/Home.tsx` (modify), `src/pages/PricingPage.tsx` (modify), `src/pages/Guide.tsx` (modify), `src/pages/Privacy.tsx` (modify), `src/pages/Terms.tsx` (modify), `src/pages/Refund.tsx` (modify), `src/pages/BgPlayground.tsx` (modify — noindex), `index.html` (modify — strip duplicate OG tags) |

**Actions:**
1. `npm install react-helmet-async` (v3.0.0 confirmed)
2. Create `src/components/SEO.tsx` — reusable component with title, description, OG, Twitter, canonical, noindex support
3. Wrap `<App />` in `<HelmetProvider>` in `src/main.tsx`
4. Add `<SEO>` component to each page with route-specific title/description/ogUrl
5. Add `noIndex` to BgPlayground
6. Strip duplicate OG tags from `index.html` (keep minimal fallback meta)

**Verified:**
- `react-helmet-async@3.0.0` is the correct latest version
- `HelmetProvider` wrapper pattern is correct for v3
- `<Helmet>` component API is unchanged from v2
- The `noIndex` approach for BgPlayground is correct
- **Correction:** Keep at least a basic `<title>` and `<meta name="description">` in `index.html` as fallback for crawlers that don't execute JS (as the plan correctly notes)

---

## Sprint A — Summary Table

| # | Task | Risk | Review? | Time | Blocks | Depends On |
|---|------|------|---------|------|--------|------------|
| 1 | Package rename | 🟢 LOW | No | 2 min | — | — |
| 2 | Font optimization | 🟢 LOW | No | 5 min | — | — |
| 3 | Image optimization (WebP + lazy) | 🟢 LOW | No | 15–25 min | — | — |
| 4 | OG image creation | 🟢 LOW | No | 10 min | — | — |
| 5 | Sitemap + robots.txt | 🟢 LOW | No | 10 min | — | — |
| 6 | Code splitting (lazy routes + chunks) | 🟡 MEDIUM | ✅ Yes | 25 min | Task 7 | — |
| 7 | react-helmet-async + per-route meta | 🟡 MEDIUM | ✅ Yes | 20 min | — | Task 6 (recommended, not required) |

**Total Sprint A time:** ~1.5–2 hours (87–97 min + installs)

---

## ⚠️ Issues Flagged for Adjustment

### Must Fix
1. **`react-gtm-hook@^2.0.0`** — Does not exist. SEO-IMPLEMENTATION-PLAN.md section 9 references a nonexistent package version and a nonexistent `TagManager` export. **Recommendation:** Remove this option entirely. The plan's own recommendation (Umami/Plausible via plausible-tracker) is correct and sufficient for a marketing site.
2. **`vite-plugin-imagemin@0.6.1`** — Last published Jan 2022, likely broken with Vite 8 / Rollup 4. Remove from recommendations. Not needed — the plan's manual WebP conversion is the correct approach.
3. **`cwebp` / `avifenc`** — Not installed. The plan's conversion commands use `cwebp` but only `convert` (ImageMagick) is available. Use `convert` instead, or install `webp` package.

### Should Fix
4. **Sitemap `robots: [...]` config is unused** when `generateRobotsTxt: false`. Either switch to `generateRobotsTxt: true` or drop the `robots` array. The manual `robots.txt` approach is actually preferred (more control) — so just remove the `robots` array from the Sitemap plugin config.
5. **ImageMagick + Helvetica** — The OG Image generation command uses `-font Helvetica-Bold` which may not render on Linux without `msttcorefonts`. Fallback: use `-font DejaVu-Sans-Bold` (bundled with ImageMagick on Linux) for portability.
6. **Bundle analysis** — The plan's chunk size estimates assume the current codebase structure. Verify with visualizer after build rather than relying on estimates.

### Consider for Sprint B (not Sprint A)
- Service worker (`vite-plugin-pwa`) — adds offline support but not critical for initial SEO/performance launch
- JSON-LD structured data — valuable for SEO but not required for Sprint A
- Heading hierarchy fixes (h1 on Home, Pricing) — important for SEO but can be Sprint B or a quick add-on
