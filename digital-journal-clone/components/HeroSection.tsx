"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselArticles = [
    {
      id: 1,
      category: "BUSINESS",
      title: "What tools business should take from a massive security breach to prevent future attacks",
      excerpt: "A massive security breach has exposed vulnerable systems. Experts suggest key tools businesses should implement to prevent future data theft and secure infrastructure.",
      author: "John Doe",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      date: "July 13, 2026",
      href: "/business/security/what-tools-business-should-take-from-a-massive-security-breach-to-prevent-future-attacks"
    },
    {
      id: 2,
      category: "TECHNOLOGY",
      title: "Can space AI data centres solve Earth's computing crisis?",
      excerpt: "Aerospace engineers and cloud providers are designing orbital data hubs powered by solar arrays to alleviate terrestrial power grid strains.",
      author: "Jennifer Friesen",
      authorAvatar: "/author_woman.jpg",
      date: "July 28, 2026",
      href: "/technology/artificial-intelligence/can-space-ai-data-centres-solve-earths-computing-crisis"
    },
    {
      id: 3,
      category: "INNOVATION",
      title: "Canadian mathematician honoured for reshaping global data networks",
      excerpt: "Pioneering research in topology and distributed algorithm optimization earns international recognition across scientific institutes.",
      author: "April Hicke",
      authorAvatar: "/author_glasses.jpg",
      date: "July 27, 2026",
      href: "/business/companies/canadian-mathematician-honoured-for-reshaping-global-data-networks"
    },
    {
      id: 4,
      category: "ARTIFICIAL INTELLIGENCE",
      title: "China's Kimi K3 model rattles US AI technology industry",
      excerpt: "New benchmark evaluations demonstrate breakthrough efficiency in long-context reasoning, sparking intense architectural debates.",
      author: "Dr. Tim Sandle",
      authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      date: "July 26, 2026",
      href: "/technology/innovations/chinas-kimi-k3-model-rattles-us-ai-technology-industry"
    },
    {
      id: 5,
      category: "STARTUPS",
      title: "Startups bet on autonomous AI agents for leaner enterprise operations",
      excerpt: "Venture firms accelerate funding into specialized AI agentic platforms designed to handle complex multi-step corporate workflows.",
      author: "Pramod Jain",
      authorAvatar: "/author_bluesuit.jpg",
      date: "July 25, 2026",
      href: "/business/startups/startups-bet-on-autonomous-ai-agents"
    }
  ];

  const trendingNowItems = [
    {
      number: "01",
      category: "SECURITY",
      title: "Major cybersecurity firm warns of new phishing campaign",
      time: "10 minutes ago",
      image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=200&h=140&fit=crop",
      href: "/business/security/what-tools-business-should-take-from-a-massive-security-breach-to-prevent-future-attacks"
    },
    {
      number: "02",
      category: "BUSINESS",
      title: "Economy shows signs of resilience despite global uncertainty",
      time: "35 minutes ago",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&h=140&fit=crop",
      href: "/business/companies/canadian-mathematician-honoured-for-reshaping-global-data-networks"
    },
    {
      number: "03",
      category: "TECHNOLOGY",
      title: "Quantum computing startup raises $200M in Series B",
      time: "1 hour ago",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=140&fit=crop",
      href: "/technology/innovations/chinas-kimi-k3-model-rattles-us-ai-technology-industry"
    },
    {
      number: "04",
      category: "WORLD",
      title: "Humanitarian aid reaches thousands after devastating floods",
      time: "2 hours ago",
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=200&h=140&fit=crop",
      href: "/business/startups/startups-bet-on-autonomous-ai-agents"
    }
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselArticles.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselArticles.length - 1 ? 0 : prev + 1));
  };

  const activeArticle = carouselArticles[currentSlide];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 border-b border-gray-200 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT CARD: INTERACTIVE FEATURED ARTICLE CAROUSEL (~58%) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between h-full">
          <div>
            {/* Category Tag */}
            <span className="text-[#D31220] font-black text-xs tracking-wider uppercase mb-3 block">
              {activeArticle.category}
            </span>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold leading-[1.2] mb-4 text-gray-900 font-serif">
              <Link href={activeArticle.href} className="hover:text-[#D31220] transition-colors">
                {activeArticle.title}
              </Link>
            </h1>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              {activeArticle.excerpt}
            </p>

            {/* Author Row */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={activeArticle.authorAvatar}
                  alt={activeArticle.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-gray-900">
                  By {activeArticle.author}
                </span>
                <span className="w-4 h-4 bg-[#D31220] text-white rounded-full inline-flex items-center justify-center flex-shrink-0">
                  <Check size={10} strokeWidth={3} />
                </span>
                <span className="text-gray-400 font-medium ml-1">
                  • {activeArticle.date}
                </span>
              </div>
            </div>
          </div>

          {/* Carousel Control Bar */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {carouselArticles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlide === idx 
                      ? "w-2.5 h-2.5 bg-[#D31220]" 
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-700 hover:border-gray-400 hover:text-black transition-colors cursor-pointer bg-white shadow-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-700 hover:border-gray-400 hover:text-black transition-colors cursor-pointer bg-white shadow-sm"
                aria-label="Next slide"
              >
                <ChevronRight size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT CARD: TRENDING NOW BOX (~42%) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-[#D31220]" />
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight uppercase">
                  Trending Now
                </h2>
              </div>
              <Link href="/news" className="text-xs font-bold text-[#D31220] hover:underline">
                View all
              </Link>
            </div>

            {/* 4 Numbered List Items */}
            <div className="space-y-4">
              {trendingNowItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start justify-between gap-3 pb-4 ${
                    idx < trendingNowItems.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-[#D31220] font-extrabold text-base w-6 flex-shrink-0 mt-0.5">
                      {item.number}
                    </span>
                    <div className="flex-1">
                      <span className="text-[10px] font-extrabold text-[#D31220] uppercase tracking-wider block mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-[13px] font-bold text-gray-900 leading-snug hover:text-[#D31220] transition-colors line-clamp-2">
                        <Link href={item.href}>
                          {item.title}
                        </Link>
                      </h3>
                      <span className="text-[11px] text-gray-400 block mt-1 font-medium">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  <Link href={item.href} className="w-[100px] h-[65px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 block group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
