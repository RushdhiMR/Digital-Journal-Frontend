"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FastStartNewsletterBanner from "@/components/FastStartNewsletterBanner";
import { CheckCircle2, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { generateAutoSEO } from "@/lib/seo";
import { getUserProfile } from "@/lib/userProfiles";

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

function parseCaptionAndCredit(rawCaption: string, rawCredit?: string) {
  if (rawCredit && rawCredit.trim()) {
    const cleanCredit = rawCredit.trim().replace(/^\(?(photo:?\s*)?/i, "").replace(/\)?$/, "");
    return {
      caption: rawCaption.trim(),
      credit: `(PHOTO: ${cleanCredit.toUpperCase()})`
    };
  }

  const str = (rawCaption || "").trim();
  if (!str) {
    return { caption: "", credit: "" };
  }

  const bracketMatch = str.match(/\((?:photo:?\s*)?([^)]+)\)$/i);
  if (bracketMatch) {
    const creditText = bracketMatch[1].trim().toUpperCase();
    const cleanCaption = str.replace(bracketMatch[0], "").trim();
    const formattedCredit = creditText.startsWith("PHOTO:") ? `(${creditText})` : `(PHOTO: ${creditText})`;
    return {
      caption: cleanCaption || str,
      credit: formattedCredit
    };
  }

  const dashMatch = str.match(/—\s*photo\s+courtesy\s+of\s+(.+)$/i);
  if (dashMatch) {
    const creditText = dashMatch[1].trim().toUpperCase();
    const cleanCaption = str.replace(dashMatch[0], "").trim();
    return {
      caption: cleanCaption || str,
      credit: `(PHOTO: ${creditText})`
    };
  }

  return {
    caption: str,
    credit: "(PHOTO: DIGITAL JOURNAL)"
  };
}

