import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://flow-nextgen.com'

/**
 * SoftwareApplication schema — primary schema for the Chrome extension
 * with Free and Pro pricing tiers.
 */
export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Flow NextGen",
    "applicationCategory": "BrowserExtension",
    "operatingSystem": "ChromeOS, Windows, macOS",
    "browserRequirements": "Requires Chrome 120+",
    "description":
      "Automate bulk AI video and image generation on Google Flow. Queue hundreds of prompts, auto-download results, and let Flow NextGen run while you sleep.",
    "offers": [
      {
        "@type": "Offer",
        "name": "Free",
        "price": "0",
        "priceCurrency": "USD",
        "description": "30 generations daily",
      },
      {
        "@type": "Offer",
        "name": "Pro",
        "price": "9.99",
        "priceCurrency": "USD",
        "description":
          "Unlimited generations, priority queue, bulk mode, autopilot",
      },
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * FAQPage schema — structured FAQ data for rich search results.
 * Accepts an array of { question, answer } items.
 */
export function FAQPageSchema({
  items,
}: {
  items: { question: string; answer: string }[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * WebSite schema — global site identity for search engines.
 */
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Flow NextGen",
    "url": BASE_URL,
    "description":
      "Bulk AI generation queue for Google Flow — automate video and image generation with a Chrome extension.",
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
