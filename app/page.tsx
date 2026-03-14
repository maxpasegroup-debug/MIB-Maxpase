import HeroSection from "./components/HeroSection";
import CareerIntelligenceBanner from "./components/CareerIntelligenceBanner";
import CategoryGrid from "./components/CategoryGrid";
import HowItWorks from "./components/HowItWorks";
import ResultPreview from "./components/ResultPreview";
import ProfessionalSection from "./components/ProfessionalSection";
import PartnerBanner from "./components/PartnerBanner";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CareerIntelligenceBanner />
      <CategoryGrid />
      <HowItWorks />
      <ResultPreview />
      <ProfessionalSection />
      <PartnerBanner />
      <FinalCTA />
      <Footer />
    </main>
  );
}
