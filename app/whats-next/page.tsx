import HeroSection from "@/app/components/HeroSection";
import TrustBar from "@/app/components/TrustBar";
import HowItWorks from "@/app/components/HowItWorks";
import ProductFeatures from "@/app/components/ProductFeatures";
import ResultPreview from "@/app/components/ResultPreview";
import CategoryGrid from "@/app/components/CategoryGrid";
import ProfessionalSection from "@/app/components/ProfessionalSection";
import PartnerBanner from "@/app/components/PartnerBanner";
import FinalCTA from "@/app/components/FinalCTA";
import Footer from "@/app/components/Footer";

export default function WhatsNextHome() {
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
