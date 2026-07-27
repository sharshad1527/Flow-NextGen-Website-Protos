import { ScrollJourney } from "../components/ScrollJourney";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Faq } from "../components/Faq";

export function Home() {
  return (
    <main>
      <ScrollJourney />
      <Features />
      <HowItWorks />
      <Faq />
    </main>
  );
}
