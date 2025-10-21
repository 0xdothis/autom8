import { Header, Footer } from '@/components/layout';
import {
  HeroSection,
  FeaturesGrid,
  HowItWorksSection,
  LiveEventsCarousel,
  StatsSection
} from '@/components/landing';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Live Events Carousel */}
      <LiveEventsCarousel />

      {/* Platform Statistics */}
      <StatsSection />

      <Footer />
    </div>
  );
}
