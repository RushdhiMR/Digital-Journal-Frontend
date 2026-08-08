"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ChevronDown, User, Mail, Menu, X, PenTool, LogOut, Settings, BookOpen, ShieldCheck, Bell } from "lucide-react";
import { saveUserProfile, getUserProfile } from "@/lib/userProfiles";

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
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string; avatar?: string; bio?: string; linkedin?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState("US Edition");
  const [isEditionOpen, setIsEditionOpen] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileLinkedin, setProfileLinkedin] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [articleNotifications, setArticleNotifications] = useState<{ id: string; title: string; status: string; date: string }[]>([]);

  // Sync article notifications from localStorage
  const syncArticleNotifications = useCallback(() => {
    try {
      const stored = localStorage.getItem("dj_writer_submitted_articles");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setArticleNotifications(parsed);
          return;
        }
      }
      setArticleNotifications([]);
    } catch (e) {
      console.error(e);
      setArticleNotifications([]);
    }
  }, []);

  useEffect(() => {
    syncArticleNotifications();
    window.addEventListener("storage", syncArticleNotifications);
    window.addEventListener("dj_auth_change", syncArticleNotifications);
    return () => {
      window.removeEventListener("storage", syncArticleNotifications);
      window.removeEventListener("dj_auth_change", syncArticleNotifications);
    };
  }, [syncArticleNotifications]);

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync profile state when currentUser or modal opens
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "rushdhi");
      setProfileBio(currentUser.bio || "Writer User");
      setProfileLinkedin(currentUser.linkedin || "https://www.linkedin.com/in/your-profile");
      setProfileAvatar(currentUser.avatar || "/author_bluesuit.jpg");
    }
  }, [currentUser, isProfileSettingsOpen]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfileAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name: profileName.trim() || "rushdhi",
      email: currentUser?.email || "rushdhiriyaj2005@gmail.com",
      role: currentUser?.role || "Writer",
      bio: profileBio.trim(),
      linkedin: profileLinkedin.trim(),
      avatar: profileAvatar || "/author_bluesuit.jpg"
    };

    setCurrentUser(updatedUser);
    saveUserProfile(updatedUser);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("dj_auth_change"));
    }

    setToastMessage("🎉 Profile settings saved successfully!");
    setIsProfileSettingsOpen(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const syncCurrentUser = useCallback(() => {
    try {
      const isSignedOut = localStorage.getItem("dj_signed_out");
      const savedUser = localStorage.getItem("dj_user");
      const savedAdmin = localStorage.getItem("dj_admin_user");
      const savedWriter = localStorage.getItem("dj_writer_user");

      let activeUser = null;
      if (savedUser) {
        activeUser = JSON.parse(savedUser);
      } else if (savedAdmin) {
        activeUser = JSON.parse(savedAdmin);
      } else if (savedWriter) {
        activeUser = JSON.parse(savedWriter);
      }

      if (activeUser) {
        localStorage.removeItem("dj_signed_out");
        const targetEmail = activeUser.email || "rushdhiriyaj2005@gmail.com";
        const savedProfile = getUserProfile(targetEmail);

        const finalUser = {
          name: savedProfile?.name || activeUser.name || "rushdhi",
          email: targetEmail,
          role: savedProfile?.role || activeUser.role || "Writer",
          avatar: savedProfile?.avatar || activeUser.avatar || "/author_bluesuit.jpg",
          bio: savedProfile?.bio || activeUser.bio,
          linkedin: savedProfile?.linkedin || activeUser.linkedin
        };

        // Check if Writer account is deactivated
        if (finalUser.role === "Writer" || finalUser.email?.toLowerCase().includes("writer")) {
          const writerListStr = localStorage.getItem("dj_writers_list");
          if (writerListStr) {
            const writerList: any[] = JSON.parse(writerListStr);
            const matched = writerList.find(
              (w) => (w.email && w.email.toLowerCase() === finalUser.email?.toLowerCase()) || finalUser.email?.toLowerCase().includes("writer")
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
        if (finalUser.role === "Co-Admin" || finalUser.email?.toLowerCase().includes("coadmin")) {
          const coListStr = localStorage.getItem("dj_co_admins_list");
          if (coListStr) {
            const coList: any[] = JSON.parse(coListStr);
            const matched = coList.find(
              (c) => (c.email && c.email.toLowerCase() === finalUser.email?.toLowerCase()) || finalUser.email?.toLowerCase().includes("coadmin")
            );
            if (matched && matched.status === "Deactivated") {
              localStorage.removeItem("dj_user");
              localStorage.removeItem("dj_admin_user");
              setCurrentUser(null);
              return;
            }
          }
        }

        setCurrentUser(finalUser);
        saveUserProfile(finalUser);
      } else if (isSignedOut === "true") {
        setCurrentUser(null);
      } else {
        const defaultUser = {
          name: "rushdhi",
          email: "rushdhiriyaj2005@gmail.com",
          role: "Writer",
          avatar: "/author_bluesuit.jpg"
        };
        const savedProfile = getUserProfile(defaultUser.email);
        const finalUser = {
          ...defaultUser,
          ...savedProfile
        };
        setCurrentUser(finalUser);
        saveUserProfile(finalUser);
      }

      const savedToast = localStorage.getItem("dj_toast");
      if (savedToast) {
        setToastMessage(savedToast);
        localStorage.removeItem("dj_toast");
        setTimeout(() => {
          setToastMessage(null);
        }, 5000);
      }
    } catch (e) {
      console.error(e);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    syncCurrentUser();

    const handleAuthChange = () => syncCurrentUser();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("dj_auth_change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("dj_auth_change", handleAuthChange);
    };
  }, [syncCurrentUser]);

  const handleSignOut = () => {
    localStorage.removeItem("dj_user");
    localStorage.removeItem("dj_admin_user");
    localStorage.removeItem("dj_writer_user");
    localStorage.setItem("dj_signed_out", "true");
    localStorage.setItem("dj_toast", "👋 You have successfully signed out.");
    setCurrentUser(null);
    setIsUserDropdownOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("dj_auth_change"));
      window.location.href = "/";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    window.location.href = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
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
      <div className="max-w-[1400px] mx-auto px-2.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 relative z-50 w-full max-w-full">
        
        {/* LOGO & SUBTITLE */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-3 group shrink min-w-0">
          {/* Red Layered Digital Journal Logo Icon */}
          <div className="relative w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Digital Journal Logo"
              width={40}
              height={40}
              className="w-7 h-7 sm:w-10 sm:h-10 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] sm:text-2xl md:text-[26px] font-black tracking-tight leading-none text-gray-900 group-hover:text-[#BF1E2D] transition-colors font-serif truncate">
              DIGITAL JOURNAL
            </span>
            <span className="hidden sm:inline-block text-[10.5px] text-gray-500 font-semibold tracking-wider uppercase mt-1">
              Smart News. Real Impact.
            </span>
          </div>
        </Link>

        {/* SEARCH INPUT BAR */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex items-center relative flex-1 max-w-[440px] lg:max-w-[520px] mx-4"
        >
          <input
            type="text"
            placeholder="Search for news, topics, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (typeof window !== "undefined" && window.location.pathname !== "/search") {
                window.location.href = searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : "/search";
              }
            }}
            onClick={() => {
              if (typeof window !== "undefined" && window.location.pathname !== "/search") {
                window.location.href = searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : "/search";
              }
            }}
            className="w-full pl-4 pr-10 py-2 text-[13px] border border-gray-300 rounded-full focus:outline-none focus:border-[#BF1E2D] focus:ring-1 focus:ring-[#BF1E2D] bg-gray-50/60 hover:bg-white focus:bg-white text-gray-800 placeholder-gray-400 transition-all cursor-pointer shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-3.5 text-gray-400 hover:text-[#BF1E2D] cursor-pointer transition-colors"
            aria-label="Submit Search"
          >
            <Search size={16} strokeWidth={2.2} />
          </button>
        </form>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-1.5 sm:gap-3.5 text-[13px] font-medium shrink-0">
          
          {/* Newsletter Signup Button */}
          <Link
            href="/newsletters"
            className="hidden lg:inline-flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white font-bold text-[12px] px-3.5 py-2 rounded-md transition-colors whitespace-nowrap shadow-xs"
          >
            <Mail size={14} />
            <span>Newsletter Signup</span>
          </Link>

          {/* User Sign In / Profile Dropdown (BOTH MOBILE & DESKTOP) */}
          {currentUser ? (
            <div className="relative block z-[100]" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                className="relative flex items-center gap-1.5 cursor-pointer focus:outline-none p-0.5 rounded-full hover:ring-2 hover:ring-[#BF1E2D]/20 transition-all bg-gray-100"
                aria-label="User Account Menu"
              >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full overflow-hidden border border-gray-300 shadow-xs bg-gray-100 flex-shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || "rushdhi"}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <User size={18} className="text-[#BF1E2D]" />
                  )}
                  {/* Green status online dot */}
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0 shadow-xs z-10"></span>
                </div>
              </button>

              {/* USER ACCOUNT DROPDOWN POPOVER */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-2xl rounded-xl text-left z-[1000] overflow-hidden font-sans animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Section 1: User Profile Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-150 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                      <img
                        src={currentUser.avatar || "/author_bluesuit.jpg"}
                        alt={currentUser.name || "User Profile"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-extrabold text-gray-900 leading-snug tracking-tight truncate">
                        {currentUser.name || "rushdhi"}
                      </p>
                      <p className="text-[10.5px] text-gray-500 font-mono tracking-tight font-normal truncate">
                        {currentUser.email || "rushdhiriyaj2005@gmail.com"}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.2 bg-red-100 text-[#BF1E2D] font-extrabold text-[9px] uppercase tracking-wider rounded">
                        {currentUser.role || "READER"}
                      </span>
                    </div>
                  </div>

                  {/* Admin Dashboard Option (Admin & Co-Admin) */}
                  {(currentUser.role === "Admin" || currentUser.role === "Co-Admin" || (currentUser.email || "").toLowerCase().includes("admin")) && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="px-4 py-2.5 flex items-center gap-2.5 border-b border-gray-100 hover:bg-emerald-50/60 transition-colors cursor-pointer group"
                    >
                      <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                      <span className="text-emerald-700 font-bold text-[12px] tracking-tight">
                        Admin Dashboard
                      </span>
                    </Link>
                  )}

                  {/* Author Workspace Option - ONLY shown if user is explicitly an Admin-approved Author */}
                  {(() => {
                    const email = (currentUser.email || "").toLowerCase().trim();
                    const isSystemWriterOrAdmin =
                      email === "writer@digitaljournal.com" ||
                      email === "admin@digitaljournal.com" ||
                      email === "coadmin@digitaljournal.com" ||
                      email.includes("admin");

                    let isApproved = isSystemWriterOrAdmin;
                    if (!isApproved && email && typeof window !== "undefined") {
                      const writersListStr = localStorage.getItem("dj_writers_list");
                      if (writersListStr) {
                        try {
                          const wList: any[] = JSON.parse(writersListStr);
                          isApproved = wList.some((w: any) => w.email && w.email.toLowerCase().trim() === email && w.status === "Active");
                        } catch (e) {
                          console.warn(e);
                        }
                      }
                    }

                    if (isApproved) {
                      return (
                        <Link
                          href="/writer"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="px-4 py-2.5 flex items-center gap-2.5 border-b border-gray-100 hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        >
                          <PenTool size={16} className="text-[#1B50E8] flex-shrink-0" />
                          <span className="text-[#1B50E8] font-bold text-[12px] tracking-tight">
                            Author Workspace
                          </span>
                        </Link>
                      );
                    }
                    return (
                      <Link
                        href="/reader"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="px-4 py-2.5 flex items-center gap-2.5 border-b border-gray-100 hover:bg-red-50/40 transition-colors cursor-pointer group"
                      >
                        <BookOpen size={16} className="text-[#BF1E2D] flex-shrink-0" />
                        <span className="text-[#BF1E2D] font-bold text-[12px] tracking-tight">
                          Reader Dashboard
                        </span>
                      </Link>
                    );
                  })()}

                  {/* Section 3: Profile Settings */}
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      setIsProfileSettingsOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <User size={16} className="text-slate-500 group-hover:text-slate-800 flex-shrink-0" />
                    <span className="text-slate-800 font-bold text-[12px] tracking-tight">
                      Profile Settings
                    </span>
                  </button>

                  {/* Section 4: Sign Out Terminal */}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <LogOut size={16} className="text-red-500 group-hover:text-red-700 flex-shrink-0" />
                    <span className="text-red-600 font-bold text-[12px] tracking-tight">
                      Sign Out Terminal
                    </span>
                  </button>

                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-1.5 text-gray-800 hover:text-[#BF1E2D] font-bold text-xs sm:text-sm px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <User size={17} strokeWidth={2.2} className="text-[#BF1E2D]" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Red Subscribe Button */}
          <Link
            href="/subscribe"
            className="bg-[#BF1E2D] hover:bg-red-700 text-white font-bold text-[10px] sm:text-[12px] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors whitespace-nowrap shadow-xs uppercase tracking-wider flex items-center justify-center shrink-0"
          >
            Subscribe
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-800 hover:text-[#BF1E2D] p-1 rounded-md hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>

      {/* ================= ROW 2: CATEGORY NAVIGATION BAR ================= */}
      <div className="w-full border-t border-b border-gray-200 bg-white relative z-40 max-w-full overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 w-full max-w-full">
          
          {/* Main Horizontal Category Nav Items */}
          <nav className="flex items-center space-x-1.5 sm:space-x-3 lg:space-x-4 py-2 text-[12px] sm:text-[13.5px] font-bold overflow-x-auto scrollbar-none w-full max-w-full">
            {navCategories.map((cat) => (
              <div
                key={cat.name}
                className="relative flex items-center"
                onMouseEnter={() => {
                  if (cat.name === "World") {
                    setActiveMenu("WORLD");
                  } else {
                    setActiveMenu(null);
                  }
                }}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {cat.name === "World" ? (
                  <div className="flex items-center gap-1 border-b-2 border-[#BF1E2D] pb-0.5 px-1.5">
                    <Link
                      href="/news/world"
                      className="transition-colors text-gray-900 font-bold hover:text-[#BF1E2D]"
                    >
                      <span>World</span>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveMenu(activeMenu === "WORLD" ? null : "WORLD");
                      }}
                      className="cursor-pointer bg-transparent border-none outline-none p-0.5"
                      aria-label="Toggle World Menu"
                    >
                      <ChevronDown size={12} strokeWidth={2.5} className="text-gray-500 hover:text-[#BF1E2D]" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href={cat.href}
                    className="flex items-center gap-1 whitespace-nowrap px-2 py-0.5 rounded transition-colors text-gray-800 hover:text-[#BF1E2D] hover:bg-gray-50"
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
                    <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-4 text-left font-sans">
                      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-150">
                        <h4 className="text-[11px] font-extrabold uppercase text-[#BF1E2D] tracking-wider">
                          Top Countries & Regions
                        </h4>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Select Country</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1 max-h-[320px] overflow-y-auto scrollbar-thin">
                        {topCountriesList.map((country, i) => (
                          <Link
                            key={i}
                            href={country.href}
                            onClick={() => setActiveMenu(null)}
                            className="flex items-center justify-between py-2 px-3 rounded-lg text-gray-800 hover:bg-red-50 hover:text-[#BF1E2D] cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-base leading-none">{country.flag}</span>
                              <span className="text-xs font-bold">{country.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {country.region}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Far Right Edition Selector */}
          <div className="hidden lg:flex items-center pl-4 border-l border-gray-200 relative flex-shrink-0">
            <button
              onClick={() => setIsEditionOpen(!isEditionOpen)}
              className="flex items-center gap-1.5 text-[12.5px] font-bold text-gray-700 hover:text-[#BF1E2D] cursor-pointer py-1 px-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <span>{selectedEdition}</span>
              <ChevronDown size={12} strokeWidth={2.5} className="text-gray-400" />
            </button>

            {isEditionOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                {["US Edition", "Canada Edition", "Global Edition", "UK Edition"].map((ed) => (
                  <button
                    key={ed}
                    onClick={() => { setSelectedEdition(ed); setIsEditionOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-[#BF1E2D] transition-colors"
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
      <div className="w-full bg-[#F8F9FA] border-b border-gray-200 py-1.5 text-xs font-medium text-gray-700">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* LEFT: TRENDING LABEL & TOPICS */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="bg-[#BF1E2D]/10 text-[#BF1E2D] font-extrabold uppercase text-[10px] sm:text-[11px] px-2 py-0.5 rounded tracking-wider flex-shrink-0">
              TRENDING
            </span>

            <div className="flex items-center gap-2.5 text-[12px] whitespace-nowrap text-gray-700">
              {trendingTopics.map((topic, index) => (
                <div key={topic.name} className="flex items-center gap-2.5">
                  <Link href={topic.href} className="hover:text-[#BF1E2D] transition-colors font-medium">
                    {topic.name}
                  </Link>
                  {index < trendingTopics.length - 1 && <span className="text-gray-300">•</span>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: DATE, LOCATION & WEATHER WIDGET */}
          <div className="hidden lg:flex items-center gap-3 text-[11.5px] text-gray-500 font-medium flex-shrink-0">
            <span>Tuesday, July 13, 2026</span>
            <span className="text-gray-300">•</span>
            <span>New York, USA</span>
            <span className="text-gray-300">•</span>
            
            {/* Weather Pill */}
            <div className="flex items-center gap-1 text-gray-800 font-semibold cursor-pointer hover:text-[#BF1E2D] bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs transition-colors">
              <span className="text-amber-500 text-xs">⛅</span>
              <span>26°C</span>
              <ChevronDown size={11} strokeWidth={2.5} className="text-gray-400" />
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-900 border-t border-gray-200 py-4 px-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search news, topics, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (typeof window !== "undefined" && window.location.pathname !== "/search") {
                  setIsMobileMenuOpen(false);
                  window.location.href = searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : "/search";
                }
              }}
              onClick={() => {
                if (typeof window !== "undefined" && window.location.pathname !== "/search") {
                  setIsMobileMenuOpen(false);
                  window.location.href = searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : "/search";
                }
              }}
              className="w-full pl-4 pr-10 py-2.5 text-xs border border-gray-300 rounded-full focus:outline-none focus:border-[#BF1E2D] bg-gray-50 text-gray-900 cursor-pointer"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
              <Search size={16} />
            </button>
          </form>

          {/* Action Row 1: Subscribe & Newsletter */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/subscribe"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-[#BF1E2D] hover:bg-red-700 text-white text-center font-extrabold text-xs py-2.5 rounded-md shadow-xs uppercase tracking-wider flex items-center justify-center gap-1"
            >
              <span>Subscribe Now</span>
            </Link>

            <Link
              href="/newsletters"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-gray-900 hover:bg-black text-white text-center font-bold text-xs py-2.5 rounded-md shadow-xs flex items-center justify-center gap-1"
            >
              <Mail size={14} />
              <span>Newsletter</span>
            </Link>
          </div>

          {/* User Profile Section in Mobile Drawer */}
          {currentUser ? (
            <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200 space-y-3 font-sans">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#BF1E2D] text-white font-bold flex items-center justify-center text-sm shadow-xs uppercase overflow-hidden shrink-0">
                  {currentUser.avatar && (currentUser.avatar.startsWith("/") || currentUser.avatar.startsWith("data:")) ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{(currentUser.name || "U").charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {currentUser.name || "rushdhi"}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate font-mono">
                    {currentUser.email || "rushdhiriyaj2005@gmail.com"}
                  </p>
                  <span className="inline-block mt-0.5 px-2 py-0.2 bg-red-100 text-[#BF1E2D] font-extrabold text-[8.5px] uppercase tracking-wider rounded">
                    {currentUser.role || "READER"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-200">
                {(currentUser.role === "Admin" || currentUser.role === "Co-Admin" || (currentUser.email || "").toLowerCase().includes("admin")) && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {(() => {
                  const email = (currentUser.email || "").toLowerCase().trim();
                  const isSystemWriterOrAdmin =
                    email === "writer@digitaljournal.com" ||
                    email === "admin@digitaljournal.com" ||
                    email === "coadmin@digitaljournal.com" ||
                    email.includes("admin");

                  let isApproved = isSystemWriterOrAdmin;
                  if (!isApproved && email && typeof window !== "undefined") {
                    const writersListStr = localStorage.getItem("dj_writers_list");
                    if (writersListStr) {
                      try {
                        const wList: any[] = JSON.parse(writersListStr);
                        isApproved = wList.some((w: any) => w.email && w.email.toLowerCase().trim() === email && w.status === "Active");
                      } catch (e) {
                        console.warn(e);
                      }
                    }
                  }

                  if (isApproved) {
                    return (
                      <Link
                        href="/writer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 py-2.5 px-3 bg-blue-50/80 text-[#1B50E8] rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <PenTool size={16} className="text-[#1B50E8]" />
                        <span>Author Workspace</span>
                      </Link>
                    );
                  }
                  return (
                    <Link
                      href="/reader"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 py-2.5 px-3 bg-red-50/80 text-[#BF1E2D] rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                      <BookOpen size={16} className="text-[#BF1E2D]" />
                      <span>Reader Dashboard</span>
                    </Link>
                  );
                })()}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 py-2.5 px-3 bg-white text-slate-800 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors text-left"
                >
                  <User size={16} className="text-slate-500" />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-2.5 py-2.5 px-3 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors text-left"
                >
                  <LogOut size={16} className="text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1 pb-2 border-b border-gray-100">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-center font-bold text-xs py-2.5 rounded-md border border-gray-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <User size={15} className="text-[#BF1E2D]" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 bg-slate-900 hover:bg-black text-white text-center font-bold text-xs py-2.5 rounded-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Register Account</span>
              </Link>
            </div>
          )}

          {/* Category Navigation Links */}
          <div className="pt-1">
            <h5 className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-2">
              Browse Categories
            </h5>
            <div className="grid grid-cols-2 gap-2">
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
        </div>
      )}

      {/* Profile Settings Modal matching user screenshot */}
      {isProfileSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative text-left overflow-hidden border-t-[5px] border-[#BF1E2D]">
            
            {/* Close Button */}
            <button
              onClick={() => setIsProfileSettingsOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header Title Section */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-[22px] font-serif font-bold text-slate-900 leading-snug">
                Profile Settings
              </h2>
              <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase mt-0.5 font-sans">
                MANAGE YOUR ACCOUNT
              </p>
            </div>

            {/* Avatar & Photo Section */}
            <div className="flex items-center gap-4 px-6 pt-6 pb-2">
              <img
                src={profileAvatar || currentUser?.avatar || "/author_bluesuit.jpg"}
                alt={profileName || "Nesto Super"}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs flex-shrink-0"
              />

              <div>
                <label className="text-[#005691] font-bold text-xs sm:text-sm hover:underline cursor-pointer block">
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-500 font-sans tracking-tight mt-0.5">
                  {currentUser?.email || "nestosuper2024@gmail.com"}
                </p>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider rounded uppercase inline-block mt-1.5 font-sans">
                  {currentUser?.role || "READER"}
                </span>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfileSettings} className="px-6 pt-4 pb-6 space-y-4 font-sans">
              
              {/* Field 1: FULL NAME */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#005691] focus:ring-1 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Field 2: BIO */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  BIO
                </label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="New Washington Global Times subscriber via Google."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#005691] focus:ring-1 focus:ring-blue-100 transition-all leading-relaxed"
                />
              </div>

              {/* Field 3: LINKEDIN PROFILE */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  LINKEDIN PROFILE
                </label>
                <div className="relative rounded-xl border-2 border-[#005691] px-3.5 py-2.5 flex items-center gap-2.5 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <svg
                    className="w-5 h-5 text-[#005691] fill-[#005691] flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/your-profile"
                    value={profileLinkedin}
                    onChange={(e) => setProfileLinkedin(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-normal mt-1.5 leading-normal">
                  Shown on your article bylines so readers can connect with you.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileSettingsOpen(false)}
                  className="flex-1 py-3.5 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-4 bg-[#005691] hover:bg-[#00416d] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer text-center"
                >
                  SAVE CHANGES
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </header>
  );
}