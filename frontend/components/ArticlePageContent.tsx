"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FastStartNewsletterBanner from "@/components/FastStartNewsletterBanner";
import { CheckCircle2, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { generateAutoSEO } from "@/lib/seo";
import { getUserProfile, getAuthorAvatarByNameOrEmail } from "@/lib/userProfiles";
import { useLiveArticles } from "@/lib/articlesSync";
import { useAuth } from "@/lib/auth-context";

interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

interface ArticleData {
  title: string;
  authorName: string;
  authorAvatar: string;
  authorEmail?: string;
  authorBio: string;
  date: string;
  image: string;
  caption: string;
  sections: ArticleSection[];
  category?: string;
  subcategories?: string[];
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
    credit: "(PHOTO: LONDON BIGBEN)"
  };
}

function processContentLinks(html: string): string {
  if (!html) return "";
  let clean = html
    .replace(/<figure[\s\S]*?<\/figure>/gi, "")
    .replace(/<img[^>]*\/?>/gi, "");

  return clean.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    if (!/target\s*=/i.test(newAttrs)) {
      newAttrs += ' target="_blank"';
    } else {
      newAttrs = newAttrs.replace(/target=["'][^"']*["']/gi, 'target="_blank"');
    }
    if (!/rel\s*=/i.test(newAttrs)) {
      newAttrs += ' rel="noopener noreferrer"';
    } else {
      newAttrs = newAttrs.replace(/rel=["'][^"']*["']/gi, 'rel="noopener noreferrer"');
    }
    return `<a${newAttrs}>`;
  });
}

function parseHtmlToParagraphs(html: string): string[] {
  if (!html) return [];
  
  const cleanHtml = html
    .replace(/<figure[\s\S]*?<\/figure>/gi, "")
    .replace(/<img[^>]*\/?>/gi, "")
    .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  if (/<p[^>]*>/i.test(cleanHtml) || /<div[^>]*>/i.test(cleanHtml)) {
    const blocks = cleanHtml
      .split(/<\/(?:p|div|h1|h2|h3|h4|h5|h6|li|blockquote)>/gi)
      .map((block) => block.replace(/<br\s*\/?>/gi, " ").trim())
      .filter((block) => block.replace(/<[^>]+>/g, "").trim().length > 0);

    if (blocks.length > 0) {
      return blocks;
    }
  }

  return cleanHtml
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);
}

