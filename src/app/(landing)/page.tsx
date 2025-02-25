import ContentSection from "@/features/landing/_components/ContentSection";
import CTASection from "@/features/landing/_components/CtaSection";
import FeaturesSection from "@/features/landing/_components/FeaturesSection";
import HeroSection from "@/features/landing/_components/HeroSection";
import PageProgress from "@/features/landing/_components/PageProgress";

import ReactLenis from "lenis/react";

export default function Home() {
  return (
    <ReactLenis root>
      <div className="min-h-dvh bg-[#541554] text-white">
        <PageProgress />
        <HeroSection />
        <FeaturesSection />
        <ContentSection />
        <CTASection />
      </div>
    </ReactLenis>
  );
}
