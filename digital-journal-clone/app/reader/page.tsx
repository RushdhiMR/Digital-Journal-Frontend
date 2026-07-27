"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Bookmark, Bell, History, ArrowRight, Star } from "lucide-react";

export default function ReaderHubPage() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string } | null>(null);

  const savedArticles = [
    {
      title: "Argentina Edge Switzerland in Extra Time to Set Up World Cup Semi-Final Clash With England",
      category: "SPORTS",
      href: "/news/world/argentina-edge-switzerland-in-extra-time-to-set-up-world-cup-semi-final-clash-with-england",
      date: "Jul 12, 2026",
      image: "/argentina_vs_switzerland.png"
    },
    {
      title: "U.S. Stocks End Higher as SK Hynix's Wall Street Debut and Meta's AI Momentum Lift Markets",
      category: "BUSINESS",
      href: "/news/markets/us-stocks-end-higher-as-sk-hynixs-wall-street-debut-and-metas-ai-momentum-lift-markets",
      date: "Jul 18, 2026",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=350&fit=crop"
    },
    {
      title: "Trump's Hormuz Retreat Highlights Struggles to End Iran Conflict",
      category: "POLITICS",
      href: "/news/politics/trumps-hormuz-retreat-highlights-struggles-to-end-iran-conflict",
      date: "Jul 15, 2026",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=350&fit=crop"
    }
  ];

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("dj_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      } else {
        const readerUser = { name: "Alex Reader", email: "reader@digitaljournal.com", role: "Reader" };
        localStorage.setItem("dj_user", JSON.stringify(readerUser));
        setCurrentUser(readerUser);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-standard-sans">
      <Header />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8">
        
        {/* Reader Header Card */}
        <div className="bg-zinc-900 text-white rounded-xl p-6 md:p-8 mb-8 shadow-xl border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
              <BookOpen size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold font-serif">Reader Preferences Hub</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  READER ROLE
                </span>
              </div>
              <p className="text-zinc-400 text-sm mt-1">
                Welcome back, <span className="text-white font-medium">{currentUser?.name || "Reader"}</span> ({currentUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Show Writer Studio ONLY to Writers & Admins */}
            {(currentUser?.role === "Writer" || currentUser?.role === "Admin" || currentUser?.role === "Co-Admin") && (
              <Link
                href="/writer"
                className="flex-1 md:flex-none text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold px-4 py-2.5 rounded transition-all cursor-pointer"
              >
                Writer Studio
              </Link>
            )}

            {/* Show Admin Dashboard ONLY to Admins & Co-Admins */}
            {(currentUser?.role === "Admin" || currentUser?.role === "Co-Admin") && (
              <Link
                href="/admin"
                className="flex-1 md:flex-none text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold px-4 py-2.5 rounded transition-all cursor-pointer"
              >
                Admin Dashboard
              </Link>
            )}

            <Link
              href="/news"
              className="flex-1 md:flex-none text-center bg-[#BF1E2D] hover:bg-red-800 text-white text-xs font-bold px-4 py-2.5 rounded transition-all cursor-pointer shadow"
            >
              Browse Latest News
            </Link>
          </div>
        </div>

        {/* Reader Features Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Saved Reading List */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold text-black font-serif flex items-center gap-2">
                <Bookmark size={20} className="text-[#BF1E2D]" />
                Saved Reading List ({savedArticles.length})
              </h2>
              <Link href="/news" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Browse Latest Stories <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-6">
              {savedArticles.map((art, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-5 pb-6 border-b border-zinc-100 last:border-none group">
                  <Link href={art.href} className="relative w-full sm:w-[200px] h-[130px] flex-shrink-0 overflow-hidden bg-gray-100 rounded border border-zinc-200 block">
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#1D9BF0] uppercase tracking-wider mb-1">
                      {art.category}
                    </span>
                    <Link href={art.href} className="font-serif text-[18px] font-bold text-black group-hover:text-[#BF1E2D] transition-colors leading-snug mb-2">
                      {art.title}
                    </Link>
                    <span className="text-[11px] text-zinc-400 font-sans mt-auto">{art.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reader Preferences & Subscriptions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Newsletter Preferences Card */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-200">
                <Bell size={18} className="text-zinc-700" />
                <h3 className="text-base font-bold text-black font-serif">Newsletter Digest</h3>
              </div>
              <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
                Receive daily executive briefings and market summaries directly in your inbox.
              </p>
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-xs text-zinc-800 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#BF1E2D] w-4 h-4" />
                  Daily Breaking News Digest
                </label>
                <label className="flex items-center gap-2.5 text-xs text-zinc-800 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#BF1E2D] w-4 h-4" />
                  Technology & AI Weekly Analysis
                </label>
                <label className="flex items-center gap-2.5 text-xs text-zinc-800 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#BF1E2D] w-4 h-4" />
                  Financial Markets Telemetry
                </label>
              </div>
            </div>

            {/* Favorite Topics */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-200">
                <Star size={18} className="text-amber-500" />
                <h3 className="text-base font-bold text-black font-serif">Favorite Topics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Artificial Intelligence", "Markets", "Biotech", "Energy", "Politics", "Clean Tech"].map((topic, i) => (
                  <span key={i} className="text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1 rounded-full cursor-pointer transition-colors">
                    + {topic}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
