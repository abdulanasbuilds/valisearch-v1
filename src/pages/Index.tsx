import { useEffect } from "react";
import { Navbar, AnnouncementBar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Integrations, TrustPrivacy } from "@/components/landing/TrustPrivacy";
import { ProductPreview, FinalCTA, Footer } from "@/components/landing/ProductPreview";
import { Pricing } from "@/components/landing/Pricing";

const Index = () => {
  useEffect(() => {
    // Reveal animations on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen selection:bg-[#6C47FF]/30">
      {/* 1. Header Stack */}
      <Navbar />
      <AnnouncementBar />

      <main>
        {/* 2. Above the fold */}
        <HeroSection />

        {/* 3. Traction & Process */}
        <StatsBar />
        <HowItWorks />

        {/* 4. Deep Features */}
        <Features />

        {/* 5. Ecosystem & Proof */}
        <Integrations />

        {/* 6. Product Deep Dive */}
        <ProductPreview />

        {/* 7. Conversion Focus */}
        <Pricing />
        <TrustPrivacy />
        <FinalCTA />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default Index;
