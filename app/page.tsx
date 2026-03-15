import HeroSection from "./components/HeroSection";
import TrustBar from "./components/TrustBar";
import HowItWorks from "./components/HowItWorks";
import ProductFeatures from "./components/ProductFeatures";
import ResultPreview from "./components/ResultPreview";
import CategoryGrid from "./components/CategoryGrid";
import ProfessionalSection from "./components/ProfessionalSection";
import PartnerBanner from "./components/PartnerBanner";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <ProductFeatures />
      <ResultPreview />
      <CategoryGrid />
      <ProfessionalSection />
      <PartnerBanner />
      <FinalCTA />
      <Footer />
    </main>
  );
}
