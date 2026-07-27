# Performance Optimization Plan — Flow NextGen Website

**Context:** Vite 8.0.16 / React 19.2 / TypeScript 6.0 / Tailwind v4 / Cloudflare Pages
**Current baseline:** JS 620 KB (184 KB gzip), CSS 75 KB (14.6 KB gzip), 2204 modules, zero code splitting
**Target:** Largest bundle < 250 KB gzip, First Contentful Paint < 1.5s, Lighthouse Performance > 90

---

## 1. Code Splitting — React.lazy() + Suspense for Every Route

### 1.1 Install the loading fallback component

Create `src/components/PageLoading.tsx`:

```tsx
// src/components/PageLoading.tsx
export function PageLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "4rem 2rem",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "2px solid rgba(255,255,255,0.1)",
          borderTopColor: "#FF6B00",
          borderRadius: "50%",
          animation: "page-load-spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes page-load-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
```

### 1.2 Rewrite `src/App.tsx` with lazy imports

Replace static imports with `React.lazy()`:

```tsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DriftBackground } from "./components/DriftBackground";
import { ScrollToTop } from "./components/ScrollToTop";
import { PageLoading } from "./components/PageLoading";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const BgPlayground = lazy(() => import("./pages/BgPlayground"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const Guide = lazy(() => import("./pages/Guide"));

function AppContent() {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== "/bg-playground";

  return (
    <>
      {/* Cinematic page-load reveal — unchanged */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 99999,
          pointerEvents: "none",
        }}
      />

      {showHeaderFooter && <DriftBackground />}

      <div style={{ position: "relative", zIndex: 1 }}>
        {showHeaderFooter && <Header />}
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/bg-playground" element={<BgPlayground />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </Suspense>
        {showHeaderFooter && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
```

**Key detail:** `Suspense` wraps the *entire* `<Routes>` block (not individual `<Route>` elements) — this gives a single loading state while the first page chunk loads, and subsequent navigations load their chunk silently with no flash.

### 1.3 Expected chunk breakdown after splitting

| Chunk | Before | After (estimated) | gzip |
|-------|--------|-------------------|------|
| `vendor.js` (react, react-dom, react-router-dom, motion) | — | ~160 KB | ~48 KB |
| `vendor-lucide.js` (lucide-react) | — | ~60 KB | ~16 KB |
| `main.js` (App, Header, Footer, DriftBackground, CSS) | 620 KB | ~60 KB | ~16 KB |
| `Home.js` (ScrollJourney, Features, HowItWorks, Faq) | in main | ~50 KB | ~12 KB |
| `BgPlayground.js` (3646 lines) | in main | ~80 KB | ~24 KB |
| `Guide.js` (680 lines) | in main | ~25 KB | ~7 KB |
| `PricingPage.js` | in main | ~5 KB | ~1.5 KB |
| `Privacy.js` | in main | ~10 KB | ~3 KB |
| `Terms.js` | in main | ~10 KB | ~3 KB |
| `Refund.js` | in main | ~6 KB | ~2 KB |

**Result:** Initial load drops from 620 KB → ~280 KB JS (86 KB gzip).

### 1.4 Named export -> default export adapter

`React.lazy()` expects **default exports** from the page modules. The current pages use **named exports** (`export function Home()`). You need a re-export barrel for each:

Create `src/pages/lazy.ts`:

```tsx
// Instead of modifying every page file, create a lazy-loader barrel per page.

// Option A — one-shot wrapper (works without touching page files):
export { Home as default } from "./Home";
export { PricingPage as default } from "./PricingPage";
export { BgPlayground as default } from "./BgPlayground";
export { Privacy as default } from "./Privacy";
export { Terms as default } from "./Terms";
export { Refund as default } from "./Refund";
export { Guide as default } from "./Guide";
```

Then update the `lazy()` calls in App.tsx:

```tsx
const Home = lazy(() => import("./pages/lazy").then(m => ({ default: m.Home })));
// Or simpler:
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
```

The `.then(m => ({ default: m.Home }))` adapter is the simplest pattern — no new files needed.

---

## 2. Bundle Analysis Tools

### 2.1 Install

```bash
npm i -D rollup-plugin-visualizer@^7.0.1
```

