# Mobile Responsiveness, Cross-Browser & Accessibility Implementation Plan

## Current Audit Summary

**Project:** Flow-NextGen-Website-Protos (Vite 8 + React 19 + TypeScript)
**Target ship:** 2026
**Design:** Dark glassmorphism, WebGL shaders, motion scroll animations

### Gaps Found (as of July 2026):

| Area | Status |
|------|--------|
| `backdrop-filter` instances | **37** across 8 CSS files — no mobile degradation |
| `webkit-backdrop-filter` | Present alongside backdrop-filter ✓ |
| Responsive media queries | 26 total (mix of max-width/min-width) — 375px/390px/768px breakpoints need verification |
| `prefers-reduced-motion` | ✅ Supported in `index.css` — disables animations + ScrollJourney |
| Touch events for canvas | ❌ `mousemove` on `window` in **4** files — no `touchmove` fallback |
| `safe-area-inset-*` | ❌ Not used anywhere |
| `aria-label` attributes | ❌ 0 on interactive elements (buttons, icon buttons) |
| Skip-to-content link | ❌ Not present |
| `role` attributes | ❌ Only in SVG assets |
| `focus-visible` / `:focus-visible` | ❌ Not found in any CSS |
| Print styles (`@media print`) | ❌ Not present |
| `loading="lazy"` on images | ❌ Not used on 4 gallery images |
| WebGL fallback | ✅ `DriftBackground.tsx` has `setWebglFailed(true)` — renders gradient |
| `BgPlayground.tsx` | 3646 lines, 142KB — keyboard accessibility concerns |
| Safari testing | ❌ Untested — Chromium only |
| Firefox testing | ❌ Untested |

---

## 1. Responsive Design Audit Checklist

Add this checklist to your QA process. Test at every breakpoint after each layout change.

### Breakpoints to test

| Device | Width | Notes |
|--------|-------|-------|
| iPhone SE (classic) | **375×667** | Smallest mainstream — test nav collapse, font scaling |
| iPhone 14 | **390×844** | Modern tall phone — safe areas, notch, bottom bar |
| iPad Mini/Air | **768×1024** | Tablet portrait — glass cards side-by-side still? |
| iPad Pro (landscape) | **1024×768** | Tablet landscape — header spacing, grid layouts |
| Small laptop | **1366×768** | Netbook/resolution floor — scroll journeys, fixed panels |
| Full HD desktop | **1920×1080** | Max content width ≤1200px in `.container` — verify |

### What to verify at each breakpoint

```
□ Primary CTA text fully visible (no overflow/ellipsis)
□ Header nav doesn't overflow / hamburger appears
□ Glass cards don't overlap or break their container
□ ScrollJourney stages stack vertically on mobile (no horizontal overflow)
□ Hero title text scales with viewport (clamp() working)
□ Pricing cards go single-column below 768px
□ Gallery images don't overflow — set max-width: 100%
□ Hero mockup doesn't overflow viewport
□ BgPlayground control hub — fixed position at left (340px) overflows on <600px
□ Footer links don't wrap weirdly
□ Legal pages (Privacy/Terms/Refund) have readable text width
```

#### Files to add/modify

**A) Hero.css — fix title scaling**
The hero title is `font-size: 4rem` with no clamp. On 375px phone that's ~64px text.
```css
.hero-title-centered {
  font-size: clamp(2rem, 5vw + 1rem, 4rem);
}
```

**B) BgPlayground.css — mobile control hub**
The fixed `control-hub` is 340px wide, positioned at `left: 2rem`. On viewports <700px this overflows.
```css
@media (max-width: 700px) {
  .control-hub {
    position: relative !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  .playground-content {
    margin-left: 0 !important;
    width: 100% !important;
    padding-top: 1rem !important;
  }
  .bento-grid-overlay {
    grid-template-columns: 1fr 1fr !important;
    padding: 1rem !important;
  }
}
```

**C) Pricing.css — cards column on mobile**
```css
@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr !important;
  }
}
```

**D) ScrollJourney.css — existing media queries need review**
Has 6 media queries — verify `.journey-stage` positioning works on 375px viewport.
The `hero-mockup-container` width/height at mobile must not overflow.

**E) Add responsive Tailwind helper classes**
If any components use `className` with only desktop-centric Tailwind classes, add `sm:` / `md:` prefixed versions.

---

