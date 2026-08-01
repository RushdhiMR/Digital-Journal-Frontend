"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ChevronDown, User, Mail, Menu, X, Sun, CloudSun } from "lucide-react";

const megaMenuData: Record<string, {
  diveDeeper: string[];
  latestNews: string[];
  guides: string[];
}> = {
  WORLD: {
    diveDeeper: ["International", "Diplomacy", "Global Economy"],
    latestNews: [
      "International data privacy standards updated after cross-border audits",
      "Scientific research consortium publishes open-access genome study",
      "Urban infrastructure plans integrate smart power grids in major cities"
    ],
    guides: [
      "A journalist's guide to verifying digital source materials",
      "How to read and interpret complex statistical research reports"
    ]
  },
  POLITICS: {
    diveDeeper: ["Elections", "Policy", "Governance"],
    latestNews: [
      "EU & US leaders sign historic defense and trade agreement",
      "Public transportation systems roll out unified digital ticketing",
      "Education systems adapt curricula to include basic AI literacy"
    ],
    guides: [
      "Understanding public policy impact on engineering standards",
      "Best practices for data collection and public interest reporting"
    ]
  },
  BUSINESS: {
    diveDeeper: ["Companies", "Corporate News", "Entrepreneurship", "Startups"],
    latestNews: [
      "Canada's Conexiom bets that the future of AI lies in automation",
      "Lightworks, Scotiabank, Sun Life and TELUS launch AI Consortium",
      "Canada's AI adoption problem meets its youth employment problem"
    ],
    guides: [
      "Your complete guide to sparking innovation in a digital age",
      "You can't innovate successfully without the right company culture"
    ]
  },
  TECHNOLOGY: {
    diveDeeper: ["Artificial Intelligence", "Cybersecurity", "Innovations", "Robotics"],
    latestNews: [
      "Silicon Valley chip manufacturers announce breakthrough updates",
      "New quantum computing clusters open to public cloud preview",
      "Cybersecurity protocols updated globally to counter multi-vector threats"
    ],
    guides: [
      "Best practices for secure software development life cycle",
      "Comprehensive cloud migration checklist for enterprise architecture"
    ]
  }
};

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState("US Edition");
  const [isEditionOpen, setIsEditionOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("dj_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);

        // Check if Writer account is deactivated
        if (parsed.role === "Writer" || parsed.email?.toLowerCase().includes("writer")) {
          const writerListStr = localStorage.getItem("dj_writers_list");
          if (writerListStr) {
            const writerList: any[] = JSON.parse(writerListStr);
            const matched = writerList.find(
              (w) => (w.email && w.email.toLowerCase() === parsed.email?.toLowerCase()) || parsed.email?.toLowerCase().includes("writer")
            );
            if (matched && matched.status === "Deactivated") {
              localStorage.removeItem("dj_user");
              localStorage.removeItem("dj_writer_user");
              setCurrentUser(null);
              return;
            }
          }
        }

        // Check if Co-Admin account is deactivated
        if (parsed.role === "Co-Admin" || parsed.email?.toLowerCase().includes("coadmin")) {
          const coListStr = localStorage.getItem("dj_co_admins_list");
          if (coListStr) {
            const coList: any[] = JSON.parse(coListStr);
            const matched = coList.find(
              (c) => (c.email && c.email.toLowerCase() === parsed.email?.toLowerCase()) || parsed.email?.toLowerCase().includes("coadmin")
            );
            if (matched && matched.status === "Deactivated") {
              localStorage.removeItem("dj_user");
              localStorage.removeItem("dj_admin_user");
              setCurrentUser(null);
              return;
            }
          }
        }

        setCurrentUser(parsed);
      }

      const savedToast = localStorage.getItem("dj_toast");
      if (savedToast) {
        setToastMessage(savedToast);
        localStorage.removeItem("dj_toast");
        const timer = setTimeout(() => {
          setToastMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("dj_user");
    localStorage.removeItem("dj_admin_user");
    localStorage.removeItem("dj_writer_user");
    setCurrentUser(null);
    setIsUserDropdownOpen(false);
    localStorage.setItem("dj_toast", "You have successfully signed out.");
    window.location.href = "/";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navCategories = [
    { name: "World", href: "/news/world", hasSub: true, active: true },
    { name: "Politics", href: "/news/politics", hasSub: true },
    { name: "Business", href: "/business", hasSub: true },
    { name: "Technology", href: "/technology", hasSub: true },
    { name: "Economy", href: "/news/markets", hasSub: false },
    { name: "Markets", href: "/news/markets", hasSub: false },
    { name: "Lifestyle", href: "/news/lifestyle", hasSub: false },
    { name: "Sports", href: "/news/sports", hasSub: false },
    { name: "Entertainment", href: "/news/entertainment", hasSub: false },
    { name: "Health", href: "/news/health", hasSub: false },
    { name: "Research", href: "/industry-insights", hasSub: false },
  ];

  const trendingTopics = [
    { name: "Cybersecurity Breach", href: "/search?q=Cybersecurity+Breach" },
    { name: "AI Regulation", href: "/search?q=AI+Regulation" },
    { name: "Global Markets", href: "/search?q=Global+Markets" },
    { name: "Clean Energy", href: "/search?q=Clean+Energy" },
    { name: "Space Economy", href: "/search?q=Space+Economy" },
    { name: "Inflation Rate", href: "/search?q=Inflation+Rate" }
  ];

  const topCountriesList = [
    { flag: "🇺🇸", name: "United States", region: "North America", href: "/news/world" },
    { flag: "🇬🇧", name: "United Kingdom", region: "Europe", href: "/news/world" },
    { flag: "🇦🇪", name: "United Arab Emirates", region: "Middle East", href: "/news/world" },
    { flag: "🇨🇳", name: "China", region: "East Asia", href: "/news/world" },
    { flag: "🇮🇳", name: "India", region: "South Asia", href: "/news/world" },
    { flag: "🇨🇦", name: "Canada", region: "Americas", href: "/news/world" },
    { flag: "🇦🇺", name: "Australia", region: "Oceania", href: "/news/world" },
    { flag: "🌍", name: "International", region: "Global Summary", href: "/news/world" },
  ];

  return (
    <header className="relative w-full bg-white text-gray-900 z-50 font-sans border-b border-gray-200">
      
      {/* Sign-in Toast Banner */}
      {toastMessage && (
        <div className="w-full bg-[#BF1E2D] text-white text-[12px] font-bold py-2 px-4 text-center flex items-center justify-center gap-3">
          <span>✓ {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white ml-2 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* ================= ROW 1: BRAND LOGO, SEARCH, & ACTION BUTTONS ================= */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        
        {/* LOGO & SUBTITLE */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          {/* Red Layered Digital Journal Logo Icon */}
          <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Digital Journal Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-[26px] font-black tracking-tight leading-none text-gray-900 group-hover:text-[#BF1E2D] transition-colors font-serif">
              DIGITAL JOURNAL
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide mt-0.5">
              Smart News. Real Impact.
            </span>
          </div>
        </Link>

        {/* SEARCH INPUT BAR */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex items-center relative flex-1 max-w-[480px] mx-4"
        >
          <input
            type="text"
            placeholder="Search for news, topics, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 text-[13px] border border-gray-300 rounded-full focus:outline-none focus:border-[#BF1E2D] focus:ring-1 focus:ring-[#BF1E2D] bg-white text-gray-800 placeholder-gray-400 transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 text-gray-400 hover:text-[#BF1E2D] cursor-pointer"
            aria-label="Submit Search"
          >
            <Search size={17} strokeWidth={2.2} />
          </button>
        </form>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-3 text-[13px] font-medium flex-shrink-0">
          
          {/* Newsletter Link */}
          <Link 
            href="/newsletters" 
            className="hidden md:flex items-center gap-1.5 text-gray-700 hover:text-[#BF1E2D] transition-colors"
          >
            <Mail size={16} strokeWidth={2} />
            <span className="font-semibold text-[13px]">Newsletter</span>
          </Link>

          <span className="hidden md:inline text-gray-300">|</span>

          {/* User Sign In / Profile Dropdown */}
          {currentUser ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 text-gray-800 hover:text-[#BF1E2D] cursor-pointer font-bold text-[13px]"
              >
                <div className="w-7 h-7 rounded-full bg-[#BF1E2D] text-white flex items-center justify-center text-[12px] font-bold uppercase">
                  {currentUser.name ? currentUser.name.charAt(0) : "U"}
                </div>
                <span className="hidden lg:inline text-gray-900 font-semibold">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-gray-500">▼</span>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded shadow-xl z-50 py-2 text-left">
                  <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-[13px] font-bold text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  {(currentUser.role === "Admin" || currentUser.role === "Co-Admin" || currentUser.role === "admin") && (
                    <Link href="/admin" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-xs font-semibold hover:bg-gray-100 text-gray-800">
                      🛡️ Admin Dashboard
                    </Link>
                  )}
                  {(currentUser.role === "Writer" || currentUser.role === "Admin") && (
                    <Link href="/writer" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-xs font-semibold hover:bg-gray-100 text-gray-800">
                      ✍️ Writer Studio
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="hidden md:flex items-center gap-1.5 text-gray-800 hover:text-[#BF1E2D] font-semibold transition-colors"
            >
              <User size={16} strokeWidth={2} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Red Newsletter Signup Button */}
          <Link
            href="/newsletters"
            className="hidden md:inline-block bg-[#BF1E2D] hover:bg-red-700 text-white font-bold text-[12px] px-4 py-2 rounded-none transition-colors whitespace-nowrap shadow-sm"
          >
            Newsletter Signup
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-800 hover:text-[#BF1E2D] p-1.5 rounded-none hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </div>

      {/* ================= ROW 2: CATEGORY NAVIGATION BAR ================= */}
      <div className="w-full border-t border-b border-gray-200 bg-white overflow-x-auto md:overflow-visible scrollbar-none max-w-full relative z-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between min-w-max md:min-w-0">
          
          {/* Main Horizontal Category Nav Items */}
          <nav className="flex items-center space-x-6 py-2.5 text-[13.5px] font-bold relative z-40">
            {navCategories.map((cat) => (
              <div
                key={cat.name}
                className="relative flex items-center py-0.5"
                onMouseEnter={() => (cat.name === "World" || cat.hasSub) && setActiveMenu("WORLD")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {cat.name === "World" ? (
                  <button
                    type="button"
                    onMouseEnter={() => setActiveMenu("WORLD")}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveMenu(activeMenu === "WORLD" ? null : "WORLD");
                    }}
                    className="flex items-center gap-1 whitespace-nowrap transition-colors text-gray-900 border-b-2 border-[#BF1E2D] pb-1 font-bold cursor-pointer bg-transparent border-t-0 border-x-0 outline-none"
                  >
                    <span>World</span>
                    <ChevronDown size={12} strokeWidth={2.5} className="text-gray-500 mt-0.5" />
                  </button>
                ) : (
                  <Link
                    href={cat.href}
                    className="flex items-center gap-1 whitespace-nowrap transition-colors text-gray-800 hover:text-[#BF1E2D]"
                  >
                    <span>{cat.name}</span>
                  </Link>
                )}

                {/* Dropdown Menu on Hover for World (Top Countries List) */}
                {cat.name === "World" && activeMenu === "WORLD" && (
                  <div 
                    onMouseEnter={() => setActiveMenu("WORLD")}
                    className="absolute top-full left-0 pt-1 w-80 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="bg-white border border-gray-200 shadow-2xl rounded-none p-4 text-left font-sans">
                      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-150">
                        <h4 className="text-[11px] font-extrabold uppercase text-[#BF1E2D] tracking-wider">
                          Top Countries & Regions
                        </h4>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Select Country</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1 max-h-[320px] overflow-y-auto scrollbar-thin">
                        {topCountriesList.map((country, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 px-3 rounded-md text-gray-800 cursor-default pointer-events-none select-none opacity-90"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-base leading-none">{country.flag}</span>
                              <span className="text-xs font-bold">{country.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {country.region}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Far Right Edition Selector */}
          <div className="hidden lg:flex items-center pl-4 border-l border-gray-200 relative">
            <button
              onClick={() => setIsEditionOpen(!isEditionOpen)}
              className="flex items-center gap-1 text-[13px] font-bold text-gray-800 hover:text-[#BF1E2D] cursor-pointer py-2.5"
            >
              <span>{selectedEdition}</span>
              <ChevronDown size={13} strokeWidth={2.5} className="text-gray-500" />
            </button>

            {isEditionOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-none shadow-md z-50 py-1">
                {["US Edition", "Canada Edition", "Global Edition", "UK Edition"].map((ed) => (
                  <button
                    key={ed}
                    onClick={() => { setSelectedEdition(ed); setIsEditionOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-[#BF1E2D]"
                  >
                    {ed}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ================= ROW 3: TRENDING TOPICS & WEATHER UTILITY BAR ================= */}
      <div className="w-full bg-[#F8F9FA] border-b border-gray-200 py-2 px-4 text-xs font-medium text-gray-700">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* LEFT: TRENDING LABEL & TOPICS (MOBILE RESPONSIVE, SHIFTED ~1 INCH RIGHT ON DESKTOP) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 pl-2 md:pl-24">
            <span className="text-[#BF1E2D] font-extrabold uppercase text-[11px] tracking-wider flex-shrink-0">
              TRENDING
            </span>
            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-2 text-[12px] whitespace-nowrap text-gray-700">
              {trendingTopics.map((topic, index) => (
                <div key={topic.name} className="flex items-center gap-2">
                  <Link href={topic.href} className="hover:text-[#BF1E2D] transition-colors font-medium">
                    {topic.name}
                  </Link>
                  {index < trendingTopics.length - 1 && <span className="text-gray-300">|</span>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: DATE, LOCATION & WEATHER WIDGET */}
          <div className="hidden sm:flex items-center gap-3 text-[11.5px] text-gray-500 font-medium flex-shrink-0">
            <span>Tuesday, July 13, 2026</span>
            <span className="text-gray-300">|</span>
            <span>New York, USA</span>
            <span className="text-gray-300">|</span>
            
            {/* Weather Pill */}
            <div className="flex items-center gap-1 text-gray-800 font-semibold cursor-pointer hover:text-[#BF1E2D]">
              <span className="text-amber-500 text-sm">⛅</span>
              <span>26°C</span>
              <ChevronDown size={11} strokeWidth={2.5} className="text-gray-400" />
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-900 border-t border-gray-200 py-5 px-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search news, topics, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 text-xs border border-gray-300 rounded-full focus:outline-none focus:border-[#BF1E2D] bg-gray-50 text-gray-900"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
              <Search size={16} />
            </button>
          </form>

          {/* Action Buttons: Newsletter & Sign In */}
          <div className="flex items-center gap-3 pt-1 pb-3 border-b border-gray-100">
            <Link
              href="/newsletters"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 bg-[#BF1E2D] text-white text-center font-bold text-xs py-2.5 rounded-md shadow-sm"
            >
              Newsletter Signup
            </Link>

            {currentUser ? (
              <button
                onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(true); }}
                className="flex-1 bg-gray-100 text-gray-800 text-center font-bold text-xs py-2.5 rounded-md border border-gray-200"
              >
                {currentUser.name}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 bg-gray-100 text-gray-800 text-center font-bold text-xs py-2.5 rounded-md border border-gray-200 flex items-center justify-center gap-1.5"
              >
                <User size={14} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Category Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 text-xs font-bold text-gray-800 bg-gray-50 hover:bg-red-50 hover:text-[#BF1E2D] rounded-md transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}