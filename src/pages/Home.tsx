import { SEO } from "../components/SEO";
import { ScrollJourney } from "../components/ScrollJourney";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Faq } from "../components/Faq";

export function Home() {
  return (
    <main>
      <SEO
        title="Bulk AI Generation Queue for Google Flow"
        description="Automate bulk AI video and image generation on Google Flow. Queue hundreds of prompts, auto-download results, and let Flow NextGen run while you sleep."
        canonicalPath="/"
      />
      <ScrollJourney />
      <Features />
      <HowItWorks />
      <Faq />
    </main>
  );
}
