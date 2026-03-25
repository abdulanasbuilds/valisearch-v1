import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesPreview } from "@/components/landing/FeaturesPreview";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background relative overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <TrustSection />
    <HowItWorks />
    <FeaturesPreview />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
