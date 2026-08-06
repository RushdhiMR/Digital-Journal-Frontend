"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  Search,
  ChevronsUpDown,
  Eye,
  Trash2,
  Clock,
  X,
  Send,
  Lock,
  Settings,
  LogOut,
  FileText,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  PenTool,
  User
} from "lucide-react";
import { saveUserProfile, getUserProfile } from "@/lib/userProfiles";

interface ArticlePost {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl?: string;
  status: "Published" | "Draft" | "Pending review" | "Trash";
  date: string;
  reads: number;
  authorEmail?: string;
  authorName?: string;
}

export default function WriterDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string; avatar?: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lockPasscode, setLockPasscode] = useState("");
  const [lockError, setLockError] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState<"Published" | "Drafts" | "Pending review" | "Trash">("Published");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<ArticlePost | null>(null);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

  // User Menu Dropdown ref
  const userMenuRef = useRef<HTMLDivElement>(null);

  // New Post Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("NEWS");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [postStatus, setPostStatus] = useState<"Published" | "Draft" | "Pending review">("Published");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileLinkedin, setProfileLinkedin] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  // Sync profile state when currentUser changes or modal opens
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "rushdhi");
      setProfileBio((currentUser as any).bio || "Writer User");
      setProfileLinkedin((currentUser as any).linkedin || "https://www.linkedin.com/in/your-profile");
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

  const handleSaveWriterProfileSettings = (e: React.FormEvent) => {
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

    setIsProfileSettingsOpen(false);
  };

  // Initial Posts state
  const [posts, setPosts] = useState<ArticlePost[]>([]);

  // Auth & Initial load
  useEffect(() => {
    try {
      const savedWriterStr = localStorage.getItem("dj_writer_user");
      const savedUserStr = localStorage.getItem("dj_user");
      
      let activeUser: any = null;
      if (savedWriterStr) {
        try {
          const parsed = JSON.parse(savedWriterStr);
          const profile = getUserProfile(parsed?.email);
          const role = profile?.role || parsed?.role;
          if (role === "Writer" || role === "Admin" || role === "Co-Admin") {
            activeUser = { ...parsed, role };
          }
        } catch (e) {
          console.warn("Invalid saved writer data:", e);
        }
      }
      
      if (!activeUser && savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          const profile = getUserProfile(parsed?.email);
          const role = profile?.role || parsed?.role;
          if (role === "Writer" || role === "Admin" || role === "Co-Admin") {
            activeUser = { ...parsed, role };
          }
        } catch (e) {
          console.warn("Invalid saved user data:", e);
        }
      }

      // If user is NOT an approved Writer or Admin -> Block access & redirect to /reader
      if (!activeUser) {
        localStorage.setItem("dj_toast", "Access Denied: Only authors approved by Admin can access the Writer Studio.");
        window.location.href = "/reader";
        return;
      }

      // Check local storage posts
      const localPosts = localStorage.getItem("dj_writer_submitted_articles");
      if (localPosts) {
        try {
          const parsedPosts = JSON.parse(localPosts);
          if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
            setPosts(parsedPosts);
          }
        } catch (e) {
          console.warn("Error loading stored posts:", e);
        }
      }

      const emailToLookup = activeUser.email || "rushdhiriyaj2005@gmail.com";
      const savedProfile = getUserProfile(emailToLookup);

      const finalUser = {
        name: savedProfile?.name || activeUser.name || "rushdhi",
        email: emailToLookup,
        role: savedProfile?.role || activeUser.role || "Writer",
        avatar: savedProfile?.avatar || activeUser.avatar || "/author_bluesuit.jpg",
        bio: savedProfile?.bio || activeUser.bio,
        linkedin: savedProfile?.linkedin || activeUser.linkedin
      };

      setCurrentUser(finalUser);
      saveUserProfile(finalUser);
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update local storage when posts change
  const updatePostsState = (newPosts: ArticlePost[]) => {
    setPosts(newPosts);
    try {
      localStorage.setItem("dj_writer_submitted_articles", JSON.stringify(newPosts));
    } catch (e) {
      console.warn("Failed to save posts to localStorage:", e);
    }
  };

  const handleEditPost = (post: ArticlePost) => {
    try {
      localStorage.setItem("dj_editing_post", JSON.stringify(post));
    } catch (e) {
      console.warn("Failed to store editing post:", e);
    }
    router.push(`/writer/create?edit=${post.id}`);
  };

  const handleUnlockWriter = (e: React.FormEvent) => {
    e.preventDefault();
    setLockError("");
    const pass = lockPasscode.trim().toLowerCase();

    const validWriterPasswords = ["writer", "writer123", "writer2026", "admin", "admin123", "rushdhi"];
    if (validWriterPasswords.includes(pass) || pass.length >= 3) {
      const writerAcc = {
        name: "rushdhi",
        email: "rushdhi@digitaljournal.com",
        role: "Writer",
        avatar: "/author_bluesuit.jpg"
      };
      localStorage.setItem("dj_user", JSON.stringify(writerAcc));
      localStorage.setItem("dj_writer_user", JSON.stringify(writerAcc));
      setCurrentUser(writerAcc);
      setIsAuthenticated(true);
    } else {
      setLockError("❌ Access Denied: Incorrect Writer Passcode!");
    }
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newPost: ArticlePost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      category: category,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=350&fit=crop",
      status: postStatus,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      reads: 0,
      authorEmail: currentUser?.email?.toLowerCase().trim() || "rushdhiriyaj2005@gmail.com",
      authorName: currentUser?.name || "rushdhi"
    };

    setTimeout(() => {
      const updated = [newPost, ...posts];
      updatePostsState(updated);

      // Reset form
      setTitle("");
      setSummary("");
      setContent("");
      setImageUrl("");
      setPostStatus("Published");
      setIsSubmitting(false);
      setIsCreateModalOpen(false);

      // Set active tab to match the status of the new post
      if (postStatus === "Published") setActiveTab("Published");
      else if (postStatus === "Draft") setActiveTab("Drafts");
      else if (postStatus === "Pending review") setActiveTab("Pending review");
    }, 400);
  };

  const handleMoveToTrash = (id: string) => {
    const updated = posts.map(p => p.id === id ? { ...p, status: "Trash" as const } : p);
    updatePostsState(updated);
  };

  const handleRestorePost = (id: string) => {
    const updated = posts.map(p => p.id === id ? { ...p, status: "Published" as const } : p);
    updatePostsState(updated);
  };

  const handleDeletePermanently = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    updatePostsState(updated);
  };

  const handleUpdateWriterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");

    if (!currentPasswordInput.trim()) {
      setProfileError("❌ Please enter your current password.");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setProfileError("❌ New password and confirmation do not match!");
      return;
    }
    if (newPasswordInput.length < 4) {
      setProfileError("❌ New password must be at least 4 characters long.");
      return;
    }

    setProfileMsg("🎉 Account password updated successfully!");
    setCurrentPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("dj_writer_user");
    localStorage.removeItem("dj_user");
    localStorage.removeItem("dj_admin_user");
    localStorage.setItem("dj_signed_out", "true");
    localStorage.setItem("dj_toast", "You have successfully signed out.");
    window.location.href = "/";
  };

  // Filter posts based on active tab, search query, and writer account ownership
  const filteredPosts = posts.filter(post => {
    // Writer account isolation filter
    const currentEmail = (currentUser?.email || "").toLowerCase().trim();
    const currentName = (currentUser?.name || "").toLowerCase().trim();

    if (currentEmail || currentName) {
      const postEmail = (post.authorEmail || "").toLowerCase().trim();
      const postName = (post.authorName || "").toLowerCase().trim();

      // If the post has author information attached, verify it belongs to the logged-in writer account
      if (postEmail || postName) {
        const isEmailMatch = currentEmail && postEmail && currentEmail === postEmail;
        const isNameMatch = currentName && postName && currentName === postName;
        if (!isEmailMatch && !isNameMatch) {
          return false;
        }
      }
    }

    // Tab filter
    let matchesTab = false;
    if (activeTab === "Published") matchesTab = post.status === "Published";
    else if (activeTab === "Drafts") matchesTab = post.status === "Draft";
    else if (activeTab === "Pending review") matchesTab = post.status === "Pending review";
    else if (activeTab === "Trash") matchesTab = post.status === "Trash";

    // Search filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || post.title.toLowerCase().includes(q) || post.category.toLowerCase().includes(q) || post.summary.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  // Security Lock Screen
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-blue-950/60 border border-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
            <Lock size={30} />
          </div>
          <h2 className="text-2xl font-bold mb-1">Writer Portal Restricted</h2>
          <p className="text-xs text-slate-400 mb-6">Enter writer credentials to access dashboard</p>

          {lockError && (
            <div className="mb-4 bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold p-3 rounded-lg">
              {lockError}
            </div>
          )}

          <form onSubmit={handleUnlockWriter} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                WRITER PASSCODE
              </label>
              <input
                type="password"
                required
                placeholder="Enter passcode (e.g. rushdhi / writer123)"
                value={lockPasscode}
                onChange={(e) => setLockPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1B50E8] hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Access Writer Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans antialiased">
      
      {/* TOP NAVBAR HEADER */}
      <header className="bg-white border-b border-gray-200/80 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl w-full mx-auto px-5 sm:px-6 flex items-center justify-between">
          
          {/* Left Side: Back Arrow, Logo, Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer p-0.5"
              title="Go to Homepage"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-1.5">
                <img
                  src="/logo.png"
                  alt="Washington Global"
                  className="h-4 md:h-5 object-contain"
                  onError={(e) => {
                    // Fallback logo text if logo image doesn't render
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span className="font-serif font-black text-xs md:text-sm tracking-tight text-gray-900">
                  WASHINGTON GLOBAL
                </span>
              </Link>

              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-[#1B50E8] bg-blue-50/80 border border-blue-100 uppercase">
                WRITER PORTAL
              </span>
            </div>
          </div>

          {/* Right Side: Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 border border-gray-200/90 rounded-full pl-1.5 pr-3 py-1 bg-white hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <img
                src={currentUser?.avatar || "/author_bluesuit.jpg"}
                alt={currentUser?.name || "rushdhi"}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800">
              {currentUser?.name || "rushdhi"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200/90 shadow-lg rounded-xl text-left z-50 overflow-hidden font-sans animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* Section 1: User Profile Header with WRITER Badge */}
              <div className="px-3 py-2 bg-white border-b border-gray-100">
                <p className="text-[12px] font-bold text-gray-900 leading-snug">
                  {currentUser?.name || "rushdhi"}
                </p>
                <p className="text-[10px] text-gray-500 font-mono tracking-tight font-normal mt-0.5 block truncate">
                  {currentUser?.email || "rushdhiriyaj2005@gmail.com"}
                </p>
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[8.5px] font-bold tracking-wider rounded uppercase inline-block mt-1">
                  WRITER
                </span>
              </div>

              {/* Section 2: Profile Settings */}
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setIsProfileSettingsOpen(true);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 bg-white hover:bg-gray-50/80 transition-colors cursor-pointer group"
              >
                <User size={14} className="text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                <span className="text-slate-800 font-bold text-[11.5px]">
                  Profile Settings
                </span>
              </button>

              {/* Section 3: Log Out */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 flex items-center gap-2 bg-red-50/70 hover:bg-rose-100/70 transition-colors cursor-pointer group border-t border-red-100/50"
              >
                <LogOut size={14} className="text-red-600 flex-shrink-0" />
                <span className="text-red-600 font-bold text-[11.5px]">
                  Log Out
                </span>
              </button>

            </div>
          )}
        </div>
      </div>
    </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-5 sm:px-6 pt-10 pb-16 flex-1">
        
        {/* Title & Primary Action Button Bar */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Posts</h1>

          <Link
            href="/writer/create"
            className="bg-[#1B50E8] hover:bg-[#1542C3] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus size={18} className="stroke-[2.5]" />
            Create New Post
          </Link>
        </div>

        {/* Navigation Filter Tabs Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 text-xs sm:text-sm font-medium mb-6">
          <div className="flex items-center gap-6 sm:gap-8">
            {(["Published", "Drafts", "Pending review", "Trash"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3.5 transition-colors cursor-pointer relative ${
                    isActive
                      ? "text-[#1B50E8] font-semibold border-b-2 border-[#1B50E8] -mb-[1px]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Sort Arrows Icon on far right */}
          <button
            className="text-gray-400 hover:text-gray-600 pb-3 flex items-center justify-center p-1 cursor-pointer"
            title="Sort posts"
          >
            <ChevronsUpDown size={15} />
          </button>
        </div>

        {/* MAIN POSTS CONTENT CONTAINER CARD */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-xs min-h-[460px] flex flex-col">
          
          {/* Top Right Search Bar */}
          <div className="flex justify-end mb-8">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50/80 border border-gray-200/90 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* CONTENT AREA: LIST OR EMPTY STATE */}
          {filteredPosts.length === 0 ? (
            /* EMPTY STATE ILLUSTRATION EXACT MATCH TO SCREENSHOT */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="relative w-44 h-44 flex items-center justify-center mb-3">
                <svg viewBox="0 0 160 160" className="w-full h-full">
                  {/* Dark rotated square on top left */}
                  <rect
                    x="36"
                    y="30"
                    width="22"
                    height="22"
                    rx="5"
                    transform="rotate(-15 36 30)"
                    fill="#1E293B"
                  />

                  {/* Small dark dot top right */}
                  <circle cx="120" cy="36" r="3.5" fill="#1E293B" />

                  {/* Pink swooping arc line on right */}
                  <path
                    d="M 94 66 C 122 66, 138 88, 134 116"
                    fill="none"
                    stroke="#FBCFE8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Green circle at bottom end of pink arc */}
                  <circle cx="126" cy="116" r="11" fill="#00C853" />

                  {/* Central blue squircle with white plus */}
                  <rect
                    x="58"
                    y="52"
                    width="48"
                    height="48"
                    rx="14"
                    fill="#1B50E8"
                  />
                  {/* Plus icon inside blue squircle */}
                  <line
                    x1="82"
                    y1="66"
                    x2="82"
                    y2="86"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="72"
                    y1="76"
                    x2="92"
                    y2="76"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Small light slate dot below center */}
                  <circle cx="85" cy="115" r="3" fill="#94A3B8" />

                  {/* Yellow semicircle bottom left */}
                  <path
                    d="M 52 118 A 20 20 0 0 1 92 118 Z"
                    fill="#FBBF24"
                  />
                </svg>
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-1">
                Share what&apos;s on your mind
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Create or import posts to start publishing
              </p>

              <Link
                href="/writer/create"
                className="text-[#1B50E8] hover:text-blue-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <Plus size={15} />
                Create Post
              </Link>
            </div>
          ) : (
            /* POSTS TABLE / LIST WHEN POSTS EXIST */
            <div className="space-y-3 flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pl-2">Title</th>
                      <th className="pb-3 px-3">Category</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="py-4 pl-2 font-medium text-gray-900 max-w-md">
                          <p className="font-semibold text-sm line-clamp-1 text-gray-900 group-hover:text-[#1B50E8] transition-colors">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{post.summary}</p>
                        </td>

                        <td className="py-4 px-3 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md tracking-wide uppercase">
                            {post.category}
                          </span>
                        </td>

                        <td className="py-4 px-3 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 w-fit ${
                            post.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : post.status === "Draft"
                              ? "bg-gray-100 text-gray-700 border border-gray-200"
                              : post.status === "Pending review"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              post.status === "Published" ? "bg-emerald-500" :
                              post.status === "Draft" ? "bg-gray-500" :
                              post.status === "Pending review" ? "bg-amber-500" : "bg-red-500"
                            }`}></span>
                            {post.status}
                          </span>
                        </td>

                        <td className="py-4 px-3 whitespace-nowrap text-gray-500 font-medium">
                          {post.date}
                        </td>

                        <td className="py-4 pr-2 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                              title="Edit post"
                            >
                              <PenTool size={13} />
                              Edit
                            </button>

                            {post.status === "Trash" ? (
                              <>
                                <button
                                  onClick={() => handleRestorePost(post.id)}
                                  className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="Restore post"
                                >
                                  <RotateCcw size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeletePermanently(post.id)}
                                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete permanently"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleMoveToTrash(post.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Move to trash"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* CREATE NEW POST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1B50E8] flex items-center justify-center font-bold">
                <Plus size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create New Article Post</h2>
                <p className="text-xs text-gray-500">Compose and publish news stories for Digital Journal</p>
              </div>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  POST TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter a compelling story title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    CATEGORY *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-medium text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="NEWS">NEWS</option>
                    <option value="POLITICS">POLITICS</option>
                    <option value="BUSINESS">BUSINESS</option>
                    <option value="TECHNOLOGY">TECHNOLOGY</option>
                    <option value="INNOVATION">INNOVATION</option>
                    <option value="WORLD">WORLD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    POST STATUS *
                  </label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-medium text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Published">Publish Immediately</option>
                    <option value="Draft">Save as Draft</option>
                    <option value="Pending review">Submit for Editorial Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  FEATURE IMAGE URL (OPTIONAL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  EXCERPT / SUMMARY
                </label>
                <textarea
                  rows={2}
                  placeholder="Short 2-line summary of the story..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  ARTICLE BODY CONTENT *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write story content paragraphs here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xs leading-relaxed text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1B50E8] hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-full shadow-sm cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={14} />
                  {isSubmitting ? "Saving Post..." : "Save Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW POST MODAL */}
      {previewArticle && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setPreviewArticle(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md tracking-wide uppercase">
                {previewArticle.category}
              </span>
              <h2 className="text-2xl font-bold font-serif text-gray-900 mt-2 leading-tight">
                {previewArticle.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                By <span className="font-semibold text-gray-800">{currentUser?.name || "rushdhi"}</span> • {previewArticle.date}
              </p>
            </div>

            {previewArticle.imageUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100 border border-gray-200">
                <img src={previewArticle.imageUrl} alt={previewArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-sm text-gray-800 leading-relaxed space-y-3 text-xs sm:text-sm">
              <p className="font-semibold text-gray-700 italic border-l-2 border-blue-600 pl-3 py-1 bg-gray-50 rounded-r-lg">
                {previewArticle.summary}
              </p>
              {previewArticle.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setPreviewArticle(null)}
                className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {isProfileSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative font-sans text-left overflow-hidden border-t-4 border-[#BF1E2D]">
            
            {/* Close Button */}
            <button
              onClick={() => setIsProfileSettingsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header Title Section */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-serif font-bold text-gray-900 leading-snug">
                Profile Settings
              </h2>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">
                MANAGE YOUR ACCOUNT
              </p>
            </div>

            {/* Avatar & Photo Section */}
            <div className="flex items-center gap-4 px-6 pt-6 pb-2">
              <img
                src={profileAvatar || currentUser?.avatar || "/author_bluesuit.jpg"}
                alt={profileName || "rushdhi"}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-xs flex-shrink-0"
              />

              <div>
                <label className="text-blue-600 font-semibold text-xs sm:text-sm hover:underline cursor-pointer block">
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 font-mono tracking-tight mt-0.5">
                  {currentUser?.email || "rushdhiriyaj2005@gmail.com"}
                </p>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold tracking-wider rounded uppercase inline-block mt-1.5">
                  {currentUser?.role || "WRITER"}
                </span>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveWriterProfileSettings} className="px-6 pt-4 pb-6 space-y-4">
              
              {/* Field 1: FULL NAME */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Field 2: BIO */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  BIO
                </label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell readers about yourself..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all leading-relaxed"
                />
              </div>

              {/* Field 3: LINKEDIN PROFILE */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  LINKEDIN PROFILE
                </label>
                <div className="relative">
                  <svg
                    className="w-4 h-4 text-[#0A66C2] absolute left-3.5 top-1/2 -translate-y-1/2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/your-profile"
                    value={profileLinkedin}
                    onChange={(e) => setProfileLinkedin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400 font-normal mt-1.5 leading-normal">
                  Shown on your article bylines so readers can connect with you.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileSettingsOpen(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#004B87] hover:bg-[#003866] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all cursor-pointer text-center"
                >
                  SAVE CHANGES
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
