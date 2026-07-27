"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Bookmark, Bell, History, ArrowRight, Star, User, Settings, Lock, CheckCircle2, ShieldCheck, Mail, Sparkles, Trash2 } from "lucide-react";

export default function ReaderHubPage() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string; bio?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"saved" | "settings">("saved");

  // Dynamic Saved Bookmarks state
  const [savedArticles, setSavedArticles] = useState<any[]>([]);

  // Profile Settings Form State
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileBio, setProfileBio] = useState("Avid reader of global economics, artificial intelligence, and clean energy innovation.");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Preference Toggles
  const [notifyBreaking, setNotifyBreaking] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [publicHistory, setPublicHistory] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getUserBookmarkStorageKey = (userEmail?: string): string => {
    const activeEmail = userEmail || currentUser?.email || "guest";
    const sanitizedEmail = activeEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
    return `dj_bookmarks_${sanitizedEmail}`;
  };

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("dj_user");
      let activeEmail = "reader@digitaljournal.com";

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setProfileName(parsed.name || "Alex Reader");
        setProfileEmail(parsed.email || "reader@digitaljournal.com");
        if (parsed.email) activeEmail = parsed.email;
        if (parsed.bio) setProfileBio(parsed.bio);
      } else {
        window.location.href = "/login";
        return;
      }

      // Load Account-Scoped Saved Bookmarks from LocalStorage
      const userKey = getUserBookmarkStorageKey(activeEmail);
      const savedBookmarksStr = localStorage.getItem(userKey);
      if (savedBookmarksStr) {
        setSavedArticles(JSON.parse(savedBookmarksStr));
      } else {
        // First-time default bookmark initialization for this specific account
        const initialBookmarks = [
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
          }
        ];
        localStorage.setItem(userKey, JSON.stringify(initialBookmarks));
        setSavedArticles(initialBookmarks);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRemoveBookmark = (titleToRemove: string) => {
    const userKey = getUserBookmarkStorageKey();
    const updated = savedArticles.filter((art) => art.title !== titleToRemove);
    setSavedArticles(updated);
    localStorage.setItem(userKey, JSON.stringify(updated));
    showToast("Removed from your account Saved Reading List.");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      showToast("❌ Name and Email cannot be empty.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showToast("❌ New password and confirmation do not match.");
      return;
    }

    const updatedUser = {
      ...currentUser,
      name: profileName.trim(),
      email: profileEmail.trim(),
      bio: profileBio.trim(),
      role: currentUser?.role || "Reader"
    };

    localStorage.setItem("dj_user", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setNewPassword("");
    setConfirmPassword("");

    showToast("✓ Reader Profile Settings updated successfully!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-standard-sans">
      <Header />

      {toastMessage && (
        <div className="w-full bg-[#165c61] text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-md animate-fade-in z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8">
        
        {/* Reader Header Card */}
        <div className="bg-zinc-900 text-white rounded-xl p-6 md:p-8 mb-6 shadow-xl border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
              <BookOpen size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold font-serif">Reader Preferences Hub</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {currentUser?.role || "READER ROLE"}
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

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 mb-8 font-sans">
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "saved"
                ? "border-[#BF1E2D] text-[#BF1E2D]"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Bookmark size={16} />
            Saved Reading List ({savedArticles.length})
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "border-[#BF1E2D] text-[#BF1E2D]"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Settings size={16} />
            Reader Profile & Settings
          </button>
        </div>

        {/* TAB 1: SAVED READING LIST */}
        {activeTab === "saved" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Saved Articles */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                <h2 className="text-xl font-bold text-black font-serif flex items-center gap-2">
                  <Bookmark size={20} className="text-[#BF1E2D]" />
                  Saved Reading List
                </h2>
                <Link href="/news" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                  Browse Latest Stories <ArrowRight size={14} />
                </Link>
              </div>

              {savedArticles.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 font-sans">
                  <Bookmark size={36} className="mx-auto mb-3 text-zinc-300" />
                  <p className="text-sm font-medium mb-4">You have no saved articles in your reading list.</p>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 bg-[#BF1E2D] hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded transition-colors shadow"
                  >
                    Explore Latest Stories <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {savedArticles.map((art, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-5 pb-6 border-b border-zinc-100 last:border-none group relative">
                      <Link href={art.href} className="relative w-full sm:w-[200px] h-[130px] flex-shrink-0 overflow-hidden bg-gray-100 rounded border border-zinc-200 block">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </Link>
                      <div className="flex flex-col flex-1 pr-8">
                        <span className="text-[10px] font-bold text-[#1D9BF0] uppercase tracking-wider mb-1">
                          {art.category}
                        </span>
                        <Link href={art.href} className="font-serif text-[18px] font-bold text-black group-hover:text-[#BF1E2D] transition-colors leading-snug mb-2">
                          {art.title}
                        </Link>
                        <span className="text-[11px] text-zinc-400 font-sans mt-auto">{art.date}</span>
                      </div>

                      {/* Remove Bookmark Button */}
                      <button
                        onClick={() => handleRemoveBookmark(art.title)}
                        className="absolute top-0 right-0 text-zinc-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-zinc-100 cursor-pointer"
                        title="Remove from Saved List"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reader Digest Sidebar */}
            <div className="lg:col-span-4 space-y-6">
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
                </div>
              </div>

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
        )}

        {/* TAB 2: READER PROFILE SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl border border-zinc-200 p-6 md:p-10 shadow-sm font-sans">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200">
              <div>
                <h2 className="text-2xl font-bold text-black font-serif flex items-center gap-2">
                  <User size={24} className="text-[#BF1E2D]" />
                  Reader Account & Profile Settings
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Manage your personal account details, reading bio, and security preferences.
                </p>
              </div>

              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1 rounded flex items-center gap-1.5">
                <ShieldCheck size={14} /> Active Verified Reader
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              
              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">
                  PERSONAL INFORMATION
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded text-sm text-black focus:outline-none focus:border-[#BF1E2D] transition-colors"
                      placeholder="Enter Full Name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded text-sm text-black focus:outline-none focus:border-[#BF1E2D] transition-colors"
                      placeholder="Enter Email Address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    READING TAGLINE & BIO
                  </label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-300 rounded text-sm text-black focus:outline-none focus:border-[#BF1E2D] transition-colors resize-none"
                    placeholder="Brief bio or topics you follow..."
                  />
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2 flex items-center gap-2">
                  <Bell size={16} /> NOTIFICATION PREFERENCES
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded cursor-pointer hover:bg-zinc-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-black">Breaking News Push Notifications</p>
                      <p className="text-[11px] text-zinc-500">Receive instant alerts for major geopolitical and financial market developments.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyBreaking}
                      onChange={(e) => setNotifyBreaking(e.target.checked)}
                      className="accent-[#BF1E2D] w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded cursor-pointer hover:bg-zinc-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-black">Weekly Analytical Digest</p>
                      <p className="text-[11px] text-zinc-500">Receive a curated weekend summary of top long-form essays and technology reviews.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyWeekly}
                      onChange={(e) => setNotifyWeekly(e.target.checked)}
                      className="accent-[#BF1E2D] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Security & Passcode */}
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2 flex items-center gap-2">
                  <Lock size={16} /> SECURITY & PASSWORD
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      NEW PASSWORD (OPTIONAL)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded text-sm text-black focus:outline-none focus:border-[#BF1E2D] transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      CONFIRM NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded text-sm text-black focus:outline-none focus:border-[#BF1E2D] transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("saved")}
                  className="w-full sm:w-auto px-6 py-2.5 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-xs rounded transition-colors shadow cursor-pointer uppercase tracking-wider"
                >
                  Save Profile Settings
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
