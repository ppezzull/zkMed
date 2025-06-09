import HeroSection from "@/components/home/hero-section";
import ValueProposition from "@/components/home/value-proposition";
import RegistrationSection from "@/components/home/registration-section";
import TechnologyPartners from "@/components/home/technology-partners";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ValueProposition />
      <RegistrationSection />
      <TechnologyPartners />
    </div>
  );
}