### 2.2 Add to vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/stats.html",
      open: false,        // set true to auto-open in browser
      gzipSize: true,
      brotliSize: true,
      template: "treemap", // sunburst | treemap | network
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

After build, open `dist/stats.html` in a browser to see the treemap of every module.

### 2.3 Alternative: vite-bundle-analyzer

```bash
npm i -D vite-bundle-analyzer
```

```ts
// vite.config.ts
import { bundleAnalyzer } from "vite-bundle-analyzer";

export default defineConfig({
  plugins: [
    react(),
    bundleAnalyzer(),
  ],
});
```

Run `npx vite-bundle-analyzer` after build for a CLI table view.

---

## 3. Vite Config Tuning — manualChunks, CSS, Build Target

### 3.1 Full optimized vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/stats.html",
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2022",       // Cloudflare Pages supports it; smaller output than esnext
    cssMinify: "lightningcss",
    cssCodeSplit: true,      // split CSS per entry even without code-split JS
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["motion"],
          "vendor-lucide": ["lucide-react"],
        },
      },
    },
  },
});
```

**Why these chunks:**
- `vendor-react`: The React + router core — heavily cached, rarely changes.
- `vendor-motion`: `motion` v12 is ~80 KB; splitting it keeps React chunk smaller.
- `vendor-lucide`: `lucide-react` adds ~60 KB; separate from main app code.

### 3.2 CSS Code Splitting behavior

With `cssCodeSplit: true` and route-level lazy loading, Vite automatically extracts CSS from each lazy chunk into its own `<link rel="stylesheet">` tag. The initial CSS is still the critical path, but route-specific CSS (e.g. `BgPlayground.css` with 10 backdrop-filter rules) only loads when that route is navigated to.

### 3.3 Bundle size budget — rollupOptions warnings

Add to `build.rollupOptions`:

```ts
build: {
  rollupOptions: {
    output: {
      // ... manualChunks ...
      chunkFileNames: "assets/[name]-[hash].js",
      entryFileNames: "assets/[name]-[hash].js",
    },
    // Bundle size budget warnings
    onwarn(warning, warn) {
      if (
        warning.code === "EMPTY_BUNDLE" ||
        warning.code === "MODULE_LEVEL_DIRECTIVE"
      ) {
        return; // ignore noise
      }
      warn(warning);
    },
  },
}
```

Vite doesn't have a native `maxChunkSize` like webpack, but you can add a post-build check (see section 10).

---

## 4. Image Optimization — JPG → WebP/AVIF + lazy loading + srcset

### 4.1 Convert images with cwebp (WebP) and avifenc (AVIF)

```bash
# Install tools
sudo apt-get install -y webp libavif-bin 2>/dev/null || brew install webp libavif

# Convert ALL 4 gallery JPGs to WebP (lossy, quality 80)
cd /home/haiva/projects/Flow-NextGen-Website-Protos/public

for img in result_space result_city result_samurai result_anime; do
  cwebp -q 80 "${img}.jpg" -o "${img}.webp"
done

# Also convert to AVIF (better compression, slower encode)
for img in result_space result_city result_samurai result_anime; do
  avifenc -s 8 -a end-usage=q -a cq-level=30 "${img}.jpg" -o "${img}.avif"
done

# Convert the PNG screenshots too (already smaller, but WebP still helps)
for img in inextensionss_1 inextensionss_2 inextensionss_3 inextensionss_4; do
  cwebp -q 85 "${img}.png" -o "${img}.webp"
done
```

**Expected reductions:**

| Image | JPG size | WebP (q80) | AVIF (cq30) |
|-------|----------|-----------|-------------|
| result_space.jpg | 888 KB | ~280 KB | ~200 KB |
| result_city.jpg | 1,017 KB | ~320 KB | ~230 KB |
| result_samurai.jpg | 1,100 KB | ~350 KB | ~250 KB |
| result_anime.jpg | 1,100 KB | ~350 KB | ~250 KB |
| **Total** | **4.1 MB** | **~1.3 MB** | **~930 KB** |

### 4.2 Add `<picture>` with srcset in components

Replace the current `<img>` tags in `ExtensionMockup.tsx` (lines 585, 600, 612, 625) and `ScrollJourney.tsx` (lines 699-702):

**Current (ExtensionMockup.tsx):**
```tsx
<img src="/result_samurai.jpg" alt="Samurai Mockup" className="gallery-img" />
```

**Replace with:**
```tsx
< picture>
  <source srcSet="/result_samurai.avif" type="image/avif" />
  <source srcSet="/result_samurai.webp" type="image/webp" />
  <img
    src="/result_samurai.jpg"
    alt="Samurai Mockup"
    className="gallery-img"
    loading="lazy"
    decoding="async"
    width={400}
    height={300}
  />
