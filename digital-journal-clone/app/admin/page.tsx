"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Settings,
  Plus,
  Search,
  LogOut,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Database,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Star,
  Zap,
  RefreshCw,
  UserCheck,
  Download,
  Filter,
  PenTool,
  BookOpen,
  UserPlus,
  BadgeCheck
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  category_name?: string;
  author_name?: string;
  is_featured?: boolean;
  is_editors_pick?: boolean;
  published_at?: string;
}

interface Writer {
  id: number;
  name: string;
  role: string;
  articlesCount: number;
  avatar: string;
  bio: string;
  status: "Active" | "On Leave";
}

interface Reader {
  id: number;
  name: string;
  email: string;
  membershipType: "Subscriber" | "Registered Reader" | "VIP Member";
  company?: string;
  joinedDate: string;
  status: "Active" | "Pending";
}

interface Stats {
  totalArticles: number;
  totalAuthors: number;
  totalSubscribers: number;
  totalUsers: number;
  monthlyViews: string;
  systemStatus: string;
  dbHost: string;
  lastBackup: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "articles" | "writers" | "readers" | "settings">("overview");

  // Dashboard Metrics & Data
  const [stats, setStats] = useState<Stats>({
    totalArticles: 5,
    totalAuthors: 5,
    totalSubscribers: 4,
    totalUsers: 4,
    monthlyViews: "128,450",
    systemStatus: "Healthy / Operational",
    dbHost: "localhost (digital_journal_db)",
    lastBackup: "2026-07-25 04:00 AM"
  });

  const [articles, setArticles] = useState<Article[]>([]);

  // Writers Data State
  const [writers, setWriters] = useState<Writer[]>([
    {
      id: 1,
      name: "Jennifer Friesen",
      role: "Associate Editor & Calgary Bureau Lead",
      articlesCount: 18,
      avatar: "/author_woman.jpg",
      bio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead.",
      status: "Active"
    },
    {
      id: 2,
      name: "Pramod Jain",
      role: "Senior Reporter - Logistics & Telemetry",
      articlesCount: 12,
      avatar: "/author_bluesuit.jpg",
      bio: "Pramod Jain reports on global supply chains and cloud migrations.",
      status: "Active"
    },
    {
      id: 3,
      name: "Chris Hogg",
      role: "Executive Editor - Fintech & Strategy",
      articlesCount: 24,
      avatar: "/author_beard.jpg",
      bio: "Chris Hogg is an executive editor specializing in digital transformation.",
      status: "Active"
    },
    {
      id: 4,
      name: "April Hicke",
      role: "Tech Analyst - Biotech & Open Science",
      articlesCount: 9,
      avatar: "/author_glasses.jpg",
      bio: "April Hicke reports on biotechnology, scientific research, and open science.",
      status: "Active"
    },
    {
      id: 5,
      name: "David Potter",
      role: "Senior Columnist - Architecture & DevOps",
      articlesCount: 15,
      avatar: "/author_bluesuit.jpg",
      bio: "David Potter focuses on software architecture, DevOps tooling, and developer metrics.",
      status: "Active"
    }
  ]);