function ArticlePageContentInner({
  category,
  subcategory,
  parent,
  subName,
  newsData,
  sidebarPicks,
}: ArticlePageContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loginHref = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const resolveCleanAuthor = (rawName?: string, rawAvatar?: string, rawEmail?: string) => {
    let name = (rawName || "").trim();
    if (!name || name.toLowerCase() === "system administrator" || name.toLowerCase() === "administrator" || name.toLowerCase() === "admin" || name.toLowerCase() === "editor") {
      name = "Rushdhi MR";
    }

    let avatar = "";
    // 1. Lookup custom uploaded avatar from author profile database by name or email
    const accountAvatar = getAuthorAvatarByNameOrEmail(name, rawEmail || "");
    if (accountAvatar && accountAvatar.length > 5 && !accountAvatar.includes("cart") && !accountAvatar.includes("author_bluesuit")) {
      avatar = accountAvatar;
    }

    // 2. Direct database author avatar if not generic placeholder
    if (!avatar && rawAvatar && rawAvatar.length > 5 && !rawAvatar.includes("cart") && !rawAvatar.includes("author_bluesuit") && !rawAvatar.startsWith("data:image/svg")) {
      avatar = rawAvatar;
    }

    // 3. Use accountAvatar if present
    if (!avatar && accountAvatar && accountAvatar.length > 5 && !accountAvatar.includes("cart")) {
      avatar = accountAvatar;
    }

    // 4. Fallback based on known staff names
    if (!avatar) {
      const lower = name.toLowerCase();
      if (lower.includes("jennifer") || lower.includes("friesen")) avatar = "/author_woman.jpg";
      else if (lower.includes("april") || lower.includes("hicke")) avatar = "/author_glasses.jpg";
      else if (lower.includes("pramod") || lower.includes("jain")) avatar = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&h=250&fit=crop";
      else if (lower.includes("chris") || lower.includes("hogg")) avatar = "/author_beard.jpg";
      else if (rawAvatar && rawAvatar.length > 5) avatar = rawAvatar;
      else avatar = "/author_bluesuit.jpg";
    }

    return { name, avatar };
  };

  const initialAuthor = resolveCleanAuthor(newsData.authorName, newsData.authorAvatar);
  const [activeNewsData, setActiveNewsData] = useState<ArticleData>({
    ...newsData,
    authorName: initialAuthor.name,
    authorAvatar: initialAuthor.avatar,
    category: newsData.category || parent?.name || category,
    subcategories: newsData.subcategories || (subName ? [subName] : [])
  });
  const { articles: liveArticles } = useLiveArticles();

  useEffect(() => {
    try {
      if (Array.isArray(liveArticles)) {
        const currentTitle = (newsData.title || "").trim().toLowerCase();
        const currentPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";

        const matched = liveArticles.find((p) => {
          if (!p || p.status !== "Published") return false;
          const pTitle = (p.title || "").trim().toLowerCase();
          const pSlug = pTitle.replace(/[^a-z0-9]+/g, "-");
          return (
            currentTitle.includes(pTitle) ||
            pTitle.includes(currentTitle) ||
            currentPath.includes(pSlug) ||
            (p.slug && currentPath.includes(p.slug.toLowerCase())) ||
            (p.id && currentPath.includes(String(p.id))) ||
            (currentTitle.length > 5 && pTitle.slice(0, 15) === currentTitle.slice(0, 15))
          );
        });

        if (matched) {
          const realName = matched.authorName || (matched as any).author_name || (matched as any).author || "Staff Journalist";
          const realAvatar = matched.authorAvatar || (matched as any).author_avatar || "";
          const realEmail = matched.authorEmail || (matched as any).author_email || "";
          const resolved = resolveCleanAuthor(realName, realAvatar, realEmail);
          let realAuthorBio = matched.authorBio || (matched as any).author_bio || `${resolved.name} is a journalist for London BigBen.`;

          let paragraphs: string[] = [];
          if (matched.content) {
            paragraphs = parseHtmlToParagraphs(matched.content);
          }
          if (paragraphs.length === 0) {
            paragraphs = [matched.summary || matched.title];
          }

          const rawCategory = matched.category || matched.category_name || parent?.name || category || "NEWS";
          const rawSubcategories = Array.isArray(matched.subcategories) && matched.subcategories.length > 0
            ? matched.subcategories
            : (Array.isArray(matched.subCategories) && matched.subCategories.length > 0 ? matched.subCategories : (subName ? [subName] : []));

          setActiveNewsData({
            title: matched.title,
            authorName: resolved.name,
            authorAvatar: resolved.avatar,
            authorBio: realAuthorBio,
            date: matched.date || newsData.date || "July 2026",
            image: matched.imageUrl || matched.image || newsData.image,
            caption: matched.subheading || matched.summary || newsData.caption,
            category: rawCategory,
            subcategories: rawSubcategories,
            sections: [
              {
                heading: "",
                paragraphs
              }
            ]
          });
        }
      }
    } catch (err) {
      console.warn("Dynamic article page content sync notice:", err);
    }
  }, [liveArticles, newsData]);

  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      try {
        const detail = e.detail || (e.key === "dj_user_profile" && e.newValue ? JSON.parse(e.newValue) : null);
        if (detail && detail.avatar && detail.avatar.length > 5 && !detail.avatar.includes("cart")) {
          const currentAuthor = activeNewsData.authorName.toLowerCase().trim();
          const isRushdhi = currentAuthor.includes("rushdhi") && 
            ((detail.email && detail.email.toLowerCase().includes("rushdhi")) || (detail.name && detail.name.toLowerCase().includes("rushdhi")));
          const isMatch = detail.name && detail.name.toLowerCase().trim() === currentAuthor;

          if (isRushdhi || isMatch) {
            setActiveNewsData((prev) => ({
              ...prev,
              authorAvatar: detail.avatar
            }));
          }
        }
      } catch (err) {}
    };

    if (typeof window !== "undefined") {
      window.addEventListener("dj_profile_updated", handleProfileUpdate);
      window.addEventListener("storage", handleProfileUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("dj_profile_updated", handleProfileUpdate);
        window.removeEventListener("storage", handleProfileUpdate);
      }
    };
  }, [activeNewsData.authorName]);

  const articleHref = `/${category}/${subcategory}`;

  const auth = useAuth();

  const getUserBookmarkStorageKey = (): string | null => {
    if (!auth.user || !auth.user.email) return null;
    const sanitizedEmail = auth.user.email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
    return `dj_bookmarks_${sanitizedEmail}`;
  };

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
  }, [activeNewsData.title, auth.user]);

  const toggleBookmark = () => {
    if (!auth.authenticated || !auth.user) {
      // NON-LOGGED IN USER: Require Sign Up / Login!
      setIsAuthModalOpen(true);
      return;
    }

    // DISALLOW BOOKMARKING FOR WRITERS & ADMINS
    const role = (auth.user.role || "").toLowerCase();
    const email = (auth.user.email || "").toLowerCase();
    const isStaffOrAdmin =
      role === "writer" ||
      role === "admin" ||
      email.includes("writer") ||
      email.includes("admin");

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

  const [authorLinkedinUrl, setAuthorLinkedinUrl] = useState<string>("https://www.linkedin.com");

  useEffect(() => {
    try {
      const activeUserStr = typeof window !== "undefined" ? (localStorage.getItem("dj_user") || localStorage.getItem("dj_writer_user")) : null;
      if (activeUserStr) {
        const activeUser = JSON.parse(activeUserStr);
        if (activeUser.linkedin && activeUser.linkedin.trim()) {
          setAuthorLinkedinUrl(activeUser.linkedin.trim());
          return;
        }
      }

      const dbStr = typeof window !== "undefined" ? localStorage.getItem("dj_user_profiles_db") : null;
      if (dbStr) {
        const profiles = JSON.parse(dbStr);
        const match: any = Object.values(profiles).find(
          (p: any) => p.name && p.name.toLowerCase().trim() === newsData.authorName.toLowerCase().trim()
        );
        if (match?.linkedin && match.linkedin.trim()) {
          setAuthorLinkedinUrl(match.linkedin.trim());
        }
      }
    } catch (e) {}
  }, [newsData.authorName]);

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
        {(() => {
          const currentPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";
          const currentTitle = (activeNewsData.title || newsData.title || "").trim().toLowerCase();
          const matchedArticle = (Array.isArray(liveArticles) ? liveArticles : []).find((p) => {
            if (!p || p.status !== "Published") return false;
            const pTitle = (p.title || "").trim().toLowerCase();
            const pSlug = pTitle.replace(/[^a-z0-9]+/g, "-");
            return (
              currentTitle.includes(pTitle) ||
              pTitle.includes(currentTitle) ||
              currentPath.includes(pSlug) ||
              (p.slug && currentPath.includes(p.slug.toLowerCase())) ||
              (p.id && currentPath.includes(String(p.id))) ||
              (currentTitle.length > 5 && pTitle.slice(0, 15) === currentTitle.slice(0, 15))
            );
          });

          const trueMainCategory = matchedArticle?.category || matchedArticle?.category_name || (activeNewsData.category && activeNewsData.category !== parent?.name ? activeNewsData.category : null) || newsData.category || parent?.name || "Business";
          const formatCategorySlug = (cat: string) => cat.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const mainCategorySlug = formatCategorySlug(trueMainCategory);
          const mainCategoryHref = `/${mainCategorySlug}`;

          return (
            <div className="flex items-center justify-between py-2.5 mb-4 text-[12px] font-sans text-zinc-500 border-b border-zinc-100">
              <Link
                href={mainCategoryHref}
                className="flex items-center gap-1.5 hover:text-black font-semibold uppercase tracking-wider transition-colors"
              >
                <ArrowLeft size={14} />
                Back to {trueMainCategory}
              </Link>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: activeNewsData.title || newsData.title, url: window.location.href }).catch(() => {});
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
          );
        })()}

        {/* Category Navigation Badge: Main Category Only */}
        {(() => {
          const formatCategorySlug = (cat: string) => {
            return cat.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          };

          const currentPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";
          const currentTitle = (activeNewsData.title || newsData.title || "").trim().toLowerCase();
          const matchedArticle = (Array.isArray(liveArticles) ? liveArticles : []).find((p) => {
            if (!p || p.status !== "Published") return false;
            const pTitle = (p.title || "").trim().toLowerCase();
            const pSlug = pTitle.replace(/[^a-z0-9]+/g, "-");
            return (
              currentTitle.includes(pTitle) ||
              pTitle.includes(currentTitle) ||
              currentPath.includes(pSlug) ||
              (p.slug && currentPath.includes(p.slug.toLowerCase())) ||
              (p.id && currentPath.includes(String(p.id))) ||
              (currentTitle.length > 5 && pTitle.slice(0, 15) === currentTitle.slice(0, 15))
            );
          });

          // The true published main category is ALWAYS the primary main category name
          const mainCategoryName = (matchedArticle?.category || matchedArticle?.category_name || (activeNewsData.category && activeNewsData.category !== parent?.name ? activeNewsData.category : null) || newsData.category || parent?.name || "Business").trim();
          const mainCategorySlug = formatCategorySlug(mainCategoryName);
          const mainCategoryHref = `/${mainCategorySlug}`;

          return (
            <div className="flex items-center gap-2 mb-3.5 font-standard-sans">
              {/* Main Category Badge Only */}
              <Link
                href={mainCategoryHref}
                className="inline-flex items-center px-3 py-1 bg-[#BF1E2D] hover:bg-[#a61724] text-white text-[11px] font-extrabold uppercase rounded-md tracking-wider transition-colors shadow-sm"
              >
                {mainCategoryName}
              </Link>
            </div>
          );
        })()}

        {/* Main Title */}
        <h1 className="font-serif text-[26px] sm:text-[30px] md:text-[34px] font-bold leading-[1.2] text-black mb-4 tracking-tight">
          {activeNewsData.title}
        </h1>

        {/* Subheadline */}
        <p className="font-serif text-[17px] md:text-[19px] text-zinc-600 italic leading-relaxed mb-6">
          {activeNewsData.caption ? activeNewsData.caption.split('.')[0] + '.' : 'Independent analysis and verified reporting on key regulatory policy changes.'}
        </p>

        {/* Author Metadata Bar */}
        {(() => {
          const displayAvatar = (activeNewsData.authorAvatar && activeNewsData.authorAvatar.length > 5 && !activeNewsData.authorAvatar.startsWith("data:"))
            ? activeNewsData.authorAvatar
            : (getAuthorAvatarByNameOrEmail(activeNewsData.authorName, activeNewsData.authorEmail) || "/author_bluesuit.jpg");

          return (
            <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-zinc-200 font-sans">
              <Link href={`/author/${activeNewsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-11 h-11 rounded-full overflow-hidden bg-[#1E293B] flex-shrink-0 border border-zinc-300 hover:opacity-80 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                {displayAvatar && displayAvatar.length > 5 ? (
                  <img src={displayAvatar} alt={activeNewsData.authorName} className="w-full h-full object-cover" />
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
                    suppressHydrationWarning
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-[#0A66C2] hover:text-[#004182] transition-colors p-0.5"
                    title={`Connect with ${activeNewsData.authorName} on LinkedIn`}
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
                <p className="text-[12px] text-zinc-500 mt-0.5">{activeNewsData.date}</p>
              </div>
            </div>
          );
        })()}

        {/* Featured Image - Sharp Edges and Balanced Sizing */}
        <div className="relative w-full max-w-[960px] mx-auto overflow-hidden bg-zinc-900 mb-2 rounded-none border border-zinc-200/50 shadow-xs">
          <img
            src={activeNewsData.image}
            alt={activeNewsData.title}
            className="w-full h-auto max-h-[420px] sm:max-h-[450px] object-cover mx-auto block aspect-[16/9] rounded-none"
          />
        </div>
        
        {/* Caption & Photo Credit Row */}
        {(() => {
          const info = parseCaptionAndCredit(activeNewsData.caption, (activeNewsData as any).credit);
          return (
            <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mt-2 mb-4 font-sans text-[12px] text-zinc-500 border-b border-zinc-100 pb-2">
              <span className="italic leading-normal font-sans text-zinc-600">
                {info.caption}
              </span>
              {info.credit && (
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-sans shrink-0">
                  {info.credit}
                </span>
              )}
            </div>
          );
        })()}

        {/* Body Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-2 items-start">
          
          {/* Left Column: Main News content */}
          <div className="lg:col-span-8 flex flex-col">

            {/* News Body Sections */}
            <div className="space-y-4 font-serif text-[17px] md:text-[18px] text-zinc-900 leading-[1.8] tracking-normal mt-0">
              {activeNewsData.sections.map((sec, secIdx) => {
                const isMultiSection = activeNewsData.sections.length > 1;
                const midSectionIndex = Math.min(activeNewsData.sections.length - 1, Math.floor(activeNewsData.sections.length * 0.65));
                const midParagraphIndex = Math.min(sec.paragraphs.length - 1, Math.floor(sec.paragraphs.length * 0.65));

                const cleanHeading = (sec.heading || "").trim();
                const isOverview = cleanHeading.toLowerCase() === "overview" || cleanHeading.toLowerCase() === (activeNewsData.caption || "").toLowerCase().trim();

                return (
                  <div key={secIdx} className="space-y-4">
                    {cleanHeading && !isOverview && (
                      <h2 className="font-serif text-[22px] md:text-[24px] font-bold text-black mt-4 mb-2 leading-snug">
                        {sec.heading}
                      </h2>
                    )}
                    {sec.paragraphs.map((p, pIdx) => (
                      <div key={pIdx} className="space-y-5">
                        <p 
                          className="text-zinc-900 [&_a]:text-[#BF1E2D] [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-[#901320] transition-colors"
                          dangerouslySetInnerHTML={{ __html: processContentLinks(p) }}
                        />

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
                href={loginHref}
                className="block w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer border border-zinc-200 text-center"
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

export default function ArticlePageContent(props: ArticlePageContentProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ArticlePageContentInner {...props} />
    </Suspense>
  );
}

