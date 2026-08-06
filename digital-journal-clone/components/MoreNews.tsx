"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function MoreNews() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const sectionRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const moreNews = [
    {
      title: "New science report could boost climate suits against oil giants",
      description: "New analysis formats for attributing weather extremeness to greenhouse gas emissions... Common ground for potential lawsuits, according to research published by the Union of Concerned Scientists.",
      date: "By David Chen • 2 hours ago",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=380&fit=crop",
      category: "news",
      subcategory: "world"
    },
    {
      title: "Uber to gobble up Delivery Hero in Taiwan food delivery deal",
      description: "The deal would expand Uber Eats' presence in the competitive Asian food delivery space, bringing together two dominant services, in a transaction valued at approximately $950 million in stock.",
      date: "By Jane Smith • 4 hours ago",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=380&fit=crop",
      category: "business",
      subcategory: "companies"
    },
    {
      title: "UK launches hi-tech mission to study Greenland ice melt",
      description: "Government researchers are deploying radar systems to monitor ice sheet thinning, gathering crucial data on global warming and sea-level rise dynamics.",
      date: "By John Doe • 6 hours ago",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop",
      category: "news",
      subcategory: "world"
    },
    {
      title: "Toronto is air-locked among world's worst as wildfire smoke billows south",
      description: "Wildfire smoke has led to air quality advisories across Ontario and northeastern US, blanketing major urban corridors in haze and high particulate counts.",
      date: "By Sarah Mitchell • 8 hours ago",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=380&fit=crop",
      category: "news",
      subcategory: "world"
    },
    {
      title: "AI ignites 'ignored sector' for Japan chipmaker Kioxia",
      description: "The global race for silicon for the AI generation has transformed the business for chipmaker, creating shortages and testing key storage components in particular.",
      date: "By Pramod Asu • 10 hours ago",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=380&fit=crop",
      category: "technology",
      subcategory: "innovations"
    },
    {
      title: "Writers union acts to block US Paramount deal",
      description: "Many fear the merger will lead to consolidation in the entertainment industry that has been recovery from strikes and inflation.",
      date: "By Jessica Lee • 12 hours ago",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=380&fit=crop",
      category: "business",
      subcategory: "companies"
    },
    {
      title: "Record-smashing heat wave surges from West to eastern US, Canada",
      description: "High temperature warnings have been issued across the Midwest and Northeastern United States in the coming days.",
      date: "By Emily Hart • 14 hours ago",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=380&fit=crop",
      category: "news",
      subcategory: "world"
    },
    {
      title: "AI's top 10 jobs at risk: What happens when the technology predicts its own impact?",
      description: "The latest reports evaluate which jobs are most vulnerable as automated tools become more sophisticated at content production.",
      date: "By Shon Higgs • 16 hours ago",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=380&fit=crop",
      category: "technology",
      subcategory: "artificial-intelligence"
    },
    {
      title: "Global south cities are becoming the new engines of business growth",
      description: "Infrastructure investments and rapid urbanization are creating new growth corridors in emerging markets.",
      date: "By Agil Riaz • 18 hours ago",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=380&fit=crop",
      category: "business",
      subcategory: "markets"
    },
    {
      title: "IBM shares plunge as AI spending boom disrupts business",
      description: "Shares of IBM dropped as investors voiced concerns over corporate spend shifting heavily toward AI compute units.",
      date: "By Lisa Chen • 20 hours ago",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=380&fit=crop",
      category: "news",
      subcategory: "markets"
    },
    {
      title: "Why does Brazil's PIX payment system bother Donald Trump?",
      description: "The popular digital payment app has revolutionized transaction efficiency in Latin America, drawing international policy attention.",
      date: "By David Chen • 1 day ago",
      image: "https://images.unsplash.com/photo-1556742049-0a67daf40955?w=600&h=380&fit=crop",
      category: "business",
      subcategory: "companies"
    },
    {
      title: "Swiss probe Google stopping search choice on Android phones",
      description: "Regulatory bodies are investigating if pre-installed services limit consumer software choices in European markets.",
      date: "By Jane Smith • 1 day ago",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=380&fit=crop",
      category: "technology",
      subcategory: "cybersecurity"
    },
    {
      title: "Turn off addictive features on social media for children, say EU lawmakers",
      description: "Regulatory proposals suggest disabling automatic infinite scrolling feeds and random notifications to protect minors.",
      date: "By John Doe • 2 days ago",
      image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&h=380&fit=crop",
      category: "technology",
      subcategory: "innovations"
    },
    {
      title: "A new Vector tool screens AI training data for bias",
      description: "A tool built by Vector Institute automatically identifies overrepresented groups in dataset profiles.",
      date: "By Pramod Asu • 2 days ago",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=380&fit=crop",
      category: "technology",
      subcategory: "artificial-intelligence"
    },
    {
      title: "Q&A: Understanding developer's life in the age of AI",
      description: "A detailed Q&A exploring how senior engineers maintain product quality and clean code formatting using generative plugins.",
      date: "By Sarah Mitchell • 3 days ago",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=380&fit=crop",
      category: "technology",
      subcategory: "artificial-intelligence"
    },
    {
      title: "Q&A: How brands should measure AI's real impact after checkout",
      description: "Analysts share how machine learning recommendations influence final user baskets and repeat purchasing behaviors.",
      date: "By David Chen • 3 days ago",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=380&fit=crop",
      category: "business",
      subcategory: "markets"
    },
    {
      title: "Twelve US states quote to block Paramount's Warner Assoc. takeover",
      description: "The states have filed a court injunction to pause media consolidation, arguing the combined network limits free consumer choice.",
      date: "By Jane Smith • 4 days ago",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=380&fit=crop",
      category: "business",
      subcategory: "companies"
    },
    {
      title: "Volkswagen confirms weighing up to 50,000 more job cuts",
      description: "The automaker plans structural workforce changes, citing the electrification cost curve and slower automotive demand.",
      date: "By Pramod Asu • 4 days ago",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=380&fit=crop",
      category: "business",
      subcategory: "companies"
    },
    {
      title: "EU sanctions target Russian state-backed messaging app",
      description: "European authorities list the messenger service under sanction regulations, blocking digital advertising revenues.",
      date: "By Agil Riaz • 5 days ago",
      image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&h=380&fit=crop",
      category: "news",
      subcategory: "world"
    },
    {
      title: "EU, UK hit Russia with joint sanctions over cyber attacks",
      description: "The joint measures target infrastructure actors accused of orchestrating digital disruption campaigns against public portals.",
      date: "By Michael Brown • 5 days ago",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=380&fit=crop",
      category: "news",
      subcategory: "world"
    }
  ];

  return (
    <section ref={sectionRef} className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 font-standard-sans">
      <div className="mb-2">
        <h2 className="text-[28px] md:text-[34px] font-bold text-[#BF1E2D] tracking-tight leading-none">
          News from around the world
        </h2>
        <p className="text-[13px] md:text-[14px] text-zinc-800 font-normal mt-2 leading-relaxed font-sans">
          Things happening now that you should probably know about
        </p>
      </div>

      {/* Separator line with thick black bar */}
      <div className="relative w-full h-[1px] bg-zinc-200 mt-3 mb-8">
        <div className="absolute top-0 left-0 w-[70px] h-[3.5px] bg-black" />
      </div>

      <div className="space-y-8 max-w-[1000px]">
        {moreNews.map((item, index) => {
          let authorName = "Digital Journal Staff";
          let dateStr = item.date;
          
          if (item.date.startsWith("By ")) {
            const parts = item.date.replace(/^By\s+/, '').split('•');
            authorName = parts[0].trim();
            dateStr = parts.slice(1).join('•').trim() || "";
          }

          const itemSlug = item.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          const itemCat = (item.category || "news").toLowerCase();
          const itemSub = (item.subcategory || "world").toLowerCase();
          const articleUrl = `/${itemCat}/${itemSub}/${itemSlug}`;

          return (
            <article key={index} className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start pb-8 border-b border-zinc-100 last:border-b-0 last:pb-0 group">
              {/* Thumbnail Clickable Link */}
              <Link href={articleUrl} className="relative w-full sm:w-[220px] md:w-[240px] aspect-[16/10] flex-shrink-0 overflow-hidden bg-gray-100 rounded-none block">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => { e.currentTarget.src = "/ai_hero.png"; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              {/* Content */}
              <div className="flex flex-col flex-grow">
                {/* Heading Clickable Link */}
                <h3 className="text-[17px] md:text-[18px] font-bold leading-[1.25] text-black mb-2">
                  <Link href={articleUrl} className="group-hover:text-[#BF1E2D] transition-colors">
                    {item.title}
                  </Link>
                </h3>
                <p className="text-[13px] md:text-[13.5px] text-zinc-700 leading-relaxed mb-2.5 font-sans">
                  {item.description}
                </p>
                <div className="text-[11.5px] text-zinc-500 font-sans">
                  By <Link href={`/author/${authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="underline hover:text-[#BF1E2D] cursor-pointer text-black font-semibold">{authorName}</Link> {dateStr && `• ${dateStr}`}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-start gap-2 mt-10 select-none">
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
              currentPage === p
                ? "bg-red-600 text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 h-8 flex items-center justify-center border border-gray-300 text-xs text-gray-600 hover:bg-gray-100 font-medium transition-colors cursor-pointer"
          >
            Next Page
          </button>
        )}
      </div>
    </section>
  );
}