function parseHtmlToParagraphs(html: string): string[] {
  if (!html) return [];
  
  const cleanHtml = html
    .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|blockquote)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");

  const decoded = cleanHtml
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return decoded
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);
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
    const role = (user.role || "").toLowerCase();
    const email = user.email.trim().toLowerCase();
    if (role === "writer" || role === "admin" || role === "co-admin" || email.includes("writer") || email.includes("admin") || email.includes("coadmin")) {
      return null;
    }
    const sanitizedEmail = email.replace(/[^a-z0-9]/g, "_");
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

  const [activeNewsData, setActiveNewsData] = useState<ArticleData>(newsData);

  useEffect(() => {
    try {
      const savedStr = localStorage.getItem("dj_writer_submitted_articles");
      if (savedStr) {
        const posts: any[] = JSON.parse(savedStr);
        const currentTitle = (newsData.title || "").trim().toLowerCase();
        const currentPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";

        const matched = posts.find((p) => {
          if (!p || p.status !== "Published") return false;
          const pTitle = (p.title || "").trim().toLowerCase();
          const pSlug = pTitle.replace(/[^a-z0-9]+/g, "-");
          return (
            currentTitle.includes(pTitle) ||
            pTitle.includes(currentTitle) ||
            currentPath.includes(pSlug) ||
            (currentTitle.length > 5 && pTitle.slice(0, 15) === currentTitle.slice(0, 15))
          );
        });

        if (matched) {
          let realAuthorName = matched.authorName || "Rushdhi MR";
          let realAuthorAvatar = matched.authorAvatar;
          let realAuthorBio = matched.authorBio || "Journalist for Digital Journal.";

          if (matched.authorEmail) {
            const prof = getUserProfile(matched.authorEmail);
            if (prof) {
              realAuthorName = prof.name || realAuthorName;
              realAuthorAvatar = prof.avatar || realAuthorAvatar;
              realAuthorBio = prof.bio || realAuthorBio;
            }
          }

          try {
            const activeUserStr = localStorage.getItem("dj_user") || localStorage.getItem("dj_writer_user");
            if (activeUserStr) {
              const activeUser = JSON.parse(activeUserStr);
              if (activeUser?.name && activeUser.name.toLowerCase().trim() === realAuthorName.toLowerCase().trim()) {
                if (activeUser.avatar) realAuthorAvatar = activeUser.avatar;
              }
            }
          } catch (e) {}

          let paragraphs: string[] = [];
          if (matched.content) {
            paragraphs = parseHtmlToParagraphs(matched.content);
          }
          if (paragraphs.length === 0) {
            paragraphs = [matched.summary || matched.title];
          }

          setActiveNewsData({
            title: matched.title,
            authorName: realAuthorName,
            authorAvatar: realAuthorAvatar || "",
            authorBio: realAuthorBio,
            date: matched.date || "Just now",
            image: matched.imageUrl || newsData.image,
            caption: matched.summary || matched.title,
            sections: [
              {
                heading: "",
                paragraphs: paragraphs
              }
            ]
          });
        } else {
          setActiveNewsData(newsData);
        }
      }
    } catch (e) {
      console.warn("Could not load published article details:", e);
    }
  }, [newsData]);

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
          (item) => item.title.trim().toLowerCase() === activeNewsData.title.trim().toLowerCase()
        );
        setIsBookmarked(exists);
      } else {
        setIsBookmarked(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeNewsData.title]);

  const toggleBookmark = () => {
    const activeUser = getLoggedInUser();
    if (!activeUser) {
      // NON-LOGGED IN USER: Require Sign Up / Login!
      setIsAuthModalOpen(true);
      return;
    }

    // DISALLOW BOOKMARKING FOR WRITERS & ADMINS
    const role = (activeUser.role || "").toLowerCase();
    const email = (activeUser.email || "").toLowerCase();
    const isStaffOrAdmin =
      role === "writer" ||
      role === "admin" ||
      role === "co-admin" ||
      email.includes("writer") ||
      email.includes("admin") ||
      email.includes("coadmin");

    if (isStaffOrAdmin) {
      showToast("🚫 Bookmarking is available for Reader accounts only.");
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

  const getAuthorLinkedin = () => {
    try {
      const activeUserStr = localStorage.getItem("dj_user") || localStorage.getItem("dj_writer_user");
      if (activeUserStr) {
        const activeUser = JSON.parse(activeUserStr);
        if (activeUser.linkedin && activeUser.linkedin.trim()) {
          return activeUser.linkedin.trim();
        }
      }

      const dbStr = localStorage.getItem("dj_user_profiles_db");
      if (dbStr) {
        const profiles = JSON.parse(dbStr);
        const match: any = Object.values(profiles).find(
          (p: any) => p.name && p.name.toLowerCase().trim() === newsData.authorName.toLowerCase().trim()
        );
        if (match?.linkedin && match.linkedin.trim()) {
          return match.linkedin.trim();
        }
      }
    } catch (e) {}
    return "https://www.linkedin.com";
  };

  const authorLinkedinUrl = getAuthorLinkedin();

  const autoSEO = generateAutoSEO({
    title: newsData.title,
    content: newsData.sections?.flatMap((s) => s.paragraphs).join(" ") || "",
    category,
    subcategory,
    authorName: newsData.authorName,
    imageUrl: newsData.image,
    imageCaption: newsData.caption,
    publishedAt: newsData.date
  });

  return (
    <main className="min-h-screen bg-white font-standard-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(autoSEO.jsonLdSchema)
        }}
      />
      <Header />

      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-bold py-2.5 px-6 rounded-full border border-zinc-700 shadow-2xl flex items-center justify-center gap-2 animate-bounce z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ARTICLE WRAPPER */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 pt-6 pb-16 font-sans">
        
        {/* Top Utility Bar */}
        <div className="flex items-center justify-between py-2.5 mb-4 text-[12px] font-sans text-zinc-500 border-b border-zinc-100">
          <Link
            href={`/${category}`}
            className="flex items-center gap-1.5 hover:text-black font-semibold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            Back to {parent.name}
          </Link>

          <div className="flex items-center gap-4">
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
          {activeNewsData.title}
        </h1>

        {/* Subheadline */}
        <p className="font-serif text-[17px] md:text-[19px] text-zinc-600 italic leading-relaxed mb-6">
          {activeNewsData.caption ? activeNewsData.caption.split('.')[0] + '.' : 'Independent analysis and verified reporting on key regulatory policy changes.'}
        </p>

        {/* Author Metadata Bar */}
        <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-zinc-200 font-sans">
          <Link href={`/author/${activeNewsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-11 h-11 rounded-full overflow-hidden bg-[#1E293B] flex-shrink-0 border border-zinc-300 hover:opacity-80 transition-opacity flex items-center justify-center text-white font-bold text-sm">
            {activeNewsData.authorAvatar && activeNewsData.authorAvatar.length > 5 ? (
              <img src={activeNewsData.authorAvatar} alt={activeNewsData.authorName} className="w-full h-full object-cover" />
            ) : (
              <span>{(activeNewsData.authorName || "RM").slice(0, 2).toUpperCase()}</span>
            )}
          </Link>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[14px] font-bold text-black font-sans leading-tight">
                By <Link href={`/author/${activeNewsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="underline hover:text-[#BF1E2D] transition-colors">{activeNewsData.authorName}</Link>
              </p>
              <svg className="w-4 h-4 text-[#1D9BF0]" fill="currentColor" viewBox="0 0 24 24">
                <title>Verified Journalist</title>
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.34-1.89-4.24-4.23-4.24-.496 0-.966.084-1.4.238C14.31 2.225 12.94 1.35 11.36 1.35c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.34 0-4.24 1.89-4.24 4.23 0 .496.084.966.238 1.4C1.225 9.55.35 10.92.35 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.34 1.89 4.24 4.23 4.24.496 0 .966-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.34 0 4.24-1.89 4.24-4.23 0-.496-.084-.966-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.28 4.29l-4.11-4.11 1.41-1.41 2.7 2.7 6.44-6.44 1.41 1.41-7.85 7.85z"/>
              </svg>

              {/* Author LinkedIn Icon Symbol */}
              <a
                href={authorLinkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 inline-flex items-center text-[#0A66C2] hover:text-[#004182] transition-colors p-0.5"
                title={`Connect with ${activeNewsData.authorName} on LinkedIn`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
            <p className="text-[12px] text-zinc-500 mt-0.5">{activeNewsData.date}</p>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[16/8.5] overflow-hidden bg-gray-100 mb-2 rounded-sm border border-zinc-200">
          <img
            src={activeNewsData.image}
            alt={activeNewsData.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Caption & Photo Credit Row matching User Screenshot */}
        {(() => {
          const info = parseCaptionAndCredit(activeNewsData.caption, (activeNewsData as any).credit);
          return (
            <div className="flex items-center justify-between gap-4 mt-2.5 mb-8 font-sans text-[12px] text-zinc-500 border-b border-zinc-100 pb-3">
              <span className="italic leading-normal font-sans text-zinc-600">
                {info.caption}
              </span>
              {info.credit && (
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-sans flex-shrink-0">
                  {info.credit}
                </span>
              )}
            </div>
          );
        })()}

        {/* Body Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6 items-start">
          
          {/* Left Column: Main News content */}
          <div className="lg:col-span-8 flex flex-col">

            {/* News Body Sections */}
            <div className="space-y-6 font-serif text-[17px] md:text-[18px] text-zinc-900 leading-[1.8] tracking-normal mt-2">
              {activeNewsData.sections.map((sec, secIdx) => {
                const isMultiSection = activeNewsData.sections.length > 1;
                const midSectionIndex = Math.max(0, Math.floor(activeNewsData.sections.length / 2) - 1);
                const midParagraphIndex = Math.max(0, Math.floor(sec.paragraphs.length / 2) - 1);

                return (
                  <div key={secIdx} className="space-y-5">
                    {sec.heading && (
                      <h2 className="font-serif text-[22px] md:text-[24px] font-bold text-black mt-8 mb-3 leading-snug">
                        {sec.heading}
                      </h2>
                    )}
                    {sec.paragraphs.map((p, pIdx) => (
                      <div key={pIdx} className="space-y-5">
                        <p className="text-zinc-900">{p}</p>

                        {/* If single section, insert Newsletter Banner in middle of paragraphs */}
                        {!isMultiSection && pIdx === midParagraphIndex && (
                          <div className="my-8">
                            <FastStartNewsletterBanner />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* If multiple sections, insert Newsletter Banner in middle of sections */}
                    {isMultiSection && secIdx === midSectionIndex && (
                      <div className="my-8">
                        <FastStartNewsletterBanner />
                      </div>
                    )}
                  </div>
                );
              })}
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

      </div>

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
