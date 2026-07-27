"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FastStartNewsletterBanner from "@/components/FastStartNewsletterBanner";
import { CheckCircle2, Bookmark, Share2, ArrowLeft } from "lucide-react";

interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

interface ArticleData {
  title: string;
  authorName: string;
  authorAvatar: string;
  authorBio: string;
  date: string;
  image: string;
  caption: string;
  sections: ArticleSection[];
}

interface SidebarItem {
  title: string;
  date: string;
  image: string;
  href: string;
}

interface ArticlePageContentProps {
  category: string;
  subcategory: string;
  parent: { name: string; color: string; desc: string };
  subName: string;
  newsData: ArticleData;
  sidebarPicks: SidebarItem[];
}

const getLoggedInUser = (): any | null => {
  try {
    const userStr = localStorage.getItem("dj_user") || localStorage.getItem("dj_writer_user") || localStorage.getItem("dj_admin_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.email) return user;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

const getUserBookmarkStorageKey = (): string | null => {
  const user = getLoggedInUser();
  if (user?.email) {
    const sanitizedEmail = user.email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
    return `dj_bookmarks_${sanitizedEmail}`;
  }
  return null;
};

export default function ArticlePageContent({
  category,
  subcategory,
  parent,
  subName,
  newsData,
  sidebarPicks,
}: ArticlePageContentProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const articleHref = `/${category}/${subcategory}`;

  useEffect(() => {
    try {
      const key = getUserBookmarkStorageKey();
      if (!key) {
        setIsBookmarked(false);
        return;
      }
      const savedStr = localStorage.getItem(key);
      if (savedStr) {
        const savedList: any[] = JSON.parse(savedStr);
        const exists = savedList.some(
          (item) => item.title.trim().toLowerCase() === newsData.title.trim().toLowerCase()
        );
        setIsBookmarked(exists);
      } else {
        setIsBookmarked(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [newsData.title]);

  const toggleBookmark = () => {
    const activeUser = getLoggedInUser();
    if (!activeUser) {
      // NON-LOGGED IN USER: Require Sign Up / Login!
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const key = getUserBookmarkStorageKey();
      if (!key) {
        setIsAuthModalOpen(true);
        return;
      }
      const savedStr = localStorage.getItem(key);
      let savedList: any[] = savedStr ? JSON.parse(savedStr) : [];

      const existsIndex = savedList.findIndex(
        (item) => item.title.trim().toLowerCase() === newsData.title.trim().toLowerCase()
      );

      if (existsIndex >= 0) {
        // Remove bookmark from account
        savedList.splice(existsIndex, 1);
        localStorage.setItem(key, JSON.stringify(savedList));
        setIsBookmarked(false);
        showToast("Article removed from your Saved Reading List.");
      } else {
        // Add bookmark to account
        const newBookmark = {
          title: newsData.title,
          category: parent.name.toUpperCase(),
          href: articleHref,
          date: newsData.date.split("•")[0].trim() || "Jul 2026",
          image: newsData.image,
          savedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        };
        savedList.unshift(newBookmark);
        localStorage.setItem(key, JSON.stringify(savedList));
        setIsBookmarked(true);
        showToast("✓ Article saved to your personal account reading list!");
      }
    } catch (e) {
      console.error(e);
      showToast("❌ Could not update saved reading list.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <main className="min-h-screen bg-white font-standard-sans">
      <Header />

      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-bold py-2.5 px-6 rounded-full border border-zinc-700 shadow-2xl flex items-center justify-center gap-2 animate-bounce z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* News Article Container */}
      <article className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        
        {/* Top Utility Bar matching reference design */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-6 font-sans">
          <Link href="/" className="text-[12px] font-medium text-zinc-500 hover:text-black transition-colors flex items-center gap-1">
            ‹ Back to Newsroom
          </Link>

          <div className="flex items-center gap-4 text-zinc-500 text-[12px]">
            <div className="flex items-center gap-1.5 border border-zinc-200 rounded px-2 py-0.5 bg-zinc-50">
              <button className="hover:text-black font-bold cursor-pointer">A-</button>
              <span className="text-zinc-300">|</span>
              <button className="hover:text-black font-bold cursor-pointer">A+</button>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: newsData.title, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Link copied to clipboard!");
                }
              }}
              className="hover:text-black transition-colors cursor-pointer flex items-center gap-1"
              title="Share article"
            >
              <Share2 size={15} />
            </button>

            {/* Bookmark Icon Button */}
            <button
              onClick={toggleBookmark}
              className={`transition-colors cursor-pointer p-1 rounded hover:bg-zinc-100 flex items-center gap-1.5 ${
                isBookmarked ? "text-[#BF1E2D] font-bold" : "text-zinc-500 hover:text-black"
              }`}
              title={isBookmarked ? "Remove from Saved Reading List" : "Save to Reader Reading List"}
            >
              <Bookmark
                size={18}
                className={isBookmarked ? "fill-[#BF1E2D] text-[#BF1E2D]" : ""}
              />
              <span className="text-[11px] font-bold hidden sm:inline">
                {isBookmarked ? "SAVED" : "SAVE"}
              </span>
            </button>
          </div>
        </div>

        {/* Category Tag */}
        <div className="text-[11px] font-bold text-[#BF1E2D] uppercase tracking-wider mb-2 font-standard-sans flex items-center gap-2">
          <Link href={`/${category}`} className="hover:underline">{parent.name}</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-700">{subName}</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-[32px] sm:text-[38px] md:text-[42px] font-bold leading-[1.18] text-black mb-4 tracking-tight">
          {newsData.title}
        </h1>

        {/* Subheadline */}
        <p className="font-serif text-[17px] md:text-[19px] text-zinc-600 italic leading-relaxed mb-6">
          {newsData.caption ? newsData.caption.split('.')[0] + '.' : 'Independent analysis and verified reporting on key regulatory policy changes.'}
        </p>

        {/* Author Metadata Bar */}
        <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-zinc-200 font-sans">
          <Link href={`/author/${newsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-zinc-300 hover:opacity-80 transition-opacity">
            <img src={newsData.authorAvatar} alt={newsData.authorName} className="w-full h-full object-cover" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[14px] font-bold text-black font-sans leading-tight">
                By <Link href={`/author/${newsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="underline hover:text-[#BF1E2D] transition-colors">{newsData.authorName}</Link>
              </p>
              <svg className="w-4 h-4 text-[#1D9BF0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.34-1.89-4.24-4.23-4.24-.496 0-.966.084-1.4.238C14.31 2.225 12.94 1.35 11.36 1.35c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.34 0-4.24 1.89-4.24 4.23 0 .496.084.966.238 1.4C1.225 9.55.35 10.92.35 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.34 1.89 4.24 4.23 4.24.496 0 .966-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.34 0 4.24-1.89 4.24-4.23 0-.496-.084-.966-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.28 4.29l-4.11-4.11 1.41-1.41 2.7 2.7 6.44-6.44 1.41 1.41-7.85 7.85z"/>
              </svg>
            </div>
            <p className="text-[12px] text-zinc-500 mt-0.5">{newsData.date}</p>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[16/8.5] overflow-hidden bg-gray-100 mb-2 rounded-sm border border-zinc-200">
          <img
            src={newsData.image}
            alt={newsData.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Caption */}
        <p className="text-[12px] text-zinc-500 mb-8 leading-relaxed font-sans italic">
          {newsData.caption} — Photo courtesy of Digital Journal
        </p>

        {/* Body Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6 items-start">
          
          {/* Left Column: Main News content */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Google News Preferred Source Badge */}
            <button className="flex items-center gap-2.5 bg-black border border-zinc-800 rounded px-3 py-1.5 hover:bg-zinc-900 transition-colors mb-6 cursor-pointer max-w-max shadow-sm">
              <div className="flex items-center justify-center bg-white rounded-full p-1 w-5 h-5 flex-shrink-0">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div className="flex flex-col text-left font-sans">
                <span className="text-[9px] leading-tight text-zinc-400 font-normal">Add as a preferred</span>
                <span className="text-[9px] leading-tight text-white font-bold">source on Google</span>
              </div>
            </button>

            {/* News Body Sections */}
            <div className="space-y-6 font-serif text-[17px] md:text-[18px] text-zinc-900 leading-[1.8] tracking-normal mt-2">
              {newsData.sections.map((sec, secIdx) => (
                <div key={secIdx} className="space-y-5">
                  {sec.heading && (
                    <h2 className="font-serif text-[22px] md:text-[24px] font-bold text-black mt-8 mb-3 leading-snug">
                      {sec.heading}
                    </h2>
                  )}
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-zinc-900">{p}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Newsletter Callout Box */}
            <FastStartNewsletterBanner />

            {/* Bottom Author Profile Row */}
            <div className="flex gap-6 items-center border-t border-b border-zinc-200 py-8 my-8 font-standard-sans">
              <Link href={`/author/${newsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-zinc-300 hover:opacity-80 transition-opacity">
                <img src={newsData.authorAvatar} alt={newsData.authorName} className="w-full h-full object-cover grayscale" />
              </Link>
              <div className="flex flex-col text-left font-sans">
                <span className="text-[11px] text-black font-bold uppercase tracking-wider leading-none mb-2 font-standard-sans">WRITTEN BY</span>
                <Link href={`/author/${newsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-[20px] sm:text-[22px] font-bold text-black underline underline-offset-4 hover:text-[#BF1E2D] transition-colors leading-none">
                  {newsData.authorName}
                </Link>
                <p className="text-[13px] sm:text-[14px] text-zinc-800 mt-3 leading-relaxed">
                  {newsData.authorBio}
                </p>
              </div>
            </div>

            {/* Bottom Saved Stories Toggle Bar */}
            <div className="space-y-2 font-sans my-6 text-[12px] text-zinc-500">
              <div className="flex items-center gap-2 font-bold text-black uppercase tracking-wider text-[11.5px]">
                <span>💬 COMMENTS (0)</span>
              </div>
              <button
                onClick={toggleBookmark}
                className="text-[#BF1E2D] font-bold hover:underline cursor-pointer text-[13px] flex items-center gap-1.5 text-left"
              >
                <Bookmark size={16} className={isBookmarked ? "fill-[#BF1E2D]" : ""} />
                <span>
                  {isBookmarked ? "✓ Saved in your Reader Reading List (Click to Remove)" : "+ Add to your saved stories"}
                </span>
              </button>
            </div>

          </div>

          {/* Right Column: Sidebar Feed */}
          <div className="lg:col-span-4 lg:pl-4 font-standard-sans border-l border-zinc-100 lg:border-zinc-200 pt-2 lg:pt-0">
            <div className="border-b-2 border-black pb-2 mb-6 w-full flex items-center justify-between">
              <h3 className="text-[13.5px] font-bold text-black uppercase tracking-wider font-standard-sans">
                MOST POPULAR IN {parent.name.toUpperCase()}
              </h3>
            </div>

            <div className="space-y-5 font-sans">
              {sidebarPicks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex gap-3.5 items-start cursor-pointer group pb-4 border-b border-zinc-100 last:border-none"
                >
                  <div className="relative w-[75px] h-[65px] flex-shrink-0 overflow-hidden bg-gray-100 rounded border border-zinc-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-[13px] md:text-[13.5px] font-bold leading-snug text-black group-hover:text-[#BF1E2D] transition-colors mb-1 font-serif">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-normal font-sans">{item.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </article>

      {/* SIGN UP / LOGIN REQUIRED MODAL FOR GUESTS */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative font-sans text-center">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold cursor-pointer text-base"
            >
              ✕
            </button>

            <div className="w-14 h-14 bg-red-50 text-[#BF1E2D] rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-sm">
              <Bookmark size={28} className="fill-[#BF1E2D]" />
            </div>

            <h3 className="text-xl font-bold font-serif text-zinc-900 mb-2">
              Sign Up to Save Articles
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              Please sign up for a free account or sign in to save articles to your personal reading list and view your saved stories anytime.
            </p>

            <div className="space-y-3">
              <Link
                href="/register"
                className="block w-full py-3.5 bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="block w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer border border-zinc-200"
              >
                Sign In to Account
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
