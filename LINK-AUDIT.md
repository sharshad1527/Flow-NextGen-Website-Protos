# Flow NextGen Website — Link Audit

## 🔴 BROKEN (href="#") — Needs Real URL

| # | File | Line | Link Text | Needs |
|---|------|------|-----------|-------|
| 1 | `src/components/Header.tsx` | 69 | "Review" | Chrome Web Store review URL |
| 2 | `src/components/Header.tsx` | 74 | Discord button | Discord invite URL |
| 3 | `src/components/ScrollJourney.tsx` | 566 | "Leave a Review" | Chrome Web Store review URL |
| 4 | `src/components/Footer.tsx` | 29 | "Discord Community" | Discord invite URL |

## 🟡 Same-Page Anchors (Work on Homepage Only)

| # | File | Line | Link Text | Notes |
|---|------|------|-----------|-------|
| 5 | `src/components/Hero.tsx` | 135 | "See how it works" → `#how-it-works` | Works on / only |
| 6 | `src/components/Header.tsx` | 64 | "Features" → `/#features` | Redirects to / then scrolls ✅ |
| 7 | `src/components/Header.tsx` | 66 | "How it Works" → `/#how-it-works` | Redirects to / then scrolls ✅ |
| 8 | `src/components/Header.tsx` | 67 | "FAQ" → `/#faq` | Redirects to / then scrolls ✅ |
| 9 | `src/components/Footer.tsx` | 22 | "Features" → `#features` | Works on /, not on subpages |
| 10 | `src/components/Footer.tsx` | 27 | "How It Works" → `#how-it-works` | Works on /, not on subpages |

## ✅ Working Links

- `src/pages/Guide.tsx` — All `#section` anchors (TOC → same-page navigation)
- `src/components/Header.tsx:65` — Guide → `/guide` ✅ (react-router)
- `src/components/Footer.tsx:23` — Pricing → `/pricing` ✅
- `src/components/Footer.tsx:32-34` — Privacy/Terms/Refund → `/privacy`, `/terms`, `/refund` ✅
- `src/components/Header.tsx:72-93` — Get Extension → CWS store page ✅
- `src/components/ScrollJourney.tsx:529` — Install Extension → CWS store page ✅

## 🔧 Fix Plan (After CWS Publish + Discord Setup)

1. Replace `href="#"` with `https://chromewebstore.google.com/detail/flow-nextgen/opobokhfcoacjegnhjmkncbabpdlgond/reviews` for Review links
2. Replace `href="#"` with Discord invite URL for Discord links
3. Optional: Footer anchors → use `/` prefix so they work from any page
