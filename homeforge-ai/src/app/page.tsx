import HeroSection from "@/components/home/HeroSection";
import ModuleShowcase from "@/components/home/ModuleShowcase";
import WorkflowSection from "@/components/home/WorkflowSection";
import AISection from "@/components/home/AISection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <HeroSection />
      <ModuleShowcase />
      <WorkflowSection />
      <AISection />
      <CTASection />
    </main>
  );
}