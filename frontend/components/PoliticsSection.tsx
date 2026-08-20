"use client";

import Link from "next/link";
import { useLiveArticles, ArticleItem, isTopPlacementArticle, articleMatchesCategory } from "@/lib/articlesSync";

const FALLBACK_POLITICS_ARTICLES = [
  {
    id: "pol-1",
    title: "Global Leaders Summit Reaches Milestone Consensus on Climate and Energy Accord",
    description: "Multilateral delegates conclude intensive negotiations in Geneva, establishing binding milestones for clean energy investment and carbon reduction.",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=480&fit=crop",
    href: "/politics/global-leaders-summit-climate-accord"
  },
  {
    id: "pol-2",
    title: "Parliamentary Committee Unveils Comprehensive Legislative Package for Digital Privacy",
    description: "The bipartisan privacy bill introduces strict algorithmic transparency requirements and enhanced consumer rights across all digital platforms.",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=480&fit=crop",
    href: "/politics/parliamentary-committee-digital-privacy-bill"
  }
];

export default function PoliticsSection() {
  const { articles: liveArticles = [] } = useLiveArticles();

  // Filter politics articles (Exclude top placement articles to prevent duplicate news)
  const politicsLive = (Array.isArray(liveArticles) ? liveArticles : []).filter((art: ArticleItem) => {
    if (!art || (art.status || "").toLowerCase() !== "published") return false;
    if (isTopPlacementArticle(art)) return false;
    return articleMatchesCategory(art, "politics") || articleMatchesCategory(art, "government") || articleMatchesCategory(art, "elections");
  });

  const mappedLive = politicsLive.map((a: ArticleItem) => ({
    id: a.id,
    title: a.title,
    description: a.description || a.summary || "",
    image: a.imageUrl || a.image || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=480&fit=crop",
    href: `/${(a.category || "news").toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}/${a.slug || String(a.id)}?id=${a.id}`
  }));

  const displayArticles = mappedLive.length >= 2
    ? mappedLive.slice(0, 2)
    : (mappedLive.length > 0 ? [...mappedLive, ...FALLBACK_POLITICS_ARTICLES].slice(0, 2) : FALLBACK_POLITICS_ARTICLES);

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 border-b border-gray-200 font-sans">
      {/* Red Bar Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-6 bg-[#D31220]" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Politics
        </h2>
      </div>

      {/* 2 Equal 50/50 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayArticles.map((article) => (
          <article key={article.id} className="flex flex-col group cursor-pointer">
            <Link
              href={article.href}
              className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-none mb-4 block"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <h3 className="text-xl font-bold leading-snug text-gray-900 group-hover:text-[#D31220] transition-colors mb-2 font-serif">
              <Link href={article.href}>
                {article.title}
              </Link>
            </h3>

            <p className="text-[13px] text-gray-600 leading-relaxed font-sans">
              {article.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
