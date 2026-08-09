"use client";

import { useState, useRef } from "react";

interface Article {
  title: string;
  description: string;
  date: string;
  image: string;
}

interface CategoryListProps {
  categoryName: string;
  articles: Article[];
}

export default function CategoryList({ categoryName, articles }: CategoryListProps) {
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

  const displayedArticles = articles.map((art) => {
    if (currentPage === 1) return art;
    return {
      ...art,
      title: `${art.title} (Page ${currentPage})`
    };
  });

  return (
    <section ref={sectionRef} className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 border-t border-gray-200">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-black uppercase">
          Latest in {categoryName} {currentPage > 1 && <span className="text-gray-400 font-normal text-sm lowercase">(page {currentPage} of {totalPages})</span>}
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">
          More stories and trends from our global correspondents
        </p>
      </div>

      <div className="space-y-8 max-w-[960px]">
        {displayedArticles.map((item, index) => (
          <article key={index} className="flex gap-5 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 cursor-pointer group">
            {/* Thumbnail */}
            <div className="relative w-[130px] md:w-[170px] h-[90px] md:h-[110px] flex-shrink-0 overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
            {/* Content */}
            <div className="flex flex-col justify-start">
              <h3 className="text-[14.5px] font-bold leading-tight text-black group-hover:text-red-600 transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-[12.5px] text-gray-600 mb-2 leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <p className="text-[11px] text-gray-400 font-normal">{item.date}</p>
            </div>
          </article>
        ))}
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