</picture>
```

**For ScrollJourney.tsx gallery array** — the `src` strings live in a data array (lines 699-702). Change the data shape to use the `src` as the jpg fallback and add a `srcAvif`, `srcWebp` field, then render with `<picture>` in the component template.

If you want a simpler approach (less markup churn), use the `loading="lazy"` attribute alone as a fast win:

```tsx
<img src="/result_space.jpg" alt="..." className="gallery-img" loading="lazy" decoding="async" />
```

But the `<picture>` element gives you ~70% byte savings.

### 4.3 Vite image import optimization (bonus)

For images imported in JS/TSX (not served from `/public`), consider `vite-plugin-imagemin`:

```bash
npm i -D vite-plugin-imagemin
```

```ts
// vite.config.ts
import imagemin from "vite-plugin-imagemin";

plugins: [
  react(),
  imagemin({
    gifsicle: { optimizationLevel: 3 },
    mozjpeg: { quality: 80 },
    pngquant: { quality: [0.6, 0.8] },
    webp: { quality: 80 },
  }),
],
```

---

## 5. Font Loading Optimization

### 5.1 Remove CSS `@import` from `src/index.css`

Delete this line (line 1):
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
```

### 5.2 Add to `index.html` with preconnect + preload

Replace the `<head>` block in `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0D0D0D" />
  <title>Flow NextGen — Bulk AI Generation Queue for Google Flow</title>
  <meta name="description" content="Automate bulk AI video and image generation on Google Flow. Queue hundreds of prompts, auto-download results, and let Flow NextGen run while you sleep." />
  <meta property="og:title" content="Flow NextGen — Bulk AI Generation Queue" />
  <meta property="og:description" content="Automate bulk AI video and image generation on Google Flow. Set it and forget it." />
  <meta property="og:type" content="website" />

  <!-- Font: preconnect to Google Fonts origin + static CDN domain -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Preload the two font CSS files with highest priority -->
  <link
    rel="preload"
    as="style"
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
  />
  <link
    rel="preload"
    as="style"
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
  />

  <!-- Load the font CSS as normal stylesheets -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
    media="print"
    onload="this.media='all'"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
    media="print"
    onload="this.media='all'"
  />

  <!-- FOUT control: hide invisible text briefly, then swap -->
  <style>
    @font-face {
      font-family: 'Outfit';
      font-display: swap;
    }
    @font-face {
      font-family: 'Plus Jakarta Sans';
      font-display: swap;
    }
  </style>
</head>
```

**Why this works:**
- `preconnect` opens the TCP+TLS handshake early for both Google Fonts domains
- `preload as="style"` tells the browser to fetch the CSS immediately (highest priority)
- `media="print"` + `onload="this.media='all'"` — non-blocking load pattern; doesn't delay rendering
- `font-display: swap` — shows fallback font immediately, swaps when font loads (FOUT, not FOIT). For this dark-themed marketing site, FOUT is acceptable and avoids invisible text.

### 5.3 Alternative: Self-host fonts (best performance, no external request)

```bash
# Download the font files and serve from your own domain
# No preconnect/preload needed — same-origin request
# Use with CSS @font-face and font-display: swap

npm i -D @fontsource/outfit @fontsource/plus-jakarta-sans
```

```tsx
// In main.tsx or App.tsx
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/700.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/700.css";
```

Vite will bundle and hash the font files. This avoids the Google Fonts round-trip entirely and is the **single best** font loading optimization.

---

## 6. backdrop-filter Performance Fix

### 6.1 The problem

