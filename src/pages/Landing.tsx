import {
  HeroSection,
  FeaturesGrid,
  HowItWorksSection,
  LiveEventsCarousel,
  StatsSection
} from '@/components/landing';

export default function Landing() {
  return (
    <div className="bg-white">
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
    </div>
  );
}
