import { SEO } from "../components/SEO";
import { ScrollJourney } from "../components/ScrollJourney";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Faq } from "../components/Faq";
import {
  SoftwareApplicationSchema,
  WebSiteSchema,
  FAQPageSchema,
} from "../components/JSONLD";
import { faqs } from "../data/faqs";

export function Home() {
  return (
    <main>
      <SEO
        title="Bulk AI Generation Queue for Google Flow"
        description="Automate bulk AI video and image generation on Google Flow. Queue hundreds of prompts, auto-download results, and let Flow NextGen run while you sleep."
        canonicalPath="/"
      />
      <SoftwareApplicationSchema />
      <WebSiteSchema />
      <FAQPageSchema items={faqs} />
      <ScrollJourney />
      <Features />
      <HowItWorks />
      <Faq />
    </main>
  );
}
