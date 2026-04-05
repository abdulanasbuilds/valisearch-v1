import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesPreview } from "@/components/landing/FeaturesPreview";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const SectionDivider = () => (
  <div className="relative h-24 md:h-32">
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 60% 100% at 50% 50%, hsl(248 84% 67% / 0.06) 0%, transparent 70%)",
      }}
    />
  </div>
);

const Index = () => (
  <div className="min-h-screen bg-background relative overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <SectionDivider />
    <TrustSection />
    <SectionDivider />
    <HowItWorks />
    <SectionDivider />
    <FeaturesPreview />
    <SectionDivider />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
