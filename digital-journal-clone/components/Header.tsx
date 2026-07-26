"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ChevronDown, User, Menu, X } from "lucide-react";

const megaMenuData: Record<string, {
  diveDeeper: string[];
  latestNews: string[];
  guides: string[];
}> = {
  NEWS: {
    diveDeeper: ["World", "Markets", "Politics"],
    latestNews: [
      "International data privacy standards updated after cross-border audits",
      "Scientific research consortium publishes open-access genome study",
      "Urban infrastructure plans integrate smart power grids in major cities",
      "Public transportation systems roll out unified digital ticketing",
      "Education systems adapt curricula to include basic AI literacy"
    ],
    guides: [
      "A journalist's guide to verifying digital source materials",
      "How to read and interpret complex statistical research reports",
      "Understanding public policy impact on engineering standards",
      "Best practices for data collection and public interest reporting",
      "Writing technical documentation that is accessible to general audiences"
    ]
  },
  BUSINESS: {
    diveDeeper: ["Companies", "Corporate News", "Entrepreneurship", "Startups", "Leadership"],
    latestNews: [
      "Canada's Conexiom bets that the future of AI lies in automation, not experimentation",
      "Lightworks, Scotiabank, Sun Life and TELUS launch AI Consortium",
      "Canada's AI adoption problem meets its youth employment problem",
      "Op-Ed: Rethinking humanity as automation rewrites human realities",
      "‘Indispensable’ Xiaohongshu app fuels Chinese tourism"
    ],
    guides: [
      "Your complete guide to sparking innovation in a digital age",
      "This secret sauce to successful innovation may not be your first guess",
      "Want to keep customers at the heart of your innovation project?",
      "You can’t innovate successfully without the right company culture and mindset",
      "Charting a successful future with an innovation-driven vision and strategy"
    ]
  },
  "INDUSTRY INSIGHTS": {
    diveDeeper: ["Agriculture", "Tourism", "Financial Services", "Health", "Transportation"],
    latestNews: [
      "Venture capital firms shift focus to sustainable tech sector pipelines",
      "How remote leadership models are evolving to meet product goals",
      "Global logistics platforms integrate machine learning for routing",
      "E-commerce platforms scale up localized transaction nodes",
      "Why corporate investment in developer experience yields positive ROI"
    ],
    guides: [
      "Building a developer relations department from the ground up",
      "How to calculate developer metrics that align with business KPIs",
      "A manager's handbook for remote engineering organizations",
      "Designing customer feedback loops that drive feature design",
      "Transitioning from legacy monolithic systems to agile microservices"
    ]
  },
  TECHNOLOGY: {
    diveDeeper: ["Artificial Intelligence", "Cybersecurity", "Innovations", "Space Technology"],
    latestNews: [
      "Silicon Valley chip manufacturers announce breakthrough architectural updates",
      "New quantum computing clusters open to public cloud developer preview",
      "Open-source database platform raises record funding round for scaling",
      "How edge computing is transforming real-time telemetry processing",
      "Cybersecurity protocols updated globally to counter multi-vector threats"
    ],
    guides: [
      "Best practices for secure software development life cycle",
      "Comprehensive cloud migration checklist for enterprise architecture",
      "Introduction to deep learning model optimization and pruning",
      "How to set up continuous deployment pipelines for hybrid clouds",
      "A developer's guide to system logging and monitoring tools"
    ]
  }
};

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("dj_user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
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
    setCurrentUser(null);
    setIsUserDropdownOpen(false);
    setToastMessage("You have been signed out.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navItems = [
    "NEWS",
    "BUSINESS",
    "INDUSTRY INSIGHTS",
    "TECHNOLOGY",
    "INNOVATION",
    "EVENTS",
  ];

  return (
    <header
      className="relative w-full bg-black text-white border-t-[7px] border-[#165c61] z-50 font-standard-sans"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* Sign-in Notification Toast Banner */}
      {toastMessage && (
        <div className="w-full bg-[#BF1E2D] text-white text-[13px] font-bold py-2.5 px-4 text-center flex items-center justify-center gap-3 animate-fade-in font-standard-sans shadow-md border-b border-red-800">
          <span>✓ {toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-2 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4">
        {/* TOP SECTION */}
        <div className="flex items-center justify-between pt-6 lg:pt-9 pb-5 lg:pb-7">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 md:gap-[12px] hover:opacity-90 transition-opacity">
            <div className="relative w-7 h-7 md:w-[36px] md:h-[36px] flex items-center justify-center flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Digital Journal Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <span className="text-[20px] md:text-[30px] leading-none font-bold tracking-[0.5px] whitespace-nowrap">
              DIGITAL JOURNAL
            </span>
          </Link>

          {/* SEARCH, LOGIN & NEWSLETTER */}
          <div className="flex items-center gap-[12px] md:gap-[20px] text-[14px]">
            <Link
              href="/newsletters"
              className="hidden sm:inline-block border border-white text-white bg-transparent hover:bg-[#BF1E2D] hover:border-[#BF1E2D] text-[11px] font-bold px-3 py-1.5 transition-all tracking-wider whitespace-nowrap rounded-none font-sans"
            >
              NEWSLETTER SIGNUP
            </Link>

            {isSearchOpen ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 transition-all"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-[12px] focus:outline-none w-[80px] sm:w-[130px] font-normal"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-zinc-400 hover:text-white cursor-pointer text-[10px] px-1"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="hover:text-gray-400 transition-colors cursor-pointer text-white flex items-center justify-center p-1"
              >
                <Search size={16} strokeWidth={2} />
              </button>
            )}

            {/* Logged in User Profile or Login Icon */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-white hover:text-zinc-200 cursor-pointer font-bold text-[13px] bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#BF1E2D] text-white flex items-center justify-center text-[11px] font-bold uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : "U"}
                  </div>
                  <span className="hidden md:inline font-sans font-medium text-[13px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-zinc-400">▼</span>
                </button>

                {/* Logged in User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl text-left z-50 overflow-hidden font-standard-sans">
                    <div className="p-3.5 border-b border-zinc-800 bg-zinc-950">
                      <p className="text-[13px] font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                    <div className="py-1 border-b border-zinc-800">
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="w-full px-4 py-2 text-[13px] text-zinc-200 hover:bg-zinc-800 hover:text-white text-left transition-colors font-medium flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#BF1E2D]"></span>
                        Admin Dashboard
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 text-left transition-colors font-medium flex items-center gap-2 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" aria-label="Login">
                <User
                  size={18}
                  strokeWidth={2}
                  className="hover:text-gray-400 transition-colors cursor-pointer"
                />
              </Link>
            )}

            {/* Hamburger menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-gray-400 cursor-pointer p-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="hidden lg:flex h-[70px] items-center">
          <ul className="w-full h-full flex items-center justify-between">
            {navItems.map((item) => {
              const isActive = activeMenu === item;
              const pathMap: Record<string, string> = {
                "NEWS": "/news",
                "BUSINESS": "/business",
                "INDUSTRY INSIGHTS": "/industry-insights",
                "TECHNOLOGY": "/technology",
                "INNOVATION": "/innovation",
                "EVENTS": "/events"
              };
              const href = pathMap[item] || "#";
              return (
                <li
                  key={item}
                  className="h-full flex items-center"
                  onMouseEnter={() => setActiveMenu(item)}
                >
                  <Link
                    href={href}
                    className={`flex items-center gap-[6px] text-[13px] md:text-[14px] font-bold tracking-[0.5px] whitespace-nowrap transition-all h-full px-4 ${isActive
                      ? "bg-white text-black"
                      : "hover:text-gray-400"
                      }`}
                  >
                    {item}

                    {item !== "INNOVATION" && item !== "EVENTS" && (
                      <ChevronDown
                        size={11}
                        strokeWidth={2.5}
                        className="mt-[1px]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 text-white w-full border-t border-zinc-800 py-6 px-4 z-40 transition-all font-standard-sans max-h-[80vh] overflow-y-auto">
          <ul className="space-y-4">
            {navItems.map((item) => {
              const pathMap: Record<string, string> = {
                "NEWS": "/news",
                "BUSINESS": "/business",
                "INDUSTRY INSIGHTS": "/industry-insights",
                "TECHNOLOGY": "/technology",
                "INNOVATION": "/innovation",
                "EVENTS": "/events"
              };
              const href = pathMap[item] || "#";
              const hasSubData = !!megaMenuData[item];
              const isExpanded = expandedMobileCategory === item;

              return (
                <li key={item} className="flex flex-col border-b border-zinc-900 pb-3">
                  <div className="flex items-center justify-between">
                    <Link
                      href={href}
                      className="text-[14px] font-bold tracking-wider hover:text-[#BF1E2D] uppercase block py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item}
                    </Link>
                    {hasSubData && (
                      <button
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : item)}
                        className="p-2 text-zinc-400 hover:text-white flex items-center gap-1 text-[12px] font-semibold cursor-pointer"
                        aria-label={`Toggle ${item} sub-menu`}
                      >
                        <span className="text-[10px] text-zinc-400">
                          {isExpanded ? "Hide Latest" : "Show Latest"}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#BF1E2D]" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Expanded Sub-menu for Mobile */}
                  {hasSubData && isExpanded && (
                    <div className="mt-3 pl-3 border-l-2 border-[#BF1E2D] space-y-4 bg-zinc-900/60 p-3 rounded">
                      {/* LATEST NEWS */}
                      <div>
                        <h4 className="text-[11px] font-extrabold tracking-wider text-[#BF1E2D] uppercase mb-2">
                          LATEST NEWS
                        </h4>
                        <ul className="space-y-2.5">
                          {megaMenuData[item].latestNews.map((newsTitle, i) => {
                            const parentSlug = item.toLowerCase().replace(/\s+/g, "-");
                            const articleSlug = newsTitle
                              .toLowerCase()
                              .replace(/[^a-z0-9\s]+/g, "")
                              .trim()
                              .replace(/\s+/g, "-");
                            return (
                              <li key={i}>
                                <Link
                                  href={`/${parentSlug}/${articleSlug}`}
                                  className="text-[12.5px] font-medium text-zinc-200 hover:text-white hover:underline block leading-snug"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  • {newsTitle}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* DIVE DEEPER */}
                      {megaMenuData[item].diveDeeper && megaMenuData[item].diveDeeper.length > 0 && (
                        <div className="pt-2 border-t border-zinc-800">
                          <h4 className="text-[11px] font-extrabold tracking-wider text-zinc-400 uppercase mb-2">
                            DIVE DEEPER
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {megaMenuData[item].diveDeeper.map((subCat) => {
                              const parentSlug = item.toLowerCase().replace(/\s+/g, "-");
                              const subSlug = subCat.toLowerCase().replace(/\s+/g, "-");
                              return (
                                <Link
                                  key={subCat}
                                  href={`/${parentSlug}/${subSlug}`}
                                  className="text-[11px] bg-zinc-800 hover:bg-[#BF1E2D] text-zinc-200 hover:text-white px-2.5 py-1 rounded transition-colors font-medium"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subCat}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
            
            {/* Mobile Newsletter Signup Link */}
            <li className="pt-2">
              <Link
                href="/newsletters"
                className="block text-center bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-[12px] py-3.5 tracking-wider uppercase transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Newsletter Signup
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* MEGA MENU DROPDOWN DRAWER */}
      {activeMenu && megaMenuData[activeMenu] && (
        <div
          className="absolute top-full left-0 w-full bg-[#BEEDF7] text-black border-t border-zinc-200 shadow-lg z-50 py-9"
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[1fr_3.5fr] gap-16">
            {/* DIVE DEEPER */}
            <div>
              <h4 className="text-[12px] font-extrabold tracking-[1px] text-zinc-900 mb-4 uppercase">
                DIVE DEEPER
              </h4>
              <ul className="space-y-3">
                {megaMenuData[activeMenu].diveDeeper.map((link) => {
                  const parentSlug = activeMenu.toLowerCase().replace(/\s+/g, "-");
                  const subSlug = link.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <li key={link}>
                      <Link 
                        href={`/${parentSlug}/${subSlug}`}
                        onClick={() => setActiveMenu(null)}
                        className="text-[13.5px] font-bold text-zinc-800 hover:text-[#f00000] hover:underline transition-colors block"
                      >
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* LATEST NEWS */}
            <div>
              <h4 className="text-[12px] font-extrabold tracking-[1px] text-zinc-900 mb-4 uppercase">
                LATEST NEWS
              </h4>
              <ul className="space-y-4">
                {megaMenuData[activeMenu].latestNews.map((link) => {
                  const parentSlug = activeMenu.toLowerCase().replace(/\s+/g, "-");
                  const subSlug = link
                    .toLowerCase()
                    .replace(/[^a-z0-9\s]+/g, "")
                    .trim()
                    .replace(/\s+/g, "-");
                  return (
                    <li key={link}>
                      <Link 
                        href={`/${parentSlug}/${subSlug}`}
                        onClick={() => setActiveMenu(null)}
                        className="text-[13px] font-bold text-zinc-800 hover:text-[#f00000] hover:underline leading-relaxed transition-colors block"
                      >
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}