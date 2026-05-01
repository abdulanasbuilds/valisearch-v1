import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { DashboardMockup } from "@/components/landing/DashboardMockup";
import { Features } from "@/components/landing/Features";
import { BuiltBy } from "@/components/landing/BuiltBy";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      <div className="noise-overlay" />
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        
        {/* Massive Dashboard Mockup acting like the Linear/Gitness screenshot */}
        <div className="w-full max-w-[1200px] mx-auto px-6 -mt-32 relative z-20 flex justify-center pb-32">
          {/* We'll use the DashboardMockup here but scale it up */}
          <div className="w-full transform scale-100 sm:scale-105 lg:scale-110 origin-top animate-float">
            <DashboardMockup />
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-12" />

        <Features />
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-24" />
        
        <BuiltBy />
      </main>
      <Footer />
    </div>
  );
};

export default Index;