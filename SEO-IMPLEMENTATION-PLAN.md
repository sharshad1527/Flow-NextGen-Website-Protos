# Flow NextGen Website — SEO Implementation Plan

**Stack:** Vite 8 + React 19 + TypeScript  
**Deployment:** Cloudflare Pages  
**Domain placeholder:** `https://flow-nextgen.com` (update before going live)  

**Routes:** `/`, `/pricing`, `/guide`, `/privacy`, `/terms`, `/refund`, `/bg-playground`  
**Exclude from sitemap:** `/bg-playground` (142 KB, dev/playground page, no SEO value)

---

## Table of Contents

1. [react-helmet-async — Per-Route Meta Tags](#1-react-helmet-async--per-route-meta-tags)
2. [OG Image Generation](#2-og-image-generation)
3. [JSON-LD Structured Data](#3-json-ld-structured-data)
4. [Sitemap Generation (vite-plugin-sitemap)](#4-sitemap-generation-vite-plugin-sitemap)
5. [robots.txt](#5-robotstxt)
6. [Canonical URLs](#6-canonical-urls)
7. [Heading Hierarchy Best Practices](#7-heading-hierarchy-best-practices)
8. [Google Search Console Setup](#8-google-search-console-setup)
9. [Google Tag / Analytics Setup](#9-google-tag--analytics-setup)

---

## 1. react-helmet-async — Per-Route Meta Tags

### Install

```bash
cd /home/haiva/projects/Flow-NextGen-Website-Protos
npm install react-helmet-async@^3.0.0
```

### Wrap App with HelmetProvider

Edit `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
```

### Create a Reusable SEO Component

Create `src/components/SEO.tsx`:

```tsx
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  ogImage?: string
  ogUrl?: string
  noIndex?: boolean
}

const SITE_NAME = 'Flow NextGen'
const DEFAULT_OG_IMAGE = 'https://flow-nextgen.com/og-default.png'
const SITE_URL = 'https://flow-nextgen.com'
const TWITTER_HANDLE = '@flownextgen' // change to actual handle

export function SEO({
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
  ogUrl,
  noIndex = false,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = ogUrl ? `${SITE_URL}${ogUrl}` : SITE_URL

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex" />}
    </Helmet>
  )
}
```

### Apply SEO Component to Every Page

**`src/pages/Home.tsx`:**

```tsx
import { ScrollJourney } from "../components/ScrollJourney";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Faq } from "../components/Faq";
import { SEO } from "../components/SEO";

export function Home() {
  return (
    <>
      <SEO
        title="Bulk AI Generation Queue for Google Flow"
        description="Automate bulk AI video and image generation on Google Flow. Queue hundreds of prompts, auto-download results, and let Flow NextGen run while you sleep."
        ogUrl="/"
      />
      <main>
        <ScrollJourney />
        <Features />
        <HowItWorks />
        <Faq />
      </main>
    </>
  );
}
```

**`src/pages/PricingPage.tsx`:**

```tsx
import { Pricing } from "../components/Pricing";
import { SEO } from "../components/SEO";

export function PricingPage() {
  return (
    <>
      <SEO
        title="Pricing — Flow NextGen"
        description="Free tier with 30 prompts per 6 hours, or go Pro for $9.99/month. Unlimited generation, API-first mode, auto-download, and 4K upscaling."
        ogUrl="/pricing"
      />
      <main>
        <Pricing />
      </main>
    </>
  );
}
```

**`src/pages/Guide.tsx`** — add `<SEO>` at the top of the return:

```tsx
<>
  <SEO
    title="Guide — Flow NextGen"
    description="Complete guide to using Flow NextGen: installation, sign-in, generation modes (T2I, T2V, I2V), autopilot, queue system, gallery, and billing."
    ogUrl="/guide"
  />
  <div className="guide-page">
    {/* ... existing content ... */}
  </div>
</>
```

**`src/pages/Privacy.tsx`** — add `<SEO>`:

```tsx
<>
  <SEO
    title="Privacy Policy — Flow NextGen"
    description="Flow NextGen privacy policy. What data the Chrome extension collects, how it's stored, and your rights under GDPR, CCPA, and other regulations."
    ogUrl="/privacy"
  />
  <div className="legal-page">
    {/* ... existing content ... */}
  </div>
</>
```

**`src/pages/Terms.tsx`** — add `<SEO>`:

```tsx
<>
  <SEO
    title="Terms of Service — Flow NextGen"
    description="Flow NextGen terms of service. Details on free vs Pro tiers, subscription billing, refunds, and limitations of liability."
    ogUrl="/terms"
  />
  <div className="legal-page">
    {/* ... existing content ... */}
  </div>
</>
```

**`src/pages/Refund.tsx`** — add `<SEO>`:

```tsx
<>
  <SEO
    title="Refund Policy — Flow NextGen"
    description="Flow NextGen refund policy. 14-day refund window on first Pro payment, EU/UK statutory rights, and non-refundable renewals explained."
    ogUrl="/refund"
  />
  <div className="legal-page">
    {/* ... existing content ... */}
  </div>
</>
```

**`src/pages/BgPlayground.tsx`** — add with `noIndex`:

```tsx
<>
  <SEO
    title="Background Playground — Flow NextGen"
    description="Interactive background design playground for Flow NextGen."
    ogUrl="/bg-playground"
    noIndex
  />
  {/* ... existing content ... */}
</>
```

### Update index.html Fallback Meta

The `index.html` currently has hardcoded meta tags. Keep only the absolute essentials there (fallbacks for crawlers that don't execute JS). Strip the duplicate OG tags since react-helmet-async will handle them:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0D0D0D" />
    <title>Flow NextGen — Bulk AI Generation Queue for Google Flow</title>
    <meta name="description" content="Automate bulk AI video and image generation on Google Flow. Queue hundreds of prompts, auto-download results, and let Flow NextGen run while you sleep." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

> **Note:** Cloudflare Pages renders pre-rendered HTML via Cloudflare Workers (or you can add prerendering later). The `index.html` fallback is used only for the first paint before React hydrates. All per-route meta will be injected client-side by react-helmet-async.

---

## 2. OG Image Generation

### Recommended Specs

| Property | Value |
|----------|-------|
| Dimensions | **1200×630 px** (1.91:1 aspect ratio — the standard for Facebook, Twitter, LinkedIn, Discord) |
| Format | PNG (lossless) → convert to WebP for smaller size (WebP is supported by all major social platforms) |
| File size | Under 300 KB (ideally under 100 KB) |
| Text | Large, legible heading; include brand name or logo |
| Safe zone | Keep text within the central **1000×500 px** area (platforms crop the edges on some displays) |

### What to Put on the Image

Since this is a Chrome extension marketing site, create one social card that works for all pages:

- **Brand:** "Flow NextGen" logo + tagline
- **Background:** Dark gradient matching the site theme (#0D0D0D → #1A0A00) with one of the existing flow-field backgrounds or an orange gradient accent
- **Headline:** "Bulk AI Generation for Google Flow" — concise, benefit-driven
- **CTA element:** Small pill badge "Chrome Extension" in the corner

### How to Generate (4 Options)

**Option A: Canva / Figma (Recommended — Manual, Best Result)**
1. Open Canva → Create a design → Custom size 1200×630 px
2. Use a dark background, add the Flow NextGen logo (SVG from `public/icons.svg`)
3. Add the headline "Bulk AI Generation for Google Flow"
4. Export as PNG → convert to WebP via `cwebp` or Cloudflare Images
5. Save to `/public/og-default.png` and `/public/og-default.webp`

**Option B: Vercel OG (Satori-based, Dynamic)**
If you want dynamic OG images per page (home, pricing, guide each get their own), use `@vercel/og` on a Cloudflare Worker:

```bash
npm install @vercel/og
```

But for a marketing site with only 7 routes, static images are simpler and faster.

**Option C: Cloudflare Pages OG Image Worker**
Deploy a worker that generates OG images on-the-fly using Satori + resvg-wasm. This is overkill for a static site.

**Option D: Build-time Generation (Automated, Recommended for this project)**
Use a build script or GitHub Action to generate OG images from a template. Simplest approach for now: create one image manually.

### Where to Host

**Recommended: `/public/` directory (served by Cloudflare Pages)**

```
public/
  og-default.png          # 1200×630 PNG fallback
  og-default.webp         # 1200×630 WebP (preferred)
  favicon.svg
```

Update `DEFAULT_OG_IMAGE` in `SEO.tsx` to point to the WebP version:

```ts
const DEFAULT_OG_IMAGE = 'https://flow-nextgen.com/og-default.webp'
```

Cloudflare Pages will serve these from the edge cache automatically. No extra hosting needed.

### Quick Manual Generation Command

If you have ImageMagick installed:

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
  /home/haiva/projects/Flow-NextGen-Website-Protos/public/og-default.png
```

Then convert to WebP:

```bash
npx cwebp -q 90 \
  /home/haiva/projects/Flow-NextGen-Website-Protos/public/og-default.png \
  -o /home/haiva/projects/Flow-NextGen-Website-Protos/public/og-default.webp
```

> **Note:** The above will produce a basic text-on-gradient image. For something more polished, use Figma/Canva.

---

## 3. JSON-LD Structured Data

### Install (no npm package needed — schema is inline JSON in a `<script>` tag)

No install required. Use `<Helmet>` to inject `<script type="application/ld+json">` blocks.

### Create `src/components/JSONLD.tsx`

```tsx
import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://flow-nextgen.com'

export function SoftwareAppSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Flow NextGen',
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'ChromeOS, macOS, Windows, Linux',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '9.99',
      priceCurrency: 'USD',
      offerCount: '2',
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Tier',
          price: '0',
          priceCurrency: 'USD',
          description: '30 prompts per 6 hours with DOM simulation mode',
        },
        {
          '@type': 'Offer',
          name: 'Pro Tier',
          price: '9.99',
          priceCurrency: 'USD',
          priceType: 'Recurring',
          billingDuration: 'P1M',
          description: 'Unlimited generation, API-first mode, auto-download, 4K upscaling, priority support',
        },
      ],
    },
    description:
      'Flow NextGen is a Chrome extension that automates bulk AI video and image generation on Google Flow. Queue hundreds of prompts and let the extension run them automatically.',
    browserRequirements: 'Requires Chrome 120+',
    softwareVersion: '0.10',
    url: SITE_URL,
    image: `${SITE_URL}/og-default.webp`,
    author: {
      '@type': 'Organization',
      name: 'Flow NextGen',
      url: SITE_URL,
    },
    releaseNotes: `${SITE_URL}/guide`,
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

interface FaqEntry {
  question: string
  answer: string
}

export function FAQSchema({ faqs }: { faqs: FaqEntry[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
```

### Add to Pages

**`src/pages/Home.tsx`** — add both schemas:

```tsx
import { SEO } from "../components/SEO";
import { SoftwareAppSchema, FAQSchema } from "../components/JSONLD";

const faqs = [
  {
    question: "What is Flow NextGen?",
    answer: "Flow NextGen is a Chrome extension that automates bulk AI image and video generation on Google Flow. Queue hundreds of prompts, and the extension runs them automatically while you work on other things."
  },
  {
    question: "Is it free?",
    answer: "Yes, there is a free tier that gives you 30 prompts per 6 hours with DOM simulation mode. The Pro tier at $9.99/month unlocks unlimited generation, API-first mode, auto-download, 4K upscaling, and priority features."
  },
  {
    question: "What models does it support?",
    answer: "Video generation uses Veo 3.1 (Lite, Fast, or Quality mode) and Omni Flash. Image generation uses Nano Banana Pro, Nano Banana 2, and Banana 2 Lite."
  },
  {
    question: "How is this different from manually using Google Flow?",
    answer: "Instead of typing prompts one at a time and waiting for each to finish, you paste your entire list at once. The extension handles the clicking, waiting, retrying, and downloading — while you focus on creative work."
  },
  {
    question: "Is Flow NextGen affiliated with Google?",
    answer: "No. Flow NextGen is an independent Chrome extension built by a third-party developer. We are not endorsed by, affiliated with, or sponsored by Google or Google Flow."
  }
]

export function Home() {
  return (
    <>
      <SEO
        title="Bulk AI Generation Queue for Google Flow"
        description="Automate bulk AI video and image generation on Google Flow. Queue hundreds of prompts, auto-download results, and let Flow NextGen run while you sleep."
        ogUrl="/"
      />
      <SoftwareAppSchema />
      <FAQSchema faqs={faqs} />
      <main>
        <ScrollJourney />
        <Features />
        <HowItWorks />
        <Faq />
      </main>
    </>
  )
}
```

### Verify JSON-LD

After deployment, test at:
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org Validator:** https://validator.schema.org/

---

## 4. Sitemap Generation (vite-plugin-sitemap)

### Install

```bash
npm install -D vite-plugin-sitemap@^0.8.2
```

### Configure `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import Sitemap from 'vite-plugin-sitemap'

const SITE_URL = 'https://flow-nextgen.com'

// These must match the routes in App.tsx — keep in sync!
const routes = [
  '/',
  '/pricing',
  '/guide',
  '/privacy',
  '/terms',
  '/refund',
  // '/bg-playground' — excluded intentionally (no SEO value, 142 KB page)
]

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: SITE_URL,
      dynamicRoutes: routes,
      exclude: ['/bg-playground'],
      readable: true,
      generateRobotsTxt: false, // we'll write robots.txt manually
      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: '/bg-playground',
        },
      ],
      outDir: 'dist',
      // Last modified dates — could be dynamic but static is fine
      // For more granular, use an object map
      defaultChangeFreq: 'monthly',
      defaultPriority: 0.7,
      // Priority per route
      priority: {
        '/': 1.0,
        '/pricing': 0.8,
        '/guide': 0.7,
        '/privacy': 0.3,
        '/terms': 0.3,
        '/refund': 0.4,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

> **Important:** On each route change in `App.tsx`, update the `routes` array in `vite.config.ts` to match. The sitemap is generated at build time and won't auto-detect new routes.

### Verify

After `npm run build`, check `dist/sitemap.xml` exists and contains all 6 routes.

---

## 5. robots.txt

Create `public/robots.txt`:

```txt
# robots.txt for Flow NextGen
# https://flow-nextgen.com

User-agent: *
Allow: /
Disallow: /bg-playground
Disallow: /api/     # if any API routes exist
Disallow: /old/

Sitemap: https://flow-nextgen.com/sitemap.xml
```

Cloudflare Pages serves files from `/public/` at the root automatically, so `https://flow-nextgen.com/robots.txt` will resolve correctly.

---

## 6. Canonical URLs

Already handled by the `SEO.tsx` component above — every page sets:

```html
<link rel="canonical" href="https://flow-nextgen.com/route" />
```

### Why This Matters for This Site

- The Vite SPA serves all routes via a single `index.html` — some crawlers may see `/pricing` and `/pricing/` as different pages
- Query parameters (e.g., `?ref=discord`) should strip before canonical
- `react-helmet-async` sets the canonical dynamically on route change, which is correct for client-side routing

### Add a Catch-All Canonical Redirect in `index.html`

In `public/_headers` (Cloudflare Pages custom headers file):

```txt
# public/_headers
/*
  X-Robots-Tag: index, follow
```

No extra config needed — the `SEO` component handles per-page canonicals.

---

## 7. Heading Hierarchy Best Practices

### Current Assessment

| Page | Route | h1? | h2? | h3? | Issue |
|------|-------|-----|-----|-----|-------|
| Home | `/` | ❌ No h1 | ✅ h2: "Done.", "Features" sections, FAQ | ✅ h3/h4 in cards | **Missing h1** |
| Pricing | `/pricing` | ❌ Uses h2 | ✅ h2: "Buy Back Your Creative Hours" | — | **Should be h1** |
| Guide | `/guide` | ✅ h1: "Flow NextGen Guide" | ✅ h2: sections | ✅ h3: subsections | OK |
| Privacy | `/privacy` | ✅ h1: "Privacy Policy" | ✅ h2 | ✅ h3 | OK |
| Terms | `/terms` | ✅ h1: "Terms of Service" | ✅ h2 | — | OK |
| Refund | `/refund` | ✅ h1: "Refund Policy" | ✅ h2 | — | OK |
| Playground | `/bg-playground` | ✅ h1: "Test Scroll Smoothness" | — | — | Noindex anyway |

### Fixes Required

**Home page (`src/pages/Home.tsx`):**  
Add an h1 in `ScrollJourney.tsx` (the hero section). Replace the current h2 structure with an h1 for the main headline.

In `src/components/ScrollJourney.tsx`, find the hero section (around line 660+) and change the first visible heading from `<h2>` to `<h1>`:

```tsx
<h1 className="results-headline">
  <span className="title-row text-light-gradient">Done.</span>
  {/* ... rest of hero text ... */}
</h1>
```

If the hero text "Done." isn't descriptive enough, wrap it in a hidden h1 for SEO:

```tsx
{/* Visually hidden h1 for SEO — the visible heading remains styled as before */}
<h1 style={{
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}}>
  Flow NextGen — Bulk AI Generation Queue for Google Flow
</h1>

<h2 className="results-headline">
  <span className="title-row text-light-gradient">Done.</span>
  {/* ... rest ... */}
</h2>
```

Alternatively, restructure the whole hero to use a single h1. This is better for SEO:

```tsx
<h1 className="results-headline">
  <span className="title-row text-gradient">Flow NextGen</span>
  <span className="title-row text-light-gradient">Done.</span>
  <span className="title-row">Forget It.</span>
</h1>
```

**Pricing page (`src/components/Pricing.tsx`):**  
Change the `<h2>` to `<h1>`:

```diff
- <h2>Buy Back Your <span className="gradient-text">Creative Hours</span></h2>
+ <h1>Buy Back Your <span className="gradient-text">Creative Hours</span></h1>
```

### General Rules Applied

1. **One h1 per page** — uniquely describes the page content
2. **Sequential hierarchy** — h1 → h2 → h3, never skip levels
3. **No empty headings** — every heading must contain meaningful text
4. **h1 includes primary keyword** — each page's h1 naturally includes "Flow NextGen" or the page topic
5. **h2 for major sections** — breaks content into logical blocks
6. **h3 for subsections** — under h2 only

---

## 8. Google Search Console Setup

### Step-by-Step

1. **Go to Google Search Console**  
   https://search.google.com/search-console → Click "Start Now"

2. **Add Property**  
   - Choose **Domain** (preferred — covers all subdomains like `www.flow-nextgen.com` and `flow-nextgen.com`)  
   - Enter your domain: `flow-nextgen.com`  
   - Click "Continue"

3. **Verify Domain Ownership**  
   - Copy the **TXT record** value provided by Search Console
   - Add it as a DNS TXT record in your domain registrar (Namecheap, Cloudflare, etc.):
     - Type: `TXT`
     - Name: `@` (or your domain root)
     - Value: `google-site-verification=...` (paste the long token)
   - Wait for DNS propagation (1-30 minutes typically with Cloudflare DNS)
   - Click "Verify" in Search Console

4. **Submit Sitemap**  
   - In Search Console → your property → "Sitemaps" (left sidebar)
   - Enter: `sitemap.xml`
   - Click "Submit"

5. **Submit Inspect URL**  
   - Go to "URL Inspection" → enter `https://flow-nextgen.com`  
   - Click "Request Indexing" — tells Google to crawl immediately

6. **Configure Settings**  
   - Set **Preferred domain** (`flow-nextgen.com` vs `www.flow-nextgen.com`) — choose one and redirect the other
   - Set **Crawl rate** (default is fine for a new site)
   - Add **Users** if you want teammates to have access

7. **Monitor**  
   - Check "Indexing → Pages" after a few days for errors
   - Check "Experience → Core Web Vitals" for performance metrics
   - Check "Enhancements → Rich results" for JSON-LD validation

### Cloudflare-Specific Notes

Since you're deploying to Cloudflare Pages:
- If you use Cloudflare DNS, verification via TXT record takes effect immediately
- Cloudflare automatically provides DDoS protection and a CDN — Google likes this
- Make sure **no "Block search engines"** flag is set in your Cloudflare dashboard (Scrape Shield → turn off "Hide my email" if relevant, but this doesn't affect SEO)

---

## 9. Google Tag / Analytics Setup

### Option A: Google Tag (gtag.js) — Recommended for Google Ads + Analytics

1. **Create a Google Analytics 4 (GA4) property**  
   https://analytics.google.com → Admin → Create Property → Web → Enter site URL

2. **Get your Measurement ID** (starts with `G-XXXXXXXXXX`)

3. **Install `react-gtm-hook`** (simplest React integration)

```bash
npm install react-gtm-hook@^2.0.0
```

4. **Configure in `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import TagManager from 'react-gtm-hook'
import './index.css'
import App from './App.tsx'

const gtmId = 'G-XXXXXXXXXX' // ← Replace with your actual GA4 ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <TagManager gtmId={gtmId} />
      <App />
    </HelmetProvider>
  </StrictMode>,
)
```

5. **Track page views on route changes** — `react-gtm-hook` does this automatically if you use browser history (which react-router-dom does).

### Option B: Minimal Umami / Plausible (Privacy-First, No Cookie Banner Needed)

If you want analytics without GDPR consent requirements:

**Plausible:**  
```bash
npm install plausible-tracker
```

Then in `src/main.tsx`:

```tsx
import Plausible from 'plausible-tracker'

const plausible = Plausible({
  domain: 'flow-nextgen.com',
  trackLocalhost: false,
})

plausile.enableAutoPageviews()
```

**Umami:**  
Self-host or use umami.is cloud, then add `<script>` tag to `index.html`:

```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="YOUR-ID"></script>
```

> **Recommendation:** Start with **Umami** or **Plausible** — no cookie banner needed, lighter than GA4, and sufficient for a marketing site. Add GA4 only if you need Google Ads integration.

---

## Quick-Start Checklist

```diff
[] npm install react-helmet-async react-gtm-hook (or plausible-tracker)
[] npm install -D vite-plugin-sitemap
[] Create src/components/SEO.tsx (per-route meta, OG, Twitter, canonical)
[] Create src/components/JSONLD.tsx (SoftwareApplication + FAQPage schema)
[] Wrap main.tsx with <HelmetProvider>
[] Add <SEO> to each page component
[] Add <SoftwareAppSchema> and <FAQSchema> to Home page
[] Generate og-default.png (1200×630) → save to /public/og-default.webp
[] Update vite.config.ts with Sitemap plugin
[] Create public/robots.txt
[] Fix heading hierarchy: add h1 to Home page, change h2→h1 on Pricing
[] Rename package.json name: "temp-project" → "flow-nextgen-website"
[] Deploy to Cloudflare Pages
[] Submit to Google Search Console
[] Test with Google Rich Results Test
```

---

## File Manifest (New/Modified)

| File | Action | Purpose |
|------|--------|---------|
| `src/components/SEO.tsx` | **Create** | Reusable SEO meta tags component |
| `src/components/JSONLD.tsx` | **Create** | JSON-LD structured data (SoftwareApp + FAQPage) |
| `src/main.tsx` | **Modify** | Wrap with HelmetProvider, add analytics |
| `src/pages/Home.tsx` | **Modify** | Add SEO, JSON-LD, fix h1 |
| `src/pages/PricingPage.tsx` | **Modify** | Add SEO |
| `src/pages/Guide.tsx` | **Modify** | Add SEO |
| `src/pages/Privacy.tsx` | **Modify** | Add SEO |
| `src/pages/Terms.tsx` | **Modify** | Add SEO |
| `src/pages/Refund.tsx` | **Modify** | Add SEO |
| `src/pages/BgPlayground.tsx` | **Modify** | Add SEO (noindex) |
| `src/components/Pricing.tsx` | **Modify** | h2 → h1 |
| `src/components/ScrollJourney.tsx` | **Modify** | Add h1 for SEO |
| `public/robots.txt` | **Create** | Crawler directives |
| `public/og-default.webp` | **Create** | Default OG image (1200×630) |
| `index.html` | **Modify** | Strip duplicate OG tags, keep minimal fallback |
| `vite.config.ts` | **Modify** | Add Sitemap plugin |
| `package.json` | **Modify** | Rename to "flow-nextgen-website" |