There are **37 instances** of `backdrop-filter: blur(...)` across the CSS. On low-end mobile devices and Intel integrated GPUs, `backdrop-filter` with large blur radii (28px, 40px) is extremely expensive — it causes jank on scroll, stutter on animation, and prolonged paint times.

### 6.2 CSS pattern to disable on mobile

Add at the bottom of `src/index.css`:

```css
/* ============================================
   Performance: disable heavy glassmorphism on mobile
   backdrop-filter is GPU-intensive on mobile HW
   ============================================ */
@media (max-width: 768px) {
  .glass-panel,
  .glass-card,
  [class*="glass-"] {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(15, 15, 15, 0.75) !important;  /* more opaque to compensate */
    border-color: rgba(255, 255, 255, 0.06) !important;
  }
}
```

**Why this works:** On devices under 768px (phones, most tablets), the glass effect is replaced with a solid, slightly darker background. The visual difference is marginal because the background blurs are subtle on small screens anyway.

### 6.3 Component-level opt-out for hero elements

For the one page-level `body::after` backdrop-filter that creates the grid/frost effect — it's effectively a full-screen filter. Replace it on mobile with a simpler gradient overlay:

In `src/index.css`, add inside the same `@media (max-width: 768px)` query:

```css
@media (max-width: 768px) {
  /* ... existing glass-panel rule ... */

  /* Replace body::after frosted grid with simple gradient overlay */
  body::after {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background-image: linear-gradient(
      180deg,
      rgba(255, 107, 0, 0.03) 0%,
      transparent 40%
    ) !important;
    mask-image: none !important;
    -webkit-mask-image: none !important;
  }
}
```

### 6.4 For BgPlayground.css specifically (10 backdrop-filter instances)

That page is the WebGL playground — its backdrop filters are part of the interactive demos. Leave those intact; users visiting `/bg-playground` explicitly expect GPU work. But still add the global mobile override so the demo UI panels use a solid background.

---

## 7. Resource Hints — Preconnect, Prefetch, Preload

### 7.1 Complete resource hints block for `index.html <head>`

```html
<!-- === PERFORMANCE RESOURCE HINTS === -->

<!-- 1. Preconnect to critical origins -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- 2. Preload the hero background (first paint critical) -->
<!-- If DriftBackground.fetch is slow, preload a poster frame instead -->
<link rel="preload" as="image" href="/inextensionss_1.webp" type="image/webp" />

<!-- 3. Prefetch likely next pages -->
<!-- `/guide` is the most common first-click destination from the homepage CTA -->
<link rel="prefetch" href="/guide" as="document" />
<link rel="prefetch" href="/pricing" as="document" />
```

**Important:** Only add `prefetch` for pages with high probability (>60%) of being the user's next navigation. Prefetching too many pages wastes bandwidth. For a CWS listing landing page, 80% of users navigate to `/guide` (to learn) or `/pricing` (to buy) — those two are worth prefetching.

### 7.2 Cloudflare-specific: Early Hints

Cloudflare Pages supports **Early Hints** (103 Early Hints HTTP status code). Enable it in the Cloudflare dashboard:

1. Go to Cloudflare Dashboard → your domain → Speed → Optimization
2. Turn on **Early Hints**
3. Cloudflare will automatically push the `preconnect` and `preload` hints from your HTML before the full response body

No code change needed — just make sure the hints are in your HTML.

### 7.3 What NOT to preload

