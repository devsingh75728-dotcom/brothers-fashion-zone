import { HeroSection } from '@/components/home/HeroSection';
import { TrustBar } from '@/components/home/TrustBar';
import { AestheticShowcase } from '@/components/home/AestheticShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';

import { VideoShowcase } from '@/components/home/VideoShowcase';
import { WhyIndiaTrustsUs } from '@/components/home/WhyIndiaTrustsUs';
import { MarketplaceSection } from '@/components/home/MarketplaceSection';
import { GuidesSection } from '@/components/home/GuidesSection';
import { InstagramSection } from '@/components/home/InstagramSection';
import { FAQSection } from '@/components/home/FAQSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <AestheticShowcase />
      <FeaturedProducts />
      <VideoShowcase />
      <WhyIndiaTrustsUs />
      <MarketplaceSection />
      <GuidesSection />
      <InstagramSection />
      <FAQSection />
      <Footer />
    </main>
  );
}