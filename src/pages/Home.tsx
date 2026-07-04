import { ScrollJourney } from "../components/ScrollJourney";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";

export function Home() {
  return (
    <main>
      <ScrollJourney />
      <Features />
      <HowItWorks />
    </main>
  );
}
