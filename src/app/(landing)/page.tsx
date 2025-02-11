import ContentSection from "@/features/landing/_components/ContentSection";
import CTASection from "@/features/landing/_components/CtaSection";
import FeaturesSection from "@/features/landing/_components/FeaturesSection";
import HeroSection from "@/features/landing/_components/HeroSection";
import PageProgress from "@/features/landing/_components/PageProgress";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#541554] text-white">
      <PageProgress />
      <HeroSection />
      <FeaturesSection />
      <ContentSection />
      <CTASection />
    </div>
  );
}