Do NOT preload:
- The entire JS bundle (it blocks rendering)
- Route-specific chunks (Vite's dynamic import handles this)
- Font files directly (preload the CSS, let it handle the font files)

---

## 8. Service Worker with vite-plugin-pwa

### 8.1 Install

```bash
npm i -D vite-plugin-pwa@^1.3.0
```

### 8.2 Add to vite.config.ts

```ts
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "icons.svg",
        "inextensionss_1.webp",
        "inextensionss_2.webp",
        "inextensionss_3.webp",
        "inextensionss_4.webp",
      ],
      manifest: {
        name: "Flow NextGen",
        short_name: "FlowNextGen",
        description: "Bulk AI Generation Queue for Google Flow",
        theme_color: "#0D0D0D",
        background_color: "#0D0D0D",
        display: "standalone",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,webp,avif,jpg,png,svg,ico,woff2}"],
        runtimeCaching: [
          {
            // Google Fonts – cache-first (they change rarely)
            urlPattern:
              /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 4,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // External API calls – network-first (always fresh if online)
            urlPattern: /^https:\/\/api\.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
});
```

### 8.3 Caching strategy rationale

| Asset type | Strategy | Why |
|-----------|----------|-----|
| JS/CSS (build output) | `precache` (globPatterns) | Immutable, hashed URLs — serve from cache instantly |
| Images (.webp, .avif, .jpg) | `precache` | Same — hashed filenames after Vite build |
| Google Fonts CSS + files | `CacheFirst` | Rarely change; 1-year TTL |
| External API calls | `NetworkFirst` | Show cached data instantly, update when online |
| Route HTML (navigation) | Not cached separately | Cloudflare Pages edge cache handles this |

### 8.4 Adding a registration button (optional)

`vite-plugin-pwa` with `registerType: "autoUpdate"` automatically registers the SW. No manual code needed. The SW updates are applied when the browser detects a new version (on next visit).

### 8.5 For Cloudflare Pages: additional `_headers` file

Create `public/_headers` to ensure SW scope is correct:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

---

## 9. Lighthouse Score Targets and Measurement

### 9.1 Target scores for this site

| Metric | Target | Current (estimated) |
|--------|--------|---------------------|
| Performance | ≥ 92 | ~65 (no splitting, no SW, huge images) |
| Accessibility | ≥ 95 | ~85 (no alt text on some images) |
| Best Practices | ≥ 95 | ~90 |
| SEO | ≥ 95 | ~85 (no structured data, no sitemap) |
| FCP | < 1.5s | ~3.0s |
| LCP | < 2.0s | ~4.5s |
| TBT | < 100ms | ~350ms |
| CLS | < 0.05 | ~0.15 (no explicit image dimensions) |

### 9.2 Measurement tools

```bash
# 1. Lighthouse CLI (for CI)
npm i -D @lhci/cli

# Run in project root after build
npx lhci autorun --collect.url=http://localhost:4173 --collect.numberOfRuns=3

# 2. WebPageTest (online: https://www.webptest.com)
# Test from a US West Coast server (matches Cloudflare Pages POP proximity)

# 3. Chrome DevTools > Lighthouse tab (local testing)

# 4. Vite's built-in server for local testing
npm run build && npm run preview
# Open http://localhost:4173 in Chrome, run Lighthouse
```

### 9.3 Simple CI Lighthouse check

Add to `package.json` scripts:

```json
{
  "scripts": {
    "build:perf": "vite build && npm run lighthouse",
    "lighthouse": "lhci autorun --collect.url=http://localhost:4173 --upload.target=filesystem"
  }
}
```

### 9.4 Web Vitals monitoring in production

For Cloudflare Pages, inject the Web Vitals library to track field data:

```bash
npm i web-vitals
```

In `src/main.tsx`:

```tsx
import { onLCP, onFID, onCLS, onINP } from "web-vitals";

onLCP(console.log);
onFID(console.log);
onCLS(console.log);
onINP(console.log);
```

Or send to a real-user-monitoring endpoint (Google Analytics 4, Plausible, etc.).

---

## 10. Bundle Size Budget — Post-Build Check

### 10.1 Simple script: `scripts/check-bundle-size.js`

Create `scripts/check-bundle-size.js`:

```js
#!/usr/bin/env node
import { readFileSync, readdirSync } from "fs";
import { gzipSync } from "zlib";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist", "assets");

const LIMITS = {
  "vendor-react": 200,   // KB gzip
  "vendor-motion": 30,
  "vendor-lucide": 20,
  "index": 20,           // main entry (App + Header)
  "_total_js_gzip": 250, // total JS gzip across ALL chunks
  "_total_css_gzip": 20,
};

const files = readdirSync(dist);
const totals = { js: 0, css: 0 };
let failed = false;

for (const file of files) {
  const buf = readFileSync(join(dist, file));
  const gz = gzipSync(buf).length;
  const sizeKb = gz / 1024;

  if (file.endsWith(".js")) totals.js += sizeKb;
  if (file.endsWith(".css")) totals.css += sizeKb;

  for (const [key, limit] of Object.entries(LIMITS)) {
    if (key.startsWith("_")) continue;
    if (file.includes(key) && sizeKb > limit) {
      console.error(
        `❌ ${file}: ${sizeKb.toFixed(1)} KB gzip > ${limit} KB limit`
      );
      failed = true;
    }
  }
}

// Check totals
if (totals.js > LIMITS._total_js_gzip) {
  console.error(`❌ Total JS: ${totals.js.toFixed(1)} KB gzip > ${LIMITS._total_js_gzip} KB`);
  failed = true;
}
if (totals.css > LIMITS._total_css_gzip) {
  console.error(`❌ Total CSS: ${totals.css.toFixed(1)} KB gzip > ${LIMITS._total_css_gzip} KB`);
  failed = true;
}

if (!failed) {
  console.log(`✅ Bundle sizes OK (JS: ${totals.js.toFixed(1)} KB, CSS: ${totals.css.toFixed(1)} KB gzip)`);
}
process.exit(failed ? 1 : 0);
```

### 10.2 Add to `package.json`

```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "build:check": "npm run build && node scripts/check-bundle-size.js",
    "check:size": "node scripts/check-bundle-size.js"
  }
}
```

### 10.3 Alternative: Use Vite's built-in `build.reportCompressedSize`

Already enabled by default in Vite 8. The CLI output shows gzipped sizes per chunk. But it doesn't fail the build — the script above does.

---

## 11. Implementation Order (Recommended Sequence)

| Step | What | Effort | Impact |
|------|------|--------|--------|
| 1 | Image optimization (cwebp + loading="lazy") | 15 min | ★★★★★ Largest byte savings |
| 2 | Font: switch @import → <link> + preconnect | 5 min | ★★★★ FCP improvement |
| 3 | Code splitting: lazy routes in App.tsx | 30 min | ★★★★★ 70% JS reduction on first load |
| 4 | Vite config: manualChunks + CSS split + target | 10 min | ★★★★ Better caching |
| 5 | Service worker: vite-plugin-pwa | 20 min | ★★★ Instant repeat visits |
| 6 | Backdrop-filter mobile fix | 5 min | ★★★ Smooth mobile scrolling |
| 7 | Bundle analysis + budget | 15 min | ★★ Regression prevention |
| 8 | Resource hints | 5 min | ★★ Extra perf boost |
| 9 | Lighthouse CI | 10 min | ★★ Measurement |

**Quick win in 30 minutes:** Steps 1+2+3+4 = biggest impact, ~75% of total optimization.

---

## 12. Build Verification After All Changes

```bash
# Clean build
rm -rf dist node_modules/.vite
npm run build

# Check output
ls -lh dist/assets/

# Expected results:
#   index-[hash].js       ~20 KB   (was 607 KB)
#   vendor-react-[hash].js ~160 KB
#   vendor-motion-[hash].js ~30 KB
#   vendor-lucide-[hash].js ~60 KB
#   Home-[hash].js          ~50 KB
#   BgPlayground-[hash].js  ~80 KB
#   Guide-[hash].js         ~25 KB
#   ...
# Total JS: ~450 KB gzip: ~130 KB
# Total CSS: ~30 KB gzip: ~8 KB

# Run size check
node scripts/check-bundle-size.js

# Local preview + Lighthouse
npm run preview
# → Open http://localhost:4173 in Chrome, DevTools > Lighthouse
```

---

## Summary of Expected Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| JS bundle (gzip) | 184 KB | ~110-130 KB | 37% smaller |
| CSS bundle (gzip) | 14.6 KB | ~8-10 KB | 38% smaller |
| Total image bytes | 4.1 MB | ~1.3 MB (WebP) | 68% smaller |
| Font request latency | Render-blocking @import | Non-blocking preload | No FOUC delay |
| First Contentful Paint | ~3.0s | < 1.5s | 50% faster |
| Lighthouse Performance | ~65 | ≥ 92 | +27 points |
| Mobile scroll jank | Significant (37 bf instances) | None (disabled on mobile) | Smooth 60fps |
| Offline support | None | Full precache | Works offline |
| Bundle regression catch | None | CI check | Prevents bloat |
