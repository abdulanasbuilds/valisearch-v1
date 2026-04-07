import { Navbar } from "@/components/landing/Navbar";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Integrations } from "@/components/landing/Integrations";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { Pricing } from "@/components/landing/Pricing";
import { TrustPrivacy } from "@/components/landing/TrustPrivacy";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
    <Navbar />
    <AnnouncementBar />
    <HeroSection />
    <StatsBar />
    <HowItWorks />
    <Features />
    <Integrations />
    <ProductPreview />
    <Pricing />
    <TrustPrivacy />
    <FinalCTA />
    <Footer />
  </div>
);

export default Index;
