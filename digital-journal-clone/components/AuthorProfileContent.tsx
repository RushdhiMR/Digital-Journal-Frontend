"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ArticleItem {
  category: string;
  href: string;
  title: string;
  desc: string;
  date: string;
  image: string;
}

interface SidebarItem {
  rank: number;
  href: string;
  title: string;
  views: string;
}

interface AuthorProfileContentProps {
  slug: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  initialArticles: ArticleItem[];
  mostReadSidebar: SidebarItem[];
}

export default function AuthorProfileContent({
  slug,
  author,
  initialArticles,
  mostReadSidebar,
}: AuthorProfileContentProps) {
  const [articlesList, setArticlesList] = useState<ArticleItem[]>(initialArticles);

  useEffect(() => {
    try {
      const localPostsStr = localStorage.getItem("dj_writer_submitted_articles");
      if (localPostsStr) {
        const localPosts: any[] = JSON.parse(localPostsStr);
        const slugClean = slug.toLowerCase().replace(/-/g, " ");

        const publishedByAuthor = localPosts.filter((post) => {
          if (post.status !== "Published") return false;
          const pName = (post.authorName || "").toLowerCase();
          const pEmail = (post.authorEmail || "").toLowerCase();
          return (
            pName.includes(slugClean) ||
            slugClean.includes(pName) ||
            pEmail.includes(slug.split("-")[0]) ||
            pName.includes(author.name.toLowerCase())
          );
        });

        if (publishedByAuthor.length > 0) {
          const mappedArticles: ArticleItem[] = publishedByAuthor.map((post) => ({
            category: (post.category || "BUSINESS").toUpperCase(),
            href: "/business/companies/new-exclusive-decoration-design-fit-out-llc-structural-acrylic-pioneers-in-the-uae",
            title: post.title,
            desc: post.summary || post.content.replace(/<[^>]*>?/gm, "").slice(0, 160) + "...",
            date: `BY ${author.name.toUpperCase()} • ${post.date ? post.date.toUpperCase() : "JUL 2026"}`,
            image: post.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=350&fit=crop",
          }));

          // Merge local published articles at the top (avoiding exact title dupes)
          const merged = [...mappedArticles];
          initialArticles.forEach((art) => {
            if (!merged.some((m) => m.title.trim().toLowerCase() === art.title.trim().toLowerCase())) {
              merged.push(art);
            }
          });
          setArticlesList(merged);
        }
      }
    } catch (e) {
      console.warn("Could not load dynamic author articles:", e);
    }
  }, [slug, author.name, initialArticles]);

  return (
    <main className="min-h-screen bg-white font-standard-sans">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        
        {/* Author Bio Header Card */}
        <div className="flex flex-col sm:flex-row items-start gap-6 pb-8 mb-8 border-b border-zinc-200">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-zinc-300">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col">
            <h1 className="font-serif text-[32px] font-bold text-black leading-none mb-1">
              {author.name}
            </h1>
            <span className="text-[10.5px] font-bold text-[#BF1E2D] uppercase tracking-wider mb-3">
              {author.role}
            </span>
            <p className="text-[13.5px] text-zinc-600 leading-relaxed max-w-3xl">
              {author.bio}
            </p>
          </div>
        </div>

        {/* Section Title: MORE FROM [AUTHOR] */}
        <div className="border-b-2 border-black pb-2 mb-8">
          <h2 className="text-[14px] font-bold text-black uppercase tracking-wider">
            MORE FROM {author.name.toUpperCase()}
          </h2>
        </div>

        {/* 8 Cols / 4 Cols Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Author Articles List */}
          <div className="lg:col-span-8 space-y-8">
            {articlesList.map((article, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-5 pb-8 border-b border-zinc-100 last:border-none group cursor-pointer">
                {/* Thumbnail Image */}
                <Link href={article.href} className="relative w-full sm:w-[210px] h-[135px] flex-shrink-0 overflow-hidden bg-gray-100 rounded-sm border border-zinc-200 block">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Article Info */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#1D9BF0] uppercase tracking-wider mb-1">
                    {article.category}
                  </span>
                  <Link href={article.href} className="font-serif text-[18px] md:text-[20px] font-bold leading-snug text-black group-hover:text-[#BF1E2D] transition-colors mb-2">
                    {article.title}
                  </Link>
                  <p className="text-[13px] text-zinc-600 leading-relaxed font-sans line-clamp-2 mb-3">
                    {article.desc}
                  </p>
                  <span className="text-[10.5px] text-zinc-400 font-bold tracking-wide font-sans">
                    {article.date}
                  </span>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2 pt-6 font-sans text-[12px]">
              <button className="px-4 py-2 border border-zinc-200 text-zinc-400 font-bold cursor-not-allowed bg-zinc-50">
                PREV
              </button>
              <button className="w-9 h-9 border border-[#BF1E2D] bg-[#BF1E2D] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-9 h-9 border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-100 flex items-center justify-center">
                2
              </button>
              <button className="px-4 py-2 border border-zinc-200 text-zinc-800 font-bold hover:bg-zinc-100 cursor-pointer">
                NEXT
              </button>
            </div>
          </div>

          {/* Right Column: Sidebar (MOST READ + Ad Banner) */}
          <div className="lg:col-span-4 lg:pl-2 space-y-8">
            
            {/* MOST READ Card Widget */}
            <div className="border border-zinc-200 rounded p-6 bg-white shadow-xs">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-zinc-200">
                <span className="text-[#1D9BF0]">📈</span>
                <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">
                  MOST READ
                </h3>
              </div>

              <div className="space-y-4">
                {mostReadSidebar.map((item) => (
                  <div key={item.rank} className="flex gap-3 items-start border-b border-zinc-100 pb-3 last:border-none group cursor-pointer">
                    <span className="text-[20px] font-serif font-bold text-zinc-300 group-hover:text-[#BF1E2D] leading-none pt-0.5">
                      {item.rank}
                    </span>
                    <div className="flex flex-col">
                      <Link href={item.href} className="font-serif text-[12.5px] font-bold text-black leading-snug hover:text-[#BF1E2D] transition-colors mb-1 block">
                        {item.title}
                      </Link>
                      <span className="text-[10px] text-zinc-400 font-sans">{item.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsored Editorial Ad Card */}
            <div className="relative w-full aspect-[4/3] bg-zinc-900 rounded overflow-hidden shadow-md flex items-end p-6 cursor-pointer group">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=450&fit=crop"
                alt="Luxury Fashion Editorial"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div className="relative z-10 text-white font-serif">
                <p className="text-[22px] font-bold tracking-[2px] uppercase leading-tight mb-1">
                  LOUIS VUITTON
                </p>
                <p className="text-[10px] uppercase tracking-[1px] text-zinc-300 font-sans">
                  Le Monogram, Transcending Generations Since 1896
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
