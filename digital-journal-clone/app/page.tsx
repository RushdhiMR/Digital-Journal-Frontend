import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EditorsPicks from '@/components/EditorsPicks';
import PromoBanner from '@/components/PromoBanner';
import BusinessGrid from '@/components/BusinessGrid';
import TechnologyGrid from '@/components/TechnologyGrid';
import IndustryInsightsGrid from '@/components/IndustryInsightsGrid';
import PeopleBehindStories from '@/components/PeopleBehindStories';
import MoreNews from '@/components/MoreNews';
import NewsletterBanner from '@/components/NewsletterBanner';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <EditorsPicks />
      <PromoBanner />
      <BusinessGrid />
      <TechnologyGrid />
      <IndustryInsightsGrid />
      <PeopleBehindStories />
      <MoreNews />
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <NewsletterBanner />
      </div>
      <Footer />
    </main>
  );
}