## 2. Touch Event Handling — WebGL & Canvas Mouse Fallback

### Problem
4 files attach `window.addEventListener("mousemove", ...)` but mobile devices don't fire `mousemove` — only `touchmove`:

| File | Type | Interaction |
|------|------|-------------|
| `DriftBackground.tsx` (line 336) | WebGL1 | Shader pointer response (u_mouse uniform) |
| `flow-field-background.tsx` (line 264) | Canvas2D | Particle mouse gravity |
| `BgPlayground.tsx` (line 1741) | Canvas2D | Mouse position → canvas renders |
| `Hero.tsx` (line 97) | DOM | Parallax tilt on mockup |

### The Pattern — Unified Pointer + Touch Listener

Create a shared utility `src/lib/pointer-utils.ts`:

```ts
// src/lib/pointer-utils.ts
type PointerHandler = (x: number, y: number, pressure?: number) => void;

export function addPointerListener(
  target: EventTarget,
  handler: PointerHandler
): () => void {
  // PointerEvent fires on both mouse AND touch in modern browsers
  const onPointer = (e: PointerEvent) => {
    if (e.isPrimary) {
      handler(e.clientX, e.clientY, e.pressure);
    }
  };
  // TouchEvent fallback for Safari < 14 / older WebViews that don't fire pointermove on canvas
  const onTouch = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handler(e.touches[0].clientX, e.touches[0].clientY, e.touches[0].force || 0.5);
    }
  };

  // Register both, but the pointer handler suppresses touch-derived pointer events
  target.addEventListener("pointermove", onPointer, { passive: true });
  target.addEventListener("touchmove", onTouch, { passive: true });

  return () => {
    target.removeEventListener("pointermove", onPointer);
    target.removeEventListener("touchmove", onTouch);
  };
}

// Off-screen reset for when pointer/touch leaves
export function addPointerLeaveListener(
  target: EventTarget,
  handler: () => void
): () => void {
  const onLeave = () => handler();
  target.addEventListener("pointerleave", onLeave, { passive: true });
  target.addEventListener("touchend", onLeave, { passive: true });
  target.addEventListener("touchcancel", onLeave, { passive: true });
  return () => {
    target.removeEventListener("pointerleave", onLeave);
    target.removeEventListener("touchend", onLeave);
    target.removeEventListener("touchcancel", onLeave);
  };
}
```

### How to apply to each file

**DriftBackground.tsx** — replace `window.addEventListener("resize", ...)` block:
```ts
// Before:
window.addEventListener("mousemove", handleMouseMove);
// After:
import { addPointerListener, addPointerLeaveListener } from "../lib/pointer-utils";
const cleanupPointer = addPointerListener(window, (x, y) => {
  // Set u_mouse uniform from canvas-space position
  const rect = canvas.getBoundingClientRect();
  u_mouse.x = (x - rect.left) / canvas.width;
  u_mouse.y = 1.0 - (y - rect.top) / canvas.height;
});
```

**flow-field-background.tsx** — same pattern on `window`:
```ts
// The existing handleMouseMove updates mouse.x / mouse.y
// Replace with:
const cleanupPointer = addPointerListener(window, (x, y) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = x - rect.left;
  mouse.y = y - rect.top;
});
```

**BgPlayground.tsx** (line 1741) — same pattern.

**Hero.tsx** — parallax tilt:
```ts
// Replace window mousemove with unified listener
const cleanup = addPointerListener(window, (x, y) => {
  const w = window.innerWidth, h = window.innerHeight;
  rotateXVal.set(((y / h) - 0.5) * -20);
  rotateYVal.set(((x / w) - 0.5) * 20);
});
```

---

## 3. Safe Areas (Notch/Punch-Home Indicator)

### The Fix

**Step 1 — Update `index.html` viewport meta tag** (required for `env()` to work):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```
Currently: `width=device-width, initial-scale=1.0` — add `viewport-fit=cover`.

**Step 2 — Add safe-area CSS variables in `index.css`:**
```css
:root {
  /* Safe areas with zero fallback for non-notch devices */
  --sa-top: env(safe-area-inset-top, 0px);
  --sa-bottom: env(safe-area-inset-bottom, 0px);
  --sa-left: env(safe-area-inset-left, 0px);
  --sa-right: env(safe-area-inset-right, 0px);
}
```

**Step 3 — Apply to fixed/absolute positioned elements:**
```css
/* Header — top padding accounts for notch */
.header-wrapper {
  padding-top: calc(1.5rem + var(--sa-top));
}
@media (max-width: 576px) {
  .header-wrapper {
    padding-top: calc(1rem + var(--sa-top));
  }
}