  // Readers Data State
  const [readers, setReaders] = useState<Reader[]>([
    {
      id: 1,
      name: "John Doe",
      email: "reader@digitaljournal.com",
      membershipType: "Subscriber",
      company: "TechCorp",
      joinedDate: "2026-07-20",
      status: "Active"
    },
    {
      id: 2,
      name: "Rushdhi Riyaj",
      email: "rushdhiriyaj2005@gmail.com",
      membershipType: "VIP Member",
      company: "Digital Journal",
      joinedDate: "2026-07-22",
      status: "Active"
    },
    {
      id: 3,
      name: "Sarah Connor",
      email: "executive@enterprise.com",
      membershipType: "Registered Reader",
      company: "Cyberdyne Systems",
      joinedDate: "2026-07-24",
      status: "Active"
    },
    {
      id: 4,
      name: "Alex Morgan",
      email: "alex.morgan@research.org",
      membershipType: "Subscriber",
      company: "Global Science Lab",
      joinedDate: "2026-07-25",
      status: "Active"
    }
  ]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [writerSearch, setWriterSearch] = useState("");
  const [readerSearch, setReaderSearch] = useState("");

  // Modals state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isWriterModalOpen, setIsWriterModalOpen] = useState(false);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  // New Article Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Technology");
  const [newAuthor, setNewAuthor] = useState("Jennifer Friesen");
  const [newDescription, setNewDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditorsPick, setIsEditorsPick] = useState(false);

  // New Writer Form
  const [newWriterName, setNewWriterName] = useState("");
  const [newWriterRole, setNewWriterRole] = useState("Senior Reporter");
  const [newWriterBio, setNewWriterBio] = useState("");

  // New Reader Form
  const [newReaderName, setNewReaderName] = useState("");
  const [newReaderEmail, setNewReaderEmail] = useState("");
  const [newReaderMembership, setNewReaderMembership] = useState<"Subscriber" | "Registered Reader" | "VIP Member">("Subscriber");
  const [newReaderCompany, setNewReaderCompany] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth Check & Fetch
  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem("dj_admin_user");
      const savedUser = localStorage.getItem("dj_user");
      
      let currentUser = null;
      if (savedAdmin) {
        currentUser = JSON.parse(savedAdmin);
      } else if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === "Admin" || parsed.role === "admin") {
          currentUser = parsed;
        }
      }

      // If no admin user is logged in, default to the pre-configured default Admin account
      if (!currentUser) {
        currentUser = {
          name: "System Admin",
          email: "admin@digitaljournal.com",
          role: "Admin"
        };
        localStorage.setItem("dj_user", JSON.stringify(currentUser));
        localStorage.setItem("dj_admin_user", JSON.stringify(currentUser));
      }

      setAdminUser(currentUser);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
      const defaultAdmin = {
        name: "System Admin",
        email: "admin@digitaljournal.com",
        role: "Admin"
      };
      setAdminUser(defaultAdmin);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const artRes = await fetch("/api/admin/articles");
      if (artRes.ok) {
        const artData = await artRes.json();
        if (artData.articles) {
          setArticles(artData.articles);
        }
      }

      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.stats) {
          setStats(statsData.stats);
        }
      }
    } catch (err) {
      console.warn("Failed fetching admin data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dj_admin_user");
    router.push("/admin/login");
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Article Actions
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category_id: newCategory === "Technology" ? 4 : newCategory === "Business" ? 2 : 1,
          author_id: 1,
          is_featured: isFeatured,
          is_editors_pick: isEditorsPick
        })
      });

      const data = await res.json();
      if (data.success) {
        const newArt: Article = {
          id: Date.now(),
          title: newTitle,
          slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
          description: newDescription,
          category_name: newCategory,
          author_name: newAuthor,
          is_featured: isFeatured,
          is_editors_pick: isEditorsPick,
          published_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        setArticles([newArt, ...articles]);
        setStats(prev => ({ ...prev, totalArticles: prev.totalArticles + 1 }));
        setIsArticleModalOpen(false);
        setNewTitle("");
        setNewDescription("");
        showNotification("Article published successfully!");
      }
    } catch (err) {
      console.error(err);
      showNotification("Article published locally in admin view!");
    }
  };

  const handleDeleteArticle = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter(a => a.id !== id));
      setStats(prev => ({ ...prev, totalArticles: Math.max(0, prev.totalArticles - 1) }));
      showNotification("Article deleted.");
    }
  };

  const toggleFeatured = (id: number) => {
    setArticles(articles.map(a => a.id === id ? { ...a, is_featured: !a.is_featured } : a));
    showNotification("Article featured status updated.");
  };

  // Writer Actions
  const handleAddWriter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWriterName.trim()) return;

    const newW: Writer = {
      id: Date.now(),
      name: newWriterName,
      role: newWriterRole,
      articlesCount: 0,
      avatar: "/author_woman.jpg",
      bio: newWriterBio || `${newWriterName} is a accredited journalist for Digital Journal.`,
      status: "Active"
    };

    setWriters([newW, ...writers]);
    setStats(prev => ({ ...prev, totalAuthors: prev.totalAuthors + 1 }));
    setIsWriterModalOpen(false);
    setNewWriterName("");
    setNewWriterBio("");
    showNotification(`New writer "${newW.name}" added to staff roster!`);
  };

  const handleDeleteWriter = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove writer "${name}"?`)) {
      setWriters(writers.filter(w => w.id !== id));
      setStats(prev => ({ ...prev, totalAuthors: Math.max(0, prev.totalAuthors - 1) }));
      showNotification(`Writer "${name}" removed.`);
    }
  };

  // Reader Actions
  const handleAddReader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReaderEmail.trim()) return;

    const newR: Reader = {
      id: Date.now(),
      name: newReaderName || newReaderEmail.split('@')[0],
      email: newReaderEmail,
      membershipType: newReaderMembership,
      company: newReaderCompany || "Independent Reader",
      joinedDate: new Date().toISOString().split('T')[0],
      status: "Active"
    };

    setReaders([newR, ...readers]);
    setStats(prev => ({ ...prev, totalSubscribers: prev.totalSubscribers + 1 }));
    setIsReaderModalOpen(false);
    setNewReaderName("");
    setNewReaderEmail("");
    setNewReaderCompany("");
    showNotification(`New reader "${newR.email}" registered!`);
  };

  const handleDeleteReader = (id: number, email: string) => {
    if (confirm(`Remove reader record for "${email}"?`)) {
      setReaders(readers.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, totalSubscribers: Math.max(0, prev.totalSubscribers - 1) }));
      showNotification(`Reader "${email}" removed.`);
    }
  };

  // Filtered Lists
  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.author_name && a.author_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === "all" || (a.category_name && a.category_name.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const filteredWriters = writers.filter(w =>
    w.name.toLowerCase().includes(writerSearch.toLowerCase()) ||
    w.role.toLowerCase().includes(writerSearch.toLowerCase())
  );

  const filteredReaders = readers.filter(r =>
    r.name.toLowerCase().includes(readerSearch.toLowerCase()) ||
    r.email.toLowerCase().includes(readerSearch.toLowerCase()) ||
    (r.company && r.company.toLowerCase().includes(readerSearch.toLowerCase()))
  );

  if (isLoading || !adminUser) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-standard-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#BF1E2D] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Loading Admin Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-standard-sans text-zinc-800">
      {/* ADMIN HEADER BAR */}
      <header className="bg-black text-white border-t-4 border-[#165c61] shadow-md sticky top-0 z-40">
        {toastMessage && (
          <div className="w-full bg-[#BF1E2D] text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
              <span className="text-[18px] font-bold tracking-tight uppercase">DIGITAL JOURNAL</span>
            </Link>
            <span className="h-5 w-[1px] bg-zinc-700 hidden sm:block"></span>
            <div className="hidden sm:flex items-center gap-1.5 bg-[#BF1E2D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              ADMIN CONTROL CENTER
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Website
            </Link>

            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
              <div className="w-6 h-6 rounded-full bg-[#BF1E2D] text-white flex items-center justify-center font-bold text-xs uppercase">
                {adminUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-white font-bold text-[12px]">{adminUser.name}</p>
                <p className="text-[10px] text-zinc-400">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 px-3 py-1.5 rounded border border-rose-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="max-w-[1400px] w-full mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-[250px] flex-shrink-0">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden sticky top-20">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50">
              <p className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">ADMIN CONTROL MENU</p>
            </div>

            <nav className="p-2 space-y-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview & Stats
              </button>

              <button
                onClick={() => setActiveTab("articles")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "articles"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                Articles Manager
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === "articles" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                }`}>
                  {articles.length}
                </span>
              </button>

              {/* WRITERS TAB */}
              <button
                onClick={() => setActiveTab("writers")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "writers"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <PenTool className="w-4 h-4" />
                Writers & Editors
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === "writers" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                }`}>
                  {writers.length}
                </span>
              </button>

              {/* READERS TAB */}
              <button
                onClick={() => setActiveTab("readers")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "readers"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Readers & Users
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === "readers" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                }`}>
                  {readers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Settings className="w-4 h-4" />
                System Settings
              </button>
            </nav>

            <div className="p-4 border-t border-zinc-100 mt-2 bg-zinc-50 space-y-2">
              <button
                onClick={() => setIsArticleModalOpen(true)}
                className="w-full bg-zinc-900 hover:bg-black text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#BF1E2D]" />
                New Article
              </button>
              <button
                onClick={() => setIsWriterModalOpen(true)}
                className="w-full bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#165c61]" />
                Add Writer
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-black tracking-tight">Dashboard Overview</h1>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    System status, writers roster, readers telemetry, and editorial management summary.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWriterModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#165c61] bg-teal-50 border border-teal-200 hover:bg-teal-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    + Writer
                  </button>
                  <button
                    onClick={() => setIsReaderModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    + Reader
                  </button>
                </div>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Articles</span>
                    <div className="p-2 rounded-lg bg-red-50 text-[#BF1E2D]">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-black">{articles.length}</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                    <TrendingUp className="w-3 h-3" />
                    +12% this month
                  </div>
                </div>

                {/* WRITERS STAT CARD */}
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Writers & Editors</span>
                    <div className="p-2 rounded-lg bg-teal-50 text-[#165c61]">
                      <PenTool className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-black">{writers.length}</div>
                  <div className="text-[11px] font-bold text-[#165c61] mt-2 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Active Editorial Roster
                  </div>
                </div>

                {/* READERS STAT CARD */}
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Readers & Users</span>
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-black">{readers.length}</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-2">
                    <TrendingUp className="w-3 h-3" />
                    +24% registered readers
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Monthly Readers</span>
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-black">{stats.monthlyViews}</div>
                  <div className="text-[11px] font-medium text-zinc-500 mt-2">Verified Unique Visits</div>
                </div>
              </div>

              {/* SYSTEM STATUS CARD & RECENT WRITERS / READERS SUMMARY */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* System Status */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#BF1E2D]" />
                      System & Database Health
                    </h3>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-zinc-100">
                        <span className="text-zinc-500">Database Name</span>
                        <span className="font-bold text-black">digital_journal_db</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-zinc-100">
                        <span className="text-zinc-500">API Gateway</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-zinc-100">
                        <span className="text-zinc-500">Active Writers</span>
                        <span className="font-bold text-teal-700">{writers.length} Accredited Staff</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-zinc-500">Registered Readers</span>
                        <span className="font-bold text-blue-700">{readers.length} Active Readers</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    All Core Services Operational
                  </div>
                </div>

                {/* Writers Roster Preview */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-[#165c61]" />
                      Editorial Writers ({writers.length})
                    </h3>
                    <button onClick={() => setActiveTab("writers")} className="text-xs font-bold text-[#165c61] hover:underline">
                      Manage →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {writers.slice(0, 3).map((w) => (
                      <div key={w.id} className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200" />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-black truncate">{w.name}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{w.role}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold whitespace-nowrap">
                          {w.articlesCount} Articles
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Readers Telemetry Preview */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Active Readers ({readers.length})
                    </h3>
                    <button onClick={() => setActiveTab("readers")} className="text-xs font-bold text-blue-600 hover:underline">
                      Manage →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {readers.slice(0, 3).map((r) => (
                      <div key={r.id} className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-black truncate">{r.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{r.email}</p>
                        </div>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold whitespace-nowrap">
                          {r.membershipType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ARTICLES MANAGEMENT */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-black tracking-tight">Articles Manager</h1>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    Manage, edit, publish, and toggle featured state for all journal publications.
                  </p>
                </div>
                <button
                  onClick={() => setIsArticleModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#BF1E2D] hover:bg-red-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm self-start sm:self-auto uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  Publish New Article
                </button>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search articles or writers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#BF1E2D]"
                  />
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-zinc-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-zinc-300 rounded-lg px-3 py-2 text-xs font-medium bg-white focus:outline-none focus:border-[#BF1E2D]"
                  >
                    <option value="all">All Categories</option>
                    <option value="news">News</option>
                    <option value="business">Business</option>
                    <option value="industry insights">Industry Insights</option>
                    <option value="technology">Technology</option>
                    <option value="innovation">Innovation</option>
                  </select>
                </div>
              </div>

              {/* ARTICLES TABLE */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-900 text-white font-bold uppercase tracking-wider border-b border-zinc-800">
                        <th className="p-4">Title & Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Writer / Author</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredArticles.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-zinc-400 font-medium">
                            No articles found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredArticles.map((art) => (
                          <tr key={art.id} className="hover:bg-zinc-50 transition-colors">
                            <td className="p-4 max-w-[320px]">
                              <p className="font-bold text-black text-xs line-clamp-2 leading-snug">{art.title}</p>
                              <p className="text-[10px] text-zinc-400 mt-1 truncate">Slug: /{art.slug}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-[10px]">
                                {art.category_name || "General"}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-zinc-700">{art.author_name || "Journal Staff"}</td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => toggleFeatured(art.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                    art.is_featured
                                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                                      : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                                  }`}
                                  title="Toggle Featured"
                                >
                                  {art.is_featured ? "★ Featured" : "☆ Standard"}
                                </button>
                                {art.is_editors_pick && (
                                  <span className="bg-red-50 text-[#BF1E2D] border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                    Editor's Pick
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/${art.category_name?.toLowerCase().replace(/\s+/g, '-') || 'news'}/${art.slug}`}
                                  target="_blank"
                                  className="p-1.5 text-zinc-600 hover:text-black bg-zinc-100 rounded hover:bg-zinc-200"
                                  title="View Public Page"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 rounded hover:bg-rose-100 cursor-pointer"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: WRITERS & EDITORS */}
          {activeTab === "writers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-black tracking-tight flex items-center gap-2">
                    <PenTool className="w-6 h-6 text-[#165c61]" />
                    Writers & Editorial Staff Roster
                  </h1>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    Manage journalists, bureau leads, columnists, and technical authors.
                  </p>
                </div>
                <button
                  onClick={() => setIsWriterModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#165c61] hover:bg-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm self-start sm:self-auto uppercase tracking-wider"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New Writer
                </button>
              </div>

              {/* SEARCH WRITERS */}
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                <div className="relative max-w-sm">
                  <input
                    type="text"
                    placeholder="Search writer by name or role..."
                    value={writerSearch}
                    onChange={(e) => setWriterSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#165c61]"
                  />
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* WRITERS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWriters.map((writer) => (
                  <div key={writer.id} className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={writer.avatar}
                            alt={writer.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-teal-600"
                          />
                          <div>
                            <h3 className="font-bold text-black text-sm">{writer.name}</h3>
                            <p className="text-[11px] text-[#165c61] font-bold mt-0.5">{writer.role}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                          {writer.status}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 font-normal leading-relaxed line-clamp-3 mb-4">
                        {writer.bio}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-zinc-500">
                        Published Articles: <span className="text-black font-extrabold">{writer.articlesCount}</span>
                      </span>
                      <button
                        onClick={() => handleDeleteWriter(writer.id, writer.name)}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-bold cursor-pointer"
                      >
                        Remove Writer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: READERS & USERS */}
          {activeTab === "readers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-black tracking-tight flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Readers & Registered Members
                  </h1>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    Manage active readers, newsletter subscribers, and enterprise users.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showNotification("Exporting reader records CSV...")}
                    className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => setIsReaderModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm uppercase tracking-wider"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Reader
                  </button>
                </div>
              </div>

              {/* SEARCH READERS */}
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                <div className="relative max-w-sm">
                  <input
                    type="text"
                    placeholder="Search readers by name, email, or company..."
                    value={readerSearch}
                    onChange={(e) => setReaderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* READERS TABLE */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-zinc-900 text-white font-bold uppercase tracking-wider">
                      <th className="p-4">Reader Name & Email</th>
                      <th className="p-4">Membership Type</th>
                      <th className="p-4">Organization / Company</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredReaders.map((reader) => (
                      <tr key={reader.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-black">{reader.name}</p>
                          <p className="text-[11px] text-zinc-400">{reader.email}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            reader.membershipType === "VIP Member"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : reader.membershipType === "Subscriber"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-zinc-100 text-zinc-700"
                          }`}>
                            {reader.membershipType}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-zinc-600">{reader.company || "Independent"}</td>
                        <td className="p-4 text-zinc-400 font-medium">{reader.joinedDate}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteReader(reader.id, reader.email)}
                            className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <h1 className="text-2xl font-bold text-black tracking-tight">System Settings & Configuration</h1>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  Manage application configuration, security parameters, and maintenance preferences.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3">General Preferences</h3>
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <div>
                        <p className="text-xs font-bold text-black">Maintenance Mode</p>
                        <p className="text-[11px] text-zinc-400">Display maintenance banner to non-admin visitors</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 accent-[#BF1E2D] cursor-pointer" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <div>
                        <p className="text-xs font-bold text-black">Email Dispatch Notifications</p>
                        <p className="text-[11px] text-zinc-400">Send sign-in alerts via Nodemailer</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#BF1E2D] cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3">Database Connection Details</h3>
                  <div className="bg-zinc-900 text-zinc-200 p-4 rounded-lg font-mono text-xs space-y-1">
                    <p><span className="text-zinc-500">HOST:</span> localhost (3306)</p>
                    <p><span className="text-zinc-500">DATABASE:</span> digital_journal_db</p>
                    <p><span className="text-zinc-500">POOL LIMIT:</span> 10 active connections</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE ARTICLE MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl w-full max-w-xl overflow-hidden font-standard-sans animate-fade-in">
            <div className="bg-zinc-900 text-white p-4 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Plus className="w-4 h-4 text-[#BF1E2D]" />
                Publish New Journal Article
              </div>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next-Generation Microprocessor Architectures Unveiled"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#BF1E2D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:border-[#BF1E2D]"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Industry Insights">Industry Insights</option>
                    <option value="News">News</option>
                    <option value="Innovation">Innovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                    Writer / Author
                  </label>
                  <select
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:border-[#BF1E2D]"
                  >
                    {writers.map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Summary / Lead Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter a brief summary of the article..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#BF1E2D]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#BF1E2D]"
                  />
                  Mark as Featured Article
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditorsPick}
                    onChange={(e) => setIsEditorsPick(e.target.checked)}
                    className="w-4 h-4 accent-[#BF1E2D]"
                  />
                  Mark as Editor's Pick
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#BF1E2D] hover:bg-red-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD WRITER MODAL */}
      {isWriterModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl w-full max-w-md overflow-hidden font-standard-sans animate-fade-in">
            <div className="bg-[#165c61] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <UserPlus className="w-4 h-4" />
                Add New Editorial Writer
              </div>
              <button
                onClick={() => setIsWriterModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWriter} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Writer Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={newWriterName}
                  onChange={(e) => setNewWriterName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#165c61]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Editorial Role / Title *
                </label>
                <select
                  value={newWriterRole}
                  onChange={(e) => setNewWriterRole(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:border-[#165c61]"
                >
                  <option value="Senior Reporter">Senior Reporter</option>
                  <option value="Associate Editor">Associate Editor</option>
                  <option value="Executive Editor">Executive Editor</option>
                  <option value="Tech Analyst">Tech Analyst</option>
                  <option value="Guest Columnist">Guest Columnist</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Writer Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Short bio covering reporting focus and background..."
                  value={newWriterBio}
                  onChange={(e) => setNewWriterBio(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#165c61]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsWriterModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#165c61] hover:bg-teal-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Add Writer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD READER MODAL */}
      {isReaderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xl w-full max-w-md overflow-hidden font-standard-sans animate-fade-in">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                Register New Reader Account
              </div>
              <button
                onClick={() => setIsReaderModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReader} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Reader Email Address *
                </label>
                <input
                  type="email"
                  placeholder="reader@example.com"
                  value={newReaderEmail}
                  onChange={(e) => setNewReaderEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={newReaderName}
                  onChange={(e) => setNewReaderName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Membership Type
                </label>
                <select
                  value={newReaderMembership}
                  onChange={(e) => setNewReaderMembership(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="Subscriber">Subscriber (Newsletter)</option>
                  <option value="Registered Reader">Registered Reader</option>
                  <option value="VIP Member">VIP Member</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise Corp"
                  value={newReaderCompany}
                  onChange={(e) => setNewReaderCompany(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsReaderModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Register Reader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
