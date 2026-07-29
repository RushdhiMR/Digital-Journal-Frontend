import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EditorsPicks from '@/components/EditorsPicks';
import LatestNewsSection from '@/components/LatestNewsSection';
import PromoBanner from '@/components/PromoBanner';
import PoliticsSection from '@/components/PoliticsSection';
import BusinessGrid from '@/components/BusinessGrid';
import TechnologyGrid from '@/components/TechnologyGrid';
import MarketsSection from '@/components/MarketsSection';
import LifeStyleSection from '@/components/LifeStyleSection';
import BottomCategoryGrid from '@/components/BottomCategoryGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900">
      <Header />
      <HeroSection />
      <EditorsPicks />
      <LatestNewsSection />
      <PromoBanner />
      <PoliticsSection />
      <BusinessGrid />
      <TechnologyGrid />
      <MarketsSection />
      <LifeStyleSection />
      <BottomCategoryGrid />
      <Footer />
    </main>
  );
}