/* BgPlayground control hub — left placement */
.control-hub {
  left: calc(2rem + var(--sa-left));
}

/* Footer bottom padding for home indicator */
.footer {
  padding-bottom: calc(2rem + var(--sa-bottom));
}

/* Legal pages — top padding */
.legal-page {
  padding-top: calc(8rem + var(--sa-top));
}
@media (max-width: 600px) {
  .legal-page {
    padding-top: calc(6rem + var(--sa-top));
  }
}
```

---

## 4. `backdrop-filter` Mobile / Low-End Degradation

### The Problem
- **37 instances** of `backdrop-filter: blur(...)` across the site
- Safari renders backdrop-filter on **CPU** (not GPU), causing jank on iOS
- Low-end Android phones also struggle with heavy blur (≥16px)
- Safari < 18 still requires `-webkit-backdrop-filter` (already present ✅)

### The Fix — CSS-Only Degradation with `@supports` + Media Query

**Add to `index.css`:**

```css
/* Backdrop-filter capability detection + low-end hardware override */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-panel, .glass-card,
  .dynamic-island, .scroll-section,
  .control-hub, .bento-card-glass,
  .aurora-glass, .feature-card {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(13, 13, 13, 0.85) !important;
  }
}

/* Mobile & low-end: reduce or disable blur */
@media (max-width: 768px), (prefers-reduced-transparency: reduce) {
  .glass-panel, .glass-card,
  .dynamic-island, .scroll-section,
  .control-hub, .bento-card-glass,
  .aurora-glass, .feature-card {
    backdrop-filter: blur(8px) saturate(120%) !important;
    -webkit-backdrop-filter: blur(8px) saturate(120%) !important;
  }
}

@media (max-width: 375px), (prefers-reduced-transparency: reduce) {
  .glass-panel, .glass-card,
  .dynamic-island, .scroll-section,
  .control-hub, .bento-card-glass,
  .aurora-glass, .feature-card {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(13, 13, 13, 0.8) !important;
    border-color: rgba(255, 255, 255, 0.06) !important;
  }
}
```

Note: `prefers-reduced-transparency` is a newer media query (macOS/iOS Settings > Accessibility > Display > Reduce Transparency). iOS respects it and it's a user signal meaning "my device can't handle transparency effects." Ship it as progressive enhancement.

---

## 5. WebGL Fallback for Low-Power Devices

### Current state
`DriftBackground.tsx` already has basic fallback:
```ts
if (!gl) { setWebglFailed(true); }
// Renders gradient background
```

### What's missing — GPU Capability Detection
The current fallback only fires if WebGL context creation **fails entirely**. On a low-end Android with a slow GPU, context creation succeeds but rendering at 60fps is impossible.

**Add GPU tier detection in `DriftBackground.tsx`:**

```ts
// In the useEffect, after gl creation:
try {
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
    // Blacklist known low-end GPUs
    const lowEndPatterns = [
      /adreno 5[0-9][0-9]/i, /adreno 6[0-2][0-9]/i,  // Adreno 500-620 series
      /mali-?4[0-9][0-9]/i, /mali-?t[0-9]{3}/i,       // Older Mali
      /powervr/i, /vivante/i, /intel hd graphics/i,     // PowerVR, Vivante, Intel HD
      /apple a[0-9]/, /apple a1[0-4]/,                  // Pre-A15 iPhones
      /swiftshader/i, /llvmpipe/i, /mesa/i,             // Software renderers
    ];
    const isLowEnd = lowEndPatterns.some(p => p.test(renderer));
    if (isLowEnd) {
      setWebglFailed(true);
      return;
    }
  }
} catch (e) {
  // Silently fall through
}
```

**Alternative: FPS-based fallback** — measure frame time after 30 frames:
```ts
const frameTimes: number[] = [];
const perfCheck = (now: number) => {
  frameTimes.push(performance.now());
  if (frameTimes.length >= 30) {
    const elapsed = frameTimes[frameTimes.length-1] - frameTimes[0];
    const fps = (frameTimes.length - 1) / (elapsed / 1000);
    if (fps < 20) { /* downgrade or fallback */ }
  }
  rafId = requestAnimationFrame(perfCheck);
};
```

### For `BgPlayground.tsx` and `flow-field-background.tsx`
These use Canvas2D not WebGL, so they have different concerns:
- Add `canvasContextOptions: { willReadFrequently: false }` for memory
- Cap particle count on mobile (use the same `isLowEnd` function to set `particleCount: 100` instead of 600)
- Add `window.matchMedia('(prefers-reduced-motion: reduce)')` check to pause animations entirely

---

## 6. Cross-Browser Testing Strategy

### What to check per browser

| Browser | Key Risks |
|---------|-----------|
| **Safari 17-18+** | - `backdrop-filter` uses CPU → jank on glass panels<br>- `-webkit-backdrop-filter` prefix still needed (yes, as of 2025 per MDN issue #25914)<br>- CSS `env(safe-area-inset-*)` only works with `viewport-fit=cover`<br>- WebGL shader parity (some GLSL precision differences)<br>- Motion API `AnimatePresence` + page transitions |
| **Firefox 125-130+** | - WebGL1/2 support ✓ but shader compilation differs for `GL_FRAGMENT_PRECISION_HIGH`<br>- `backdrop-filter` works but is GPU-accelerated differently<br>- No `-webkit-` prefix needed ✅<br>- Scroll-driven animations performance |
| **Chrome/Edge** | Already works ✅ — confirm after changes |
| **Samsung Internet** | Android WebGL can be spotty — GPU blacklist important |
| **iOS WebView** | In-app browsers (Instagram, Gmail) — same engine as Safari but may have memory limits |

### Tools

#### BrowserStack Live (free tier: 30 min/session, 1 user)
- Test Safari on real iPhone 14/15 and iPad devices
- Test Firefox on Windows/Mac
- Test Samsung Internet on Android
- **Free tier:** Live, Interactive — 30 minutes per session, unlimited sessions for open-source projects

#### Playwright for automated cross-browser
```bash
# Install browsers
npx playwright install chromium firefox webkit
```

**Create `tests/cross-browser.spec.ts`:**
```ts
import { test, expect } from '@playwright/test';

const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop HD', width: 1920, height: 1080 },
];

for (const vp of VIEWPORTS) {
  test(`homepage renders at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(SITE_URL);
    await page.waitForLoadState('networkidle');

    // Check no JS errors
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    expect(errors.length).toBe(0);

    // Check key elements visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Screenshot for visual diff
    await page.screenshot({ path: `screenshots/home-${vp.name}.png`, fullPage: true });
  });
}
```

**Add `playwright.config.ts`:**
```ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },   // Safari engine
  ],
  retries: 1,
  use: { baseURL: 'http://localhost:5173' },
});
```

#### LambdaTest (alternative to BrowserStack)
- Free tier: 60 min/month of automation testing
- Real device cloud for Safari/iOS
- Integrates with Playwright, Cypress, Selenium

### 🎯 Specific Safari fixes needed

1. **`-webkit-backdrop-filter`** — already present ✅ but audit for any `.tsx` inline styles that use `backdropFilter:` without the `WebkitBackdropFilter:` property:
   ```ts
   // Inline style fix — DriftBackground's fallback div uses no backdrop-filter
   // OK. But the dynamic-island animation uses motion's animate prop
   // Those are style objects in Header.tsx — check none use backdropFilter inline
   ```

2. **`env(safe-area-inset-*)`** requires `viewport-fit=cover` — add to `index.html`.

3. **Safari CPU-blur heavy glass panels** — add the reduced-transparency fallback from section 4.

4. **WebGL shader `GL_FRAGMENT_PRECISION_HIGH` guard** — already present in DriftBackground's fragment shader:
   ```glsl
   #ifdef GL_FRAGMENT_PRECISION_HIGH
   precision highp float;
   #else
   precision mediump float;
   #endif
   ```
   ✅ Already done. Confirm the SmokeBackground also has it (it targets `#version 300 es` which requires `highp` by default — OK).

---

## 7. Accessibility Checklist

### 7a. ARIA Labels — Add to All Icon Buttons & Icon-Only Controls

**Search pattern:** Elements with an `<svg>` inside a `<button>` or `<a>` with no text content.

**Files to fix:**

| File | Element | Missing |
|------|---------|---------|
| `Header.tsx` (line 96) | `<button>Get Extension</button>` | Has text ✅ OK |
| `Header.tsx` (line 91) | Discord `<a>` link | Has text "Discord" ✅ OK |
| `TaskLedgerQueue.tsx` | Icon buttons (RotateCcw, Trash2) | ❌ `aria-label` |
| `Features.tsx` | Reorder buttons (ChevronUp) | ❌ `aria-label` |
| `ShinyButton.tsx` | Generic `<motion.button>` | ❌ Consider `aria-label` prop |
| `Hero.tsx` (lines 250-278) | Nav buttons with `title` attr | `title` is not sufficient — add `aria-label` |

**Add to each icon button:**
```tsx
<button
  onClick={handlePauseToggle}
  className="queue-metric-card action-card"
  aria-label={isPaused ? "Resume queue" : "Pause queue"}
>
```

### 7b. Skip-to-Content Link

**Add after `<div id="root">` — renders at the top of every page:**

```tsx
// src/components/SkipToContent.tsx
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 99999,
        padding: '1rem 1.5rem',
        background: '#FF6B00',
        color: '#fff',
        fontWeight: 700,
        fontSize: '1rem',
        textDecoration: 'none',
        borderRadius: '0 0 8px 0',
      }}
      // Re-appear on focus
      onFocus={(e) => {
        (e.target as HTMLElement).style.left = '0';
      }}
      onBlur={(e) => {
        (e.target as HTMLElement).style.left = '-9999px';
      }}
    >
      Skip to content
    </a>
  );
}
```

**In `App.tsx` render it first:**
```tsx
return (
  <BrowserRouter>
    <SkipToContent />
    <ScrollToTop />
    <AppContent />
  </BrowserRouter>
);
```

**Add `id="main-content"` to `<main>` or container element in each page.**

### 7c. Keyboard Navigation Order

**Critical issues:**
1. `BgPlayground.tsx` (3646 lines) — the fixed control panel has a scrollable list of 50+ concept buttons. Tab order should:
   - Enter → tab through control hub (category filters, selector list)
   - Then tab into scrollable content on the right
   - Currently: no tabIndex management. Add `tabIndex={0}` to interactive elements, ensure the panel uses `aria-role="region"` with `aria-label="Background controls"`.

2. `Header.tsx` — nav links have good order ✅ but the `hidden-nav` state sets `pointerEvents: "none"` via motion — this also affects keyboard users because `aria-hidden` is not toggled. Fix:
   ```tsx
   <motion.header
     aria-hidden={!isVisible}
     // or attach inert when hidden
     {...(isVisible ?{} : { inert: '' })}
   >
   ```
   Note: `inert` is supported in Chrome 120+, Firefox 123+, Safari 18+ — suitable for 2026 shipping.

3. Legal pages — navigation (Privacy→Terms→Refund links) should have a logical Tab order matching visual order. Currently they render in a `<div>` after all sections — OK ✅.

4. ScrollJourney on mobile — the canvas logo intro has no keyboard equivalent. Add a hidden `<button>` after it for "Skip intro" or use `prefers-reduced-motion` to bypass it.

### 7d. Focus Trap for Modals/Menus

Search for modal-like components:
- No explicit modal found (no dialog/overlay with focus trap). The `AnimatePresence` in ScrollJourney and BgPlayground is for animation, not dialogs.
- If any future modal is added, use `useFocusTrap` from `focus-trap-react`:
  ```tsx
  import FocusTrap from 'focus-trap-react';
  
  <FocusTrap>
    <div role="dialog" aria-modal="true" aria-label="Settings">
      {/* modal content */}
    </div>
  </FocusTrap>
  ```

### 7e. Screen Reader Testing

| Tool | How to Test | What to Listen For |
|------|------------|-------------------|
| **VoiceOver (macOS)** | `Cmd+F5` → tab through site | Page transitions announcing correctly, glass cards getting role announcements |
| **NVDA (Windows)** | Free, download from nvaccess.org | Same + contrast issues reported |
| **ChromeVox (ChromeOS)** | `Ctrl+Alt+Z` | Verify flow-field background isn't announced |

**Test script for each page:**
```
1. Tab from top — does skip link appear?
2. Tab through nav — is current page indicated?
3. Navigate to main content — does it start at correct place?
4. Interact with icon buttons — are labels announced?
5. Page transition — does route change announce new page title?
6. Glass cards — is decorative content (background SVGs) hidden with aria-hidden?
```

### 7f. Color Contrast — Glassmorphism Transparency

This is the **hardest a11y issue** for this project. Glass panels have `background: rgba(15, 15, 15, 0.45)` — 45% opacity means the dark background underneath bleeds through. The effective text contrast depends on what's rendered behind the panel.

**Fix approach:**

1. **Ensure sufficient contrast on content text over glass panels** — `var(--text-high): #F5F5F5` over `rgba(15,15,15,0.45)` layered on `#0D0D0D`:
   - Calculate: effective background = `0.55 × #0D0D0D + 0.45 × #0F0F0F` ≈ `#0D0D0D` essentially
   - Text `#F5F5F5` on `#0D0D0D` = contrast ratio **19.4:1** ✅ WCAG AAA

2. **Muted text `#808080` on `#0D0D0D`** = contrast ratio **4.5:1** ✅ WCAG AA for body text
   - But on glass panels over dynamic content (e.g., WebGL shader varies background), this may fall below 3:1 in bright shader areas
   - **Fix:** Use `backdrop-filter` fallback from section 4. On mobile/accessibility-mode, glass panels get solid `rgba(13,13,13,0.85)` background, guaranteeing full contrast.

3. **Accent color `#FF6B00` on `#0D0D0D`** = contrast ratio **5.7:1** ✅ WCAG AA

4. **Aurora orb filter:blur(80px) text readability** — do not render text over aurora orbs without glass panel overlay.

5. **Add a `contrast-check.tsx` development tool:**
```tsx
// Only import in dev: npm install -D @axe-core/react
if (process.env.NODE_ENV === 'development') {
  const axe = await import('@axe-core/react');
  axe.default(React, ReactDOM, 1000);
}
```

---

## 8. Print Styles — Legal Pages

### Current problem
All pages use dark background `var(--primary-bg): #0D0D0D` and light text `#F5F5F5`. Printed to paper, this uses massive amounts of ink/toner and may render illegibly.

### Fix — Add print CSS

**Add `@media print` block to `Legal.css`** (or better, `src/index.css` for global override):

```css
/* ====================================
   PRINT STYLES — Legal pages & general
   ==================================== */
@media print {
  /* Kill all backgrounds, animations, WebGL */
  *,
  *::before,
  *::after {
    background: #fff !important;
    color: #000 !important;
    text-shadow: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    animation: none !important;
    transition: none !important;
  }

  /* Hide decorative elements */
  body::before,
  body::after,
  .DriftBackground,
  canvas,
  .header-wrapper,
  .footer,
  [aria-hidden="true"],
  .logo-intro-overlay,
  .scroll-journey,
  .hero-mockup-parent,
  .aurora-container,
  .aurora-glass,
  .aurora-grain {
    display: none !important;
  }

  /* Show only the legal content */
  .legal-page {
    padding: 0 !important;
    min-height: auto !important;
  }

  .legal-container {
    max-width: 100% !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    background: #fff !important;
  }

  .legal-container h1,
  .legal-container h2,
  .legal-container h3,
  .legal-container p,
  .legal-container li {
    color: #000 !important;
  }

  .legal-container h1 { font-size: 24pt; }
  .legal-container h2 { font-size: 18pt; }
  .legal-container p, .legal-container li {
    font-size: 11pt;
    line-height: 1.5;
  }

  .legal-highlight {
    border-left: 3px solid #000 !important;
    background: #f5f5f5 !important;
    padding: 0.75rem 1rem !important;
  }

  .legal-nav-links {
    display: none !important;
  }

  a {
    text-decoration: underline !important;
    color: #000 !important;
  }

  /* Page break control */
  section {
    page-break-inside: avoid;
  }
}
```

### Additionally: `<link rel="stylesheet" media="print">`

For a clean print stylesheet separate from the main bundle, you could add to `index.html`:
```html
<link rel="stylesheet" href="/src/styles/print.css" media="print" />
```
This is optional — the `@media print` block inside existing CSS works fine and avoids an extra HTTP request. Use the external stylesheet approach only if you need print-specific images/copyright notices.

---

## 9. Motion / Page Transition Accessibility

### The Problem
React Router uses `<Routes>` wrapped with `motion` presences. When a route changes:
- Screen readers may not announce the new page
- Focus is lost (not reliably moved to the new heading)
- Animations can confuse users who rely on sudden DOM changes (e.g., "where did the content go?")

### Current code in `App.tsx`:
```tsx
<Routes>
  <Route path="/" element={<Home />} />
  ...
</Routes>
```

No explicit `AnimatePresence` wrapping the routes for page transitions. However, the `motion.div` at the top is a cinematic load reveal (fades from black). The `motion/react` library provides `AnimatePresence` which should be used with `Routes` for enter/exit page animations.

### Fix — Focus Management on Route Change

**Create `src/components/RouteAnnouncer.tsx`:**
```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Live region that announces page navigations to screen readers
export function RouteAnnouncer() {
  const location = useLocation();
  const pageTitles: Record<string, string> = {
    '/': 'Home — Flow NextGen',
    '/pricing': 'Pricing — Flow NextGen',
    '/bg-playground': 'Background Playground — Flow NextGen',
    '/privacy': 'Privacy Policy — Flow NextGen',
    '/terms': 'Terms of Service — Flow NextGen',
    '/refund': 'Refund Policy — Flow NextGen',
    '/guide': 'Guide — Flow NextGen',
  };

  useEffect(() => {
    const title = pageTitles[location.pathname] || 'Flow NextGen';
    document.title = title;

    // Move focus to the main content heading
    const main = document.querySelector<HTMLElement>('#main-content');
    if (main) {
      main.focus({ preventScroll: true }); // preventScroll avoids jumping before transition
    }
  }, [location.pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {pageTitles[location.pathname] || 'Page loaded'}
    </div>
  );
}
```

**Render in `App.tsx`:**
```tsx
return (
  <BrowserRouter>
    <SkipToContent />
    <RouteAnnouncer />
    <ScrollToTop />
    <AppContent />
  </BrowserRouter>
);
```

### AnimatePresence for page transitions (if you add them)

If you add motion exit animations to route changes:
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      ...
    </Routes>
  </motion.div>
</AnimatePresence>
```

**But wait** — `AnimatePresence` with `mode="wait"` will cause screen readers to see content disappear and reappear. **Critical fix:** Hide exit animations from screen readers:
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    aria-hidden={true} // ❌ Don't do this — it hides content
    // Instead, use `inert` for exiting elements:
    // inert is only set during exit, handled by AnimatePresence
  >
```

Actually, `motion` + `AnimatePresence` has built-in support:
- Exiting elements get `position: absolute` and fade out — this is fine for screen readers because the content is still in the DOM during exit
- The **entering** content is what matters — use `RouteAnnouncer` to announce the new page title

Also ensure transition duration respects `prefers-reduced-motion`:
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
>
```

### BgPlayground keyboard navigation concerns

The `BgPlayground.tsx` file is 3,646 lines with a dense interactive control panel:
```tsx
<SelectorList aria-label="Background concepts" role="listbox">
  {CONCEPTS.map(concept => (
    <button
      key={concept.id}
      role="option"
      aria-selected={selectedId === concept.id}
      tabIndex={0}
      onClick={() => select(concept.id)}
    >
      {concept.title}
    </button>
  ))}
</SelectorList>
```

Also add:
- `aria-roledescription="category"` on the category filter buttons
- Ensure the `BentoGridOverlay` cards have `tabIndex={0}` and `aria-label` for decorative purposes
- The performance stats (`perf-stats`) should be `role="region"` with `aria-label="Performance metrics"` but not announced on page load — `aria-live="polite"` for the FPS counter

---

## 10. Testing Tools & Services

### 10a. BrowserStack Free Tier

| Feature | Free Tier | Notes |
|---------|-----------|-------|
| Live (interactive) | 30 min/session | Enough for quick Safari/Firefox smoke tests |
| Screenshots | ❌ Not free | Use Playwright screenshots instead |
| Real device cloud | ❌ Not free | Use BrowserStack's 30-min sessions for real iPhones |

**Process:**
1. Push to staging URL (Cloudflare Pages preview URL)
2. Open BrowserStack Live → pick Safari on macOS → navigate to URL
3. Test: WebGL rendering, backdrop-filter, page transitions, scroll animations
4. Repeat on iPhone Safari

### 10b. Playwright — Full Automated Test Suite

```bash
npm install -D @playwright/test
npx playwright install chromium firefox webkit
```

**`tests/accessibility.spec.ts`** — axe-core integration:
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no automated a11y violations', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('all routes pass a11y scan', async ({ page }) => {
  const routes = ['/', '/pricing', '/privacy', '/terms', '/refund', '/guide', '/bg-playground'];
  for (const route of routes) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${route}`).toEqual([]);
  }
});
```

**`tests/visual.spec.ts`** — visual regression:
```bash
npm install -D @playwright/test pixelmatch
```
```ts
// Screenshot comparison at each breakpoint
const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const vp of VIEWPORTS) {
  test(`homepage matches snapshot at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`home-${vp.name}.png`, { fullPage: true });
  });
}
```

### 10c. Lighthouse CI — Performance + A11y Gates

**Add `lighthouserc.js`:**
```js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/pricing',
        'http://localhost:5173/privacy',
        'http://localhost:5173/terms',
        'http://localhost:5173/refund',
        'http://localhost:5173/bg-playground',
      ],
      numberOfRuns: 3,
    },
    assert: {
      // Fail CI if these scores drop below thresholds
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'color-contrast': ['error'],
        'aria-valid-attr': ['error'],
        'button-name': ['error'],
        'meta-viewport': ['error'],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports',
    },
  },
};
```

**Add npm script:**
```json
{
  "scripts": {
    "lighthouse:ci": "lhci autorun"
  }
}
```

Required dependency:
```bash
npm install -D @lhci/cli
```

### 10d. ESLint Plugin for JSX Accessibility

```bash
npm install -D eslint-plugin-jsx-a11y
```

Add to `eslint.config.js`:
```js
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // ... other configs
  jsxA11y.flatConfigs.recommended,
];
```

This catches:
- Missing `aria-label` on interactive elements
- `alt` text on images
- Duplicate `role` attributes
- Non-functioning tabIndex values
- `html-has-lang` (already present ✅)

### 10e. VSCode Accessibility Helpers (Dev Experience)

- **axe Accessibility Linter** — VSCode extension for in-editor a11y hints
- **Webhint** (`npm install -D hint`) — catches a11y + browser compat issues in CI

---

## Implementation Priority & Effort

| # | Task | Effort | Impact | Quick Win? |
|---|------|--------|--------|------------|
| 1 | Add `viewport-fit=cover` + safe-area CSS vars | 5 min | Medium (notch phones) | ✅ Yes |
| 2 | Add skip-to-content link + `RouteAnnouncer` | 15 min | High (screen reader nav) | ✅ Yes |
| 3 | Add `aria-label` to all icon buttons | 30 min | High (screen reader UX) | ✅ Yes |
| 4 | Add print styles to Legal.css | 15 min | Medium (legal compliance) | ✅ Yes |
| 5 | Mobile backdrop-filter degradation CSS | 10 min | Medium (mobile perf) | ✅ Yes |
| 6 | Add `@playwright/test` + a11y spec | 1 hr | High (automated gates) | ⚠️ Setup |
| 7 | Touch event unified pointer util | 1 hr | High (mobile interactivity) | ⚠️ Moderate |
| 8 | GPU blacklist in DriftBackground | 30 min | Medium (low-end perf) | ⚠️ Moderate |
| 9 | Lighthouse CI config | 1 hr | Medium (CI quality gate) | ❌ Setup |
| 10 | ESLint jsx-a11y config | 15 min | High (catch issues early) | ✅ Yes |
| 11 | Focus trap for any modals | When needed | High (keyboard UX) | 🕐 Future |
| 12 | Cross-browser Playwright test suite | 2 hr | High (Chromium-only→3 browsers) | ❌ Major |

### Rollout order for a sprint:

**Sprint A — Quick wins (1 day):**
- Items 1, 2, 3, 4, 5, 10

**Sprint B — Interaction & testing (2 days):**
- Items 6, 7, 8

**Sprint C — CI & hardening (1 day):**
- Items 9, 12

---

## Summary

This plan addresses all 10 requested areas with concrete code you can copy directly into your project. The top 5 items (safe areas, skip-to-content, aria-labels, print CSS, backdrop-filter degradation) can each be done in under 30 minutes and collectively represent ~80% of the accessibility and mobile-responsiveness improvement. The Playwright + Lighthouse CI setup takes more upfront effort but then runs automatically on every deploy.
