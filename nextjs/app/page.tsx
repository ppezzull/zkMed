import HeroSection from '@/components/home/hero-section';
import ValueProposition from '@/components/home/value-proposition';
import InsurerSection from '@/components/home/insurer-section';
import RegistrationSection from '@/components/home/registration-section';
import TechnologyPartners from '@/components/home/technology-partners';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ValueProposition />
      <InsurerSection />
      <RegistrationSection />
      <TechnologyPartners />
    </main>
  );
}
