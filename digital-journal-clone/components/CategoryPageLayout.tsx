"use client";

import { useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Article {
  title: string;
  image: string;
  date: string;
  description?: string;
}

interface Guide {
  title: string;
  description: string;
  author: string;
}

interface CategoryPageLayoutProps {
  categoryName: string;
  categoryColor: string; // e.g. "bg-[#FFE9D6]"
  infoBoxText: string;
  infoBoxSubtext?: string;
  featured: {
    category: string;
    title: string;
    description: string;
    image: string;
    author: string;
    date: string;
  };
  secondaryArticles: Article[];
  guidesTitle: string;
  guidesDescription: string;
  guides: Guide[];
  newsTitle: string;
  newsDescription: string;
  newsArticles: Article[];
}

const authorsList = [
  { name: "Chris Hogg", image: "/author_beard.jpg" },
  { name: "Jennifer Friesen", image: "/author_woman.jpg" },
  { name: "Pramod Jain", image: "/author_bluesuit.jpg" },
  { name: "April Hicke", image: "/author_glasses.jpg" },
  { name: "David Potter", image: "/author_bluesuit.jpg" },
  { name: "Jennifer Lussier", image: "/author_woman.jpg" }
];

export default function CategoryPageLayout({
  categoryName,
  categoryColor,
  infoBoxText,
  infoBoxSubtext,
  featured,
  secondaryArticles,
  guidesTitle,
  guidesDescription,
  guides,
  newsTitle,
  newsDescription,
  newsArticles
}: CategoryPageLayoutProps) {
  const guidesRef = useRef<HTMLDivElement>(null);
  const newsSectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 27;

  const finalNewsTitle =
    newsTitle.trim().toLowerCase() === 'news' && categoryName && categoryName.trim().toLowerCase() !== 'news'
      ? `${categoryName} News`
      : newsTitle;

  const finalGuidesTitle =
    guidesTitle.trim().toLowerCase() === 'guides' && categoryName && categoryName.trim().toLowerCase() !== 'guides'
      ? `${categoryName} Guides`
      : guidesTitle;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (newsSectionRef.current) {
      newsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const displayedNewsArticles = newsArticles.map((art) => {
    if (currentPage === 1) return art;
    return {
      ...art,
      title: `${art.title} (Page ${currentPage})`,
      date: `Page ${currentPage} • ${art.date.includes('•') ? art.date.split('•')[1].trim() : art.date}`
    };
  });

  const scrollLeft = () => {
    if (guidesRef.current) {
      guidesRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (guidesRef.current) {
      guidesRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        
        {/* HERO SECTION + CATEGORY INFO BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
          {/* Left Column (8 cols): Big Featured Image with Title, Excerpt & Byline Below */}
          <div className="lg:col-span-8 flex flex-col cursor-pointer group">
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 mb-4">
              <img
                src={featured.image}
                alt={featured.title}
                onError={(e) => { e.currentTarget.src = "/ai_hero.png"; }}
                className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
              />
            </div>
            <h2 className="text-[22px] md:text-[25px] font-bold leading-snug text-black group-hover:text-[#BF1E2D] transition-colors mb-2 font-standard-sans">
              {featured.title}
            </h2>
            <p className="text-[13px] md:text-[13.5px] text-zinc-700 leading-relaxed font-sans mb-3">
              {featured.description}
            </p>
            <p className="text-[11.5px] text-zinc-500 font-sans">
              By <Link href={`/author/${featured.author.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="underline hover:text-[#BF1E2D] cursor-pointer text-black font-normal">{featured.author}</Link> {featured.date}
            </p>
          </div>

          {/* Right Column (4 cols): Category Info Box */}
          <div className="lg:col-span-4 flex">
            <div className="w-full bg-[#EEEEEE] p-8 md:p-10 flex flex-col justify-start text-black font-standard-sans">
              <h1 className="text-[34px] md:text-[40px] font-bold leading-[1.05] tracking-tight text-black mb-6">
                {categoryName}
              </h1>
              <div className="space-y-4 text-[13.5px] md:text-[14px] text-zinc-800 font-normal leading-relaxed font-sans">
                {infoBoxText.split('\n').map((para, i) => para.trim() && (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Articles: 2x2 Compact Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-t border-b border-zinc-200 py-8 my-8 font-standard-sans max-w-[1000px]">
          {secondaryArticles.slice(0, 4).map((article, index) => (
            <article key={index} className="flex gap-4 items-start cursor-pointer group">
              {/* Square Thumbnail */}
              <div className="relative w-[85px] h-[85px] md:w-[95px] md:h-[95px] flex-shrink-0 overflow-hidden bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  onError={(e) => { e.currentTarget.src = "/ai_hero.png"; }}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>
              {/* Content */}
              <div className="flex flex-col justify-start">
                <h3 className="text-[13.5px] md:text-[14px] font-bold leading-[1.25] text-black group-hover:text-[#BF1E2D] transition-colors mb-1.5 font-standard-sans">
                  {article.title}
                </h3>
                <p className="text-[11px] md:text-[11.5px] text-zinc-500 font-sans mt-auto leading-tight">
                  {article.date}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* FULL WIDTH LOWER CONTENT */}
        <div className="space-y-12">

          {/* People Behind the Stories Section */}
          <div className="pt-8 border-t border-gray-200">
            <div className="mb-4">
              <h2 className="text-[28px] font-extrabold text-[#CC3333] leading-none">
                People behind the stories
              </h2>
              <p className="text-[14px] text-zinc-800 mt-2.5 leading-relaxed font-normal">
                Our model incorporates journalists, subject-matter experts and business leaders to give you perspective from those who cover the story and those who&apos;ve lived it
              </p>
            </div>

            {/* Separator line with thick black bar */}
            <div className="relative w-full h-[1.5px] bg-zinc-200 mt-4 mb-6">
              <div className="absolute top-1/2 left-0 w-[110px] h-[4px] bg-black -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-[760px]">
              {authorsList.map((author, index) => {
                const slug = author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Link key={index} href={`/author/${slug}`} className="flex flex-col group cursor-pointer">
                    <div className="w-full aspect-square overflow-hidden bg-gray-100 mb-3 rounded-sm">
                      <img
                        src={author.image}
                        alt={author.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="w-[4px] h-[15px] bg-[#CC3333] flex-shrink-0 mt-[3px]" />
                      <span className="text-[13px] font-bold text-black underline underline-offset-2 group-hover:text-[#CC3333] transition-colors leading-tight">
                        {author.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Guides Section */}
          <div className="pt-8 border-t border-gray-200 font-standard-sans">
            <div className="mb-2">
              <h2 className="text-[28px] md:text-[34px] font-bold text-[#BF1E2D] tracking-tight leading-none">
                {finalGuidesTitle}
              </h2>
              <p className="text-[13px] md:text-[14px] text-zinc-800 font-normal mt-2 leading-relaxed font-sans">
                {guidesDescription}
              </p>
            </div>

            {/* Separator line with thick black bar */}
            <div className="relative w-full h-[1px] bg-zinc-200 mt-3 mb-8">
              <div className="absolute top-0 left-0 w-[70px] h-[3.5px] bg-black" />
            </div>

            <div className="relative">
              {/* Left circle arrow button */}
              <button 
                onClick={scrollLeft}
                className="absolute left-[-16px] md:left-[-20px] top-[35%] -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-zinc-300 shadow-md flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer text-[12px] font-bold"
                aria-label="Scroll left"
              >
                &#10094;
              </button>

              {/* Carousel scrollable container */}
              <div 
                ref={guidesRef}
                className="flex overflow-x-auto gap-6 md:gap-8 pb-4 scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {guides.map((guide, index) => (
                  <div key={index} className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-[15px] md:text-[16px] font-bold leading-[1.25] text-black hover:text-[#BF1E2D] transition-colors cursor-pointer mb-2.5">
                        {guide.title}
                      </h3>
                      <p className="text-[12.5px] text-zinc-700 leading-relaxed mb-4 font-sans">
                        {guide.description}
                      </p>
                    </div>
                    <div className="text-[11.5px] text-zinc-500 font-sans mt-auto leading-tight">
                      <div>
                        By <span className="underline font-semibold text-black cursor-pointer hover:text-[#BF1E2D]">Digital Journal Staff</span>
                      </div>
                      <div className="text-zinc-500 mt-1">June 1, 2026</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right circle arrow button */}
              <button 
                onClick={scrollRight}
                className="absolute right-[-16px] md:right-[-20px] top-[35%] -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-zinc-300 shadow-md flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer text-[12px] font-bold"
                aria-label="Scroll right"
              >
                &#10095;
              </button>
            </div>
          </div>

        </div>

        {/* FULL WIDTH: Category News Feed */}
        <div ref={newsSectionRef} className="pt-10 mt-10 border-t border-gray-200 font-standard-sans">
          <div className="mb-2">
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#BF1E2D] tracking-tight leading-none">
              {finalNewsTitle} {currentPage > 1 && <span className="text-zinc-400 font-normal text-sm lowercase">(page {currentPage} of {totalPages})</span>}
            </h2>
            <p className="text-[13px] md:text-[14px] text-zinc-800 font-normal mt-2 leading-relaxed font-sans">
              {newsDescription}
            </p>
          </div>

          {/* Separator line with thick black bar */}
          <div className="relative w-full h-[1px] bg-zinc-200 mt-3 mb-8">
            <div className="absolute top-0 left-0 w-[70px] h-[3.5px] bg-black" />
          </div>

          <div className="space-y-8 max-w-[1000px]">
            {displayedNewsArticles.map((article, index) => {
              // Extract author and date if combined in string e.g. "By Sarah Miller • 8 hours ago"
              let authorName = "Digital Journal Staff";
              let dateStr = article.date;
              
              if (article.date.startsWith("By ")) {
                const parts = article.date.replace(/^By\s+/, '').split('•');
                authorName = parts[0].trim();
                dateStr = parts.slice(1).join('•').trim() || "";
              }

              return (
                <article key={index} className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start pb-8 border-b border-zinc-100 last:border-b-0 last:pb-0 cursor-pointer group">
                  <div className="relative w-full sm:w-[220px] md:w-[240px] aspect-[16/10] flex-shrink-0 overflow-hidden bg-gray-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      onError={(e) => { e.currentTarget.src = "/ai_hero.png"; }}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-[17px] md:text-[18px] font-bold leading-[1.25] text-black group-hover:text-[#BF1E2D] transition-colors mb-2">
                      {article.title}
                    </h3>
                    <p className="text-[13px] md:text-[13.5px] text-zinc-700 leading-relaxed mb-2.5 font-sans">
                      {article.description}
                    </p>
                    <div className="text-[11.5px] text-zinc-500 font-sans">
                      By <Link href={`/author/${authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="underline hover:text-[#BF1E2D] cursor-pointer text-black font-semibold">{authorName}</Link> {dateStr && `• ${dateStr}`}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 mt-10 pt-4 border-t border-gray-100 text-xs font-bold text-gray-500 uppercase select-none">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="hover:bg-gray-100 px-3 py-2 cursor-pointer transition-colors text-gray-700 font-bold mr-2"
              >
                Previous Page
              </button>
            )}

            {getPageNumbers().map((page, idx) => (
              typeof page === 'number' ? (
                <button
                  key={idx}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 cursor-pointer transition-colors ${
                    currentPage === page
                      ? 'bg-[#CC3333] text-white font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={idx} className="px-2 py-2 text-gray-400">
                  {page}
                </span>
              )
            ))}

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="hover:bg-gray-100 px-4 py-2 cursor-pointer ml-4 transition-colors text-gray-700 font-bold"
              >
                Next Page
              </button>
            )}
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
