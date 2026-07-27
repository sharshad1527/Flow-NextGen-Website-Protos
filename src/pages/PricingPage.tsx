import { SEO } from "../components/SEO";
import { Pricing } from "../components/Pricing";

export function PricingPage() {
  return (
    <main>
      <SEO
        title="Pricing — Free & Pro Plans"
        description="Free tier with daily generation quota or Pro plan for unlimited bulk AI generation on Google Flow. Cancel anytime."
        canonicalPath="/pricing"
      />
      <Pricing />
    </main>
  );
}
