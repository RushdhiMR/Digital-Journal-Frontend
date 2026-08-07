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
  BadgeCheck,
  BarChart3,
  Globe,
  DollarSign,
  Layers,
  Radio,
  Edit3,
  X,
  Check,
  Clock
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
  status: "Active" | "On Leave" | "Deactivated";
  email?: string;
  password?: string;
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

interface SubmittedDraft {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  status: "Draft" | "Submitted" | "Published";
  date: string;
  reads: number;
}

interface CoAdmin {
  id: number;
  name: string;
  email: string;
  role: "Co-Admin";
  assignedDate: string;
  status: "Active" | "Deactivated";
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
  monthlyAdRevenue: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "articles" | "writers" | "readers" | "editorial_queue" | "analytics" | "settings" | "coadmins"
  >("overview");

  // Dashboard Metrics & Data
  const [stats, setStats] = useState<Stats>({
    totalArticles: 14,
    totalAuthors: 5,
    totalSubscribers: 124,
    totalUsers: 148,
    monthlyViews: "184,250",
    systemStatus: "Healthy / Operational",
    dbHost: "localhost (digital_journal_db)",
    lastBackup: "2026-07-27 04:00 AM",
    monthlyAdRevenue: "$14,850.00"
  });

  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "Exclusive: Saudi Arabia opens talks to purchase Westinghouse AP1000 nuclear reactors",
      slug: "exclusive-saudi-arabia-opens-talks-to-purchase-westinghouse-ap1000-nuclear-reactors",
      description: "Riyadh advances civil nuclear ambitions with high-capacity American reactor tech.",
      category_name: "Business",
      author_name: "Jennifer Friesen",
      is_featured: true,
      is_editors_pick: true,
      published_at: "2026-07-26 14:30:00"
    },
    {
      id: 2,
      title: "US stocks end higher as SK Hynix debut & Meta AI momentum lift markets",
      slug: "us-stocks-end-higher-as-sk-hynixs-wall-street-debut-and-metas-ai-momentum-lift-markets",
      description: "Tech rally pushes S&P 500 near record highs as semiconductor demand remains robust.",
      category_name: "News",
      author_name: "Pramod Jain",
      is_featured: false,
      is_editors_pick: true,
      published_at: "2026-07-26 12:15:00"
    },
    {
      id: 3,
      title: "Tesla earnings call key focus: Robotaxi progress, low-cost EV platform & FSD v13",
      slug: "tesla-earnings-call-key-focus-robotaxi-progress-low-cost-ev-platform-fsd-v13",
      description: "Investors await updates on autonomous fleet expansion and next-generation vehicle architecture.",
      category_name: "Technology",
      author_name: "David Potter",
      is_featured: true,
      is_editors_pick: false,
      published_at: "2026-07-25 18:45:00"
    },
    {
      id: 4,
      title: "Can AI give reliable mortgage advice? We tested 4 top AI bots",
      slug: "can-ai-give-reliable-mortgage-advice-we-tested-4-top-ai-bots",
      description: "Evaluating financial accuracy and regulatory compliance of leading generative models.",
      category_name: "Innovation",
      author_name: "April Hicke",
      is_featured: false,
      is_editors_pick: true,
      published_at: "2026-07-25 09:20:00"
    },
    {
      id: 5,
      title: "Global solar-powered mobile medical units deployed in emergency response zones",
      slug: "global-solar-powered-mobile-medical-units-deployed-in-emergency-response-zones",
      description: "Clean energy mobile clinics deliver off-grid medical care to remote disaster regions.",
      category_name: "Industry Insights",
      author_name: "Chris Hogg",
      is_featured: false,
      is_editors_pick: false,
      published_at: "2026-07-24 16:00:00"
    }
  ]);

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

  // Writer Submitted Drafts Queue
  const [writerSubmissions, setWriterSubmissions] = useState<SubmittedDraft[]>([
    {
      id: "draft-101",
      title: "AI Regulation Standards Passed in European Union Digital Committee",
      category: "NEWS",
      summary: "EU policymakers finalize compliance framework for high-risk machine learning applications.",
      content: "European Union regulators approved a comprehensive legal package governing AI governance, establishing strict audit rules for foundation models...",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=350&fit=crop",
      status: "Submitted",
      date: "July 26, 2026",
      reads: 0
    }
  ]);

  // Site Settings & Breaking News Ticker State
  const [breakingNewsText, setBreakingNewsText] = useState("BREAKING: Global tech markets surge following quarter-end earnings reports.");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isBreakingNewsActive, setIsBreakingNewsActive] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [writerSearch, setWriterSearch] = useState("");
  const [readerSearch, setReaderSearch] = useState("");

  // Co-Admins Roster State (Main Admin Only)
  const [coAdmins, setCoAdmins] = useState<CoAdmin[]>([
    {
      id: 1,
      name: "Operations Co-Admin",
      email: "coadmin@digitaljournal.com",
      role: "Co-Admin",
      assignedDate: "2026-07-20",
      status: "Active"
    }
  ]);
  const [isCoAdminModalOpen, setIsCoAdminModalOpen] = useState(false);
  const [newCoAdminName, setNewCoAdminName] = useState("");
  const [newCoAdminEmail, setNewCoAdminEmail] = useState("");
  const [newCoAdminPasscode, setNewCoAdminPasscode] = useState("");

  // Modals state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isWriterModalOpen, setIsWriterModalOpen] = useState(false);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [previewModalArticle, setPreviewModalArticle] = useState<Article | SubmittedDraft | null>(null);

  // New Article Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Technology");
  const [newAuthor, setNewAuthor] = useState("Jennifer Friesen");
  const [newDescription, setNewDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditorsPick, setIsEditorsPick] = useState(false);

  // New Writer Form
  const [newWriterName, setNewWriterName] = useState("");
  const [newWriterEmail, setNewWriterEmail] = useState("");
  const [newWriterPassword, setNewWriterPassword] = useState("");
  const [newWriterRole, setNewWriterRole] = useState("Senior Reporter");
  const [newWriterBio, setNewWriterBio] = useState("");

  // New Reader Form
  const [newReaderName, setNewReaderName] = useState("");
  const [newReaderEmail, setNewReaderEmail] = useState("");
  const [newReaderMembership, setNewReaderMembership] = useState<"Subscriber" | "Registered Reader" | "VIP Member">("Subscriber");
  const [newReaderCompany, setNewReaderCompany] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lockPasscode, setLockPasscode] = useState("");
  const [lockError, setLockError] = useState("");

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
        if (parsed.role === "Admin" || parsed.role === "admin" || parsed.role === "Co-Admin" || parsed.role === "coadmin") {
          currentUser = parsed;
        }
      }

      // Check writer submissions from local storage
      const localWriterSubs = localStorage.getItem("dj_writer_submitted_articles");
      if (localWriterSubs) {
        setWriterSubmissions(JSON.parse(localWriterSubs));
      }

      // Check saved Co-Admins list
      const savedCoAdmins = localStorage.getItem("dj_co_admins_list");
      if (savedCoAdmins) {
        setCoAdmins(JSON.parse(savedCoAdmins));
      }

      // Check saved Writers roster list
      const savedWriters = localStorage.getItem("dj_writers_list");
      if (savedWriters) {
        setWriters(JSON.parse(savedWriters));
      }

      // Check saved breaking news ticker
      const savedTicker = localStorage.getItem("dj_breaking_news_ticker");
      if (savedTicker) {
        setBreakingNewsText(savedTicker);
      }

      // Session verification: require active Admin or Co-Admin role
      if (currentUser && (currentUser.role === "Admin" || currentUser.role === "admin" || currentUser.role === "Co-Admin" || currentUser.role === "coadmin")) {
        setAdminUser(currentUser);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setLockError("");
    const pass = lockPasscode.trim();
    const validAdminPasswords = ["admin", "admin123", "Admin@123", "admin2026", "secret"];
    const validCoAdminPasswords = ["coadmin", "coadmin123", "coadmin2026"];

    if (validAdminPasswords.includes(pass)) {
      const adminAcc = {
        name: "System Admin",
        email: "admin@digitaljournal.com",
        role: "Admin"
      };
      localStorage.setItem("dj_user", JSON.stringify(adminAcc));
      localStorage.setItem("dj_admin_user", JSON.stringify(adminAcc));
      setAdminUser(adminAcc);
      setIsAuthenticated(true);
      fetchDashboardData();
    } else if (validCoAdminPasswords.includes(pass)) {
      // Check if Co-Admin account status is Deactivated or suspended
      try {
        const savedCoAdmins = localStorage.getItem("dj_co_admins_list");
        if (savedCoAdmins) {
          const coList: any[] = JSON.parse(savedCoAdmins);
          const coEntry = coList.find((c) => c.status === "Deactivated");
          if (coEntry) {
            setLockError("❌ Access Denied: Your Co-Admin account has been deactivated by the Main Admin.");
            return;
          }
        }
      } catch (err) {
        console.warn(err);
      }

      const coAdminAcc = {
        name: "Operations Co-Admin",
        email: "coadmin@digitaljournal.com",
        role: "Co-Admin"
      };
      localStorage.setItem("dj_user", JSON.stringify(coAdminAcc));
      localStorage.setItem("dj_admin_user", JSON.stringify(coAdminAcc));
      setAdminUser(coAdminAcc);
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setLockError("❌ Access Denied: Incorrect Admin or Co-Admin Passcode!");
    }
  };

  const fetchDashboardData = async () => {
    try {
      const artRes = await fetch("/api/admin/articles");
      if (artRes.ok) {
        const artData = await artRes.json();
        if (artData.articles && artData.articles.length > 0) {
          setArticles(artData.articles);
        }
      }

      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.stats) {
          setStats(prev => ({ ...prev, ...statsData.stats }));
        }
      }
    } catch (err) {
      console.warn("Failed fetching admin data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dj_admin_user");
    localStorage.removeItem("dj_user");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Article Actions
  const handleCreateOrUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (editingArticle) {
      // Editing existing article
      const updated = articles.map(a => 
        a.id === editingArticle.id ? {
          ...a,
          title: newTitle,
          category_name: newCategory,
          author_name: newAuthor,
          description: newDescription,
          is_featured: isFeatured,
          is_editors_pick: isEditorsPick
        } : a
      );
      setArticles(updated);
      setIsArticleModalOpen(false);
      setEditingArticle(null);
      setNewTitle("");
      setNewDescription("");
      showNotification(`Article "${newTitle}" successfully updated!`);
      return;
    }

    // Creating new article
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
      showNotification("New article published successfully!");
    } catch (err) {
      console.error(err);
      showNotification("New article published to Digital Journal database!");
    }
  };

  const handleEditArticleClick = (art: Article) => {
    setEditingArticle(art);
    setNewTitle(art.title);
    setNewCategory(art.category_name || "Technology");
    setNewAuthor(art.author_name || "Jennifer Friesen");
    setNewDescription(art.description || "");
    setIsFeatured(art.is_featured || false);
    setIsEditorsPick(art.is_editors_pick || false);
    setIsArticleModalOpen(true);
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

  const toggleEditorsPick = (id: number) => {
    setArticles(articles.map(a => a.id === id ? { ...a, is_editors_pick: !a.is_editors_pick } : a));
    showNotification("Editor's Pick status updated.");
  };

  // Editorial Review Actions
  const handleApproveWriterSubmission = (sub: SubmittedDraft) => {
    const authorName = (sub as any).authorName || "Jennifer Friesen";
    const newArt: Article = {
      id: Date.now(),
      title: sub.title,
      slug: sub.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      description: sub.summary,
      category_name: sub.category,
      author_name: authorName,
      is_featured: false,
      is_editors_pick: true,
      published_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setArticles([newArt, ...articles]);
    
    // Update status to Published in localStorage and state
    const localSubsStr = localStorage.getItem("dj_writer_submitted_articles");
    let localSubs: any[] = localSubsStr ? JSON.parse(localSubsStr) : writerSubmissions;
    const updatedSubs = localSubs.map((s) => (s.id === sub.id ? { ...s, status: "Published" } : s));
    
    localStorage.setItem("dj_writer_submitted_articles", JSON.stringify(updatedSubs));
    setWriterSubmissions(updatedSubs);
    setStats(prev => ({ ...prev, totalArticles: prev.totalArticles + 1 }));

    showNotification(`✓ Approved & Published story: "${sub.title}" live!`);
  };

  const handleRejectWriterSubmission = (id: string) => {
    const localSubsStr = localStorage.getItem("dj_writer_submitted_articles");
    let localSubs: any[] = localSubsStr ? JSON.parse(localSubsStr) : writerSubmissions;
    const updatedSubs = localSubs.filter((s) => s.id !== id);
    localStorage.setItem("dj_writer_submitted_articles", JSON.stringify(updatedSubs));
    setWriterSubmissions(updatedSubs);
    showNotification("Writer submission rejected.");
  };

  // Writer Actions
  const handleAddWriter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWriterName.trim() || !newWriterEmail.trim() || !newWriterPassword.trim()) return;

    const email = newWriterEmail.trim().toLowerCase();
    const pass = newWriterPassword.trim();

    const newW: Writer = {
      id: Date.now(),
      name: newWriterName.trim(),
      role: newWriterRole || "Senior Reporter",
      articlesCount: 0,
      avatar: "/author_woman.jpg",
      bio: newWriterBio || `${newWriterName} is an accredited journalist for Digital Journal.`,
      status: "Active",
      email: email,
      password: pass
    };

    const updatedList = [newW, ...writers];
    setWriters(updatedList);
    localStorage.setItem("dj_writers_list", JSON.stringify(updatedList));

    // Register account in dj_registered_users so writer can log in immediately on /login
    try {
      const regStr = localStorage.getItem("dj_registered_users");
      let regList: any[] = regStr ? JSON.parse(regStr) : [];
      const existingIdx = regList.findIndex(u => u.email && u.email.toLowerCase() === email);
      const userRecord = {
        name: newWriterName.trim(),
        email: email,
        password: pass,
        role: "Writer",
        registeredAt: new Date().toISOString()
      };
      if (existingIdx >= 0) {
        regList[existingIdx] = userRecord;
      } else {
        regList.push(userRecord);
      }
      localStorage.setItem("dj_registered_users", JSON.stringify(regList));
    } catch (err) {
      console.warn("Could not save to registered users list:", err);
    }

    setStats(prev => ({ ...prev, totalAuthors: prev.totalAuthors + 1 }));
    setIsWriterModalOpen(false);
    setNewWriterName("");
    setNewWriterEmail("");
    setNewWriterPassword("");
    setNewWriterBio("");
    showNotification(`✓ New staff journalist "${newW.name}" account created with assigned password!`);
  };

  const handleToggleWriterStatus = (id: number, name: string) => {
    const updated = writers.map((w) => {
      if (w.id === id) {
        const nextStatus = w.status === "Active" ? ("Deactivated" as const) : ("Active" as const);
        showNotification(`✓ Writer "${name}" publishing access updated to ${nextStatus.toUpperCase()}.`);
        return { ...w, status: nextStatus };
      }
      return w;
    });
    setWriters(updated);
    localStorage.setItem("dj_writers_list", JSON.stringify(updated));
  };

  const handleDeleteWriter = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove writer "${name}"? Access will be revoked.`)) {
      const updatedList = writers.filter(w => w.id !== id);
      setWriters(updatedList);
      localStorage.setItem("dj_writers_list", JSON.stringify(updatedList));
      setStats(prev => ({ ...prev, totalAuthors: Math.max(0, prev.totalAuthors - 1) }));
      showNotification(`Writer "${name}" removed. Access revoked.`);
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

  // Co-Admin Actions (Main Admin Only)
  const handleAddCoAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoAdminName.trim() || !newCoAdminEmail.trim()) return;

    const newCA: CoAdmin = {
      id: Date.now(),
      name: newCoAdminName.trim(),
      email: newCoAdminEmail.toLowerCase().trim(),
      role: "Co-Admin",
      assignedDate: new Date().toISOString().split('T')[0],
      status: "Active"
    };

    const updatedList = [newCA, ...coAdmins];
    setCoAdmins(updatedList);
    localStorage.setItem("dj_co_admins_list", JSON.stringify(updatedList));

    // Register in registered users list as Co-Admin so they can log in
    try {
      const regStr = localStorage.getItem("dj_registered_users");
      const regList = regStr ? JSON.parse(regStr) : [];
      const coAdminObj = {
        name: newCA.name,
        email: newCA.email,
        password: newCoAdminPasscode.trim() || "coadmin123",
        role: "Co-Admin",
        registeredAt: new Date().toISOString()
      };
      if (!regList.some((u: any) => u.email.toLowerCase() === newCA.email)) {
        regList.push(coAdminObj);
        localStorage.setItem("dj_registered_users", JSON.stringify(regList));
      }
    } catch (err) {
      console.warn(err);
    }

    setIsCoAdminModalOpen(false);
    setNewCoAdminName("");
    setNewCoAdminEmail("");
    setNewCoAdminPasscode("");
    showNotification(`✓ New Co-Admin "${newCA.name}" granted administrative access!`);
  };

  const handleToggleCoAdminStatus = (id: number, name: string) => {
    const updated = coAdmins.map((c) => {
      if (c.id === id) {
        const nextStatus = c.status === "Active" ? ("Deactivated" as const) : ("Active" as const);
        showNotification(`✓ Co-Admin "${name}" account status updated to ${nextStatus.toUpperCase()}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCoAdmins(updated);
    localStorage.setItem("dj_co_admins_list", JSON.stringify(updated));
  };

  const handleDeleteCoAdmin = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove Co-Admin privileges for "${name}"? Access will be revoked immediately.`)) {
      const updatedList = coAdmins.filter(c => c.id !== id);
      setCoAdmins(updatedList);
      localStorage.setItem("dj_co_admins_list", JSON.stringify(updatedList));
      showNotification(`Co-Admin "${name}" removed. Account access revoked.`);
    }
  };

  // Save Breaking Ticker
  const handleSaveTicker = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("dj_breaking_news_ticker", breakingNewsText);
    showNotification("Global Breaking News Announcement Ticker updated live!");
  };

  // Backup Database JSON
  const handleExportDatabase = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      stats,
      articles,
      writers,
      readers,
      breakingNewsText
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digital_journal_db_backup_${Date.now()}.json`;
    a.click();
    showNotification("Database backup file downloaded!");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-standard-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#BF1E2D] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Verifying Security Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !adminUser) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-950/60 border border-red-800 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 shadow-inner">
            <ShieldCheck size={36} />
          </div>

          <h2 className="text-2xl font-bold font-serif mb-1 text-white">Admin Access Restricted</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Access requires an authenticated Administrator session. Enter passcode below to unlock.
          </p>

          {/* DEFAULT ADMIN & CO-ADMIN ACCOUNTS INFO BOX */}
          <div className="mb-6 p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg text-left text-xs space-y-2 font-mono">
            <div className="border-b border-zinc-800 pb-2">
              <div className="flex items-center justify-between text-amber-400 font-bold text-[11px] font-sans uppercase mb-1">
                <span>🛡️ SUPER ADMIN ACCOUNT</span>
                <span className="bg-amber-950/80 text-amber-300 text-[9px] px-1.5 py-0.5 rounded border border-amber-800">
                  FULL ACCESS
                </span>
              </div>
              <p className="text-zinc-300"><span className="text-zinc-500">Email:</span> admin@digitaljournal.com</p>
              <p className="text-zinc-300"><span className="text-zinc-500">Passcode:</span> admin123 <span className="text-zinc-500">(or admin)</span></p>
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between text-blue-400 font-bold text-[11px] font-sans uppercase mb-1">
                <span>👥 CO-ADMIN ACCOUNT</span>
                <span className="bg-blue-950/80 text-blue-300 text-[9px] px-1.5 py-0.5 rounded border border-blue-800">
                  OPERATIONAL CONTROL
                </span>
              </div>
              <p className="text-zinc-300"><span className="text-zinc-500">Email:</span> coadmin@digitaljournal.com</p>
              <p className="text-zinc-300"><span className="text-zinc-500">Passcode:</span> coadmin123 <span className="text-zinc-500">(or coadmin)</span></p>
            </div>
          </div>

          {lockError && (
            <div className="mb-4 bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold p-3 rounded text-center">
              {lockError}
            </div>
          )}

          <form onSubmit={handleUnlockAdmin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                ADMIN PASSCODE
              </label>
              <input
                type="password"
                required
                placeholder="Enter Admin or Co-Admin Passcode"
                value={lockPasscode}
                onChange={(e) => setLockPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-xs py-3.5 rounded transition-all uppercase tracking-wider cursor-pointer shadow"
            >
              VERIFY & UNLOCK DASHBOARD
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLockPasscode("admin123");
                  const adminAcc = {
                    name: "System Admin",
                    email: "admin@digitaljournal.com",
                    role: "Admin"
                  };
                  localStorage.setItem("dj_user", JSON.stringify(adminAcc));
                  localStorage.setItem("dj_admin_user", JSON.stringify(adminAcc));
                  setAdminUser(adminAcc);
                  setIsAuthenticated(true);
                  fetchDashboardData();
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[11px] font-bold py-2.5 px-2 rounded transition-all cursor-pointer border border-zinc-700 text-center"
              >
                ⚡ 1-Click Super Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setLockPasscode("coadmin123");
                  const coAdminAcc = {
                    name: "Operations Co-Admin",
                    email: "coadmin@digitaljournal.com",
                    role: "Co-Admin"
                  };
                  localStorage.setItem("dj_user", JSON.stringify(coAdminAcc));
                  localStorage.setItem("dj_admin_user", JSON.stringify(coAdminAcc));
                  setAdminUser(coAdminAcc);
                  setIsAuthenticated(true);
                  fetchDashboardData();
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-blue-300 text-[11px] font-bold py-2.5 px-2 rounded transition-all cursor-pointer border border-zinc-700 text-center"
              >
                ⚡ 1-Click Co-Admin
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
            <Link href="/login" className="hover:text-zinc-300 transition-colors">
              ← Return to Login Page
            </Link>
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Go to Home Page →
            </Link>
          </div>
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
              DEFAULT ADMIN CONTROL CENTER
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
                <p className="text-[10px] text-zinc-400">System Administrator</p>
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
        <aside className="w-full md:w-[260px] flex-shrink-0">
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
                Overview & Telemetry
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

              <button
                onClick={() => setActiveTab("editorial_queue")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "editorial_queue"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Radio className="w-4 h-4" />
                Editorial Review Queue
                {writerSubmissions.length > 0 && (
                  <span className="ml-auto text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                    {writerSubmissions.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("writers")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "writers"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <PenTool className="w-4 h-4" />
                Writers Bureau
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === "writers" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                }`}>
                  {writers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("readers")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "readers"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Users className="w-4 h-4" />
                Readers & VIP Members
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === "readers" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                }`}>
                  {readers.length}
                </span>
              </button>

              {/* ONLY MAIN ADMIN CAN SEE & ACCESS CO-ADMINS ROSTER TAB */}
              {(adminUser.role === "Admin" || adminUser.role === "admin") && (
                <button
                  onClick={() => setActiveTab("coadmins")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                    activeTab === "coadmins"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-amber-800 bg-amber-50 hover:bg-amber-100"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Co-Admins Roster
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                    activeTab === "coadmins" ? "bg-white/20 text-white" : "bg-amber-200/80 text-amber-900 font-bold"
                  }`}>
                    {coAdmins.length}
                  </span>
                </button>
              )}

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-[#BF1E2D] text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics & Ad Revenue
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
                Site Settings & Backup
              </button>
            </nav>

            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 mt-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500">
                <span>SYSTEM STATUS</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Operational
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">Digital Journal Server v2.4.0</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* TOP STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-zinc-500 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Articles</span>
                    <div className="p-2 bg-rose-50 text-[#BF1E2D] rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-zinc-900">{stats.totalArticles}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +12%
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Across 6 publication categories</p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-zinc-500 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Staff Journalists</span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-zinc-900">{stats.totalAuthors}</span>
                    <span className="text-xs font-bold text-zinc-500">Active Staff</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Bureau leads & senior reporters</p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-zinc-500 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Subscribers & Readers</span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-zinc-900">{stats.totalSubscribers}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +24%
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Active paid & free subscriptions</p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-zinc-500 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Ad Revenue</span>
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-zinc-900">{stats.monthlyAdRevenue}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +18.4%
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Sponsorships & Programmatic CPM</p>
                </div>
              </div>

              {/* QUICK ACTIONS & RECENT ACTIVITY */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* QUICK ACTIONS CARD */}
                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#BF1E2D]" />
                    Quick Admin Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setEditingArticle(null);
                        setNewTitle("");
                        setNewDescription("");
                        setIsArticleModalOpen(true);
                      }}
                      className="w-full bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-between transition-all cursor-pointer shadow-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create New Article
                      </span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setIsWriterModalOpen(true)}
                      className="w-full bg-zinc-900 hover:bg-black text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Add New Journalist
                      </span>
                      <span>+</span>
                    </button>

                    <button
                      onClick={() => setIsReaderModalOpen(true)}
                      className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Add New Subscriber
                      </span>
                      <span>+</span>
                    </button>

                    <button
                      onClick={handleExportDatabase}
                      className="w-full border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-blue-600" />
                        Export DB Backup JSON
                      </span>
                      <span>↓</span>
                    </button>
                  </div>
                </div>

                {/* PLATFORM AUDIT TRAIL LOG */}
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Platform Audit Trail & Live Activity Log
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Live Telemetry
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg text-xs">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="font-bold text-zinc-800">Article Approved & Published</p>
                        <p className="text-zinc-500">"Exclusive: Saudi Arabia opens talks to purchase Westinghouse AP1000 nuclear reactors"</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">10m ago</span>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="font-bold text-zinc-800">Writer Submission Received</p>
                        <p className="text-zinc-500">Jennifer Friesen submitted a draft for editorial review.</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">45m ago</span>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg text-xs">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="font-bold text-zinc-800">New Subscriber Membership Registered</p>
                        <p className="text-zinc-500">Rushdhi Riyaj upgraded to VIP Member status.</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">2h ago</span>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg text-xs">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="font-bold text-zinc-800">Automated System Health Backup</p>
                        <p className="text-zinc-500">PostgreSQL database backup snapshot generated (2.4 GB).</p>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">4h ago</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ARTICLES MANAGER */}
          {activeTab === "articles" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                
                {/* TOOLBAR */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 font-serif">Articles Manager</h2>
                    <p className="text-xs text-zinc-500">Manage, edit, publish, feature, or remove publication articles.</p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingArticle(null);
                      setNewTitle("");
                      setNewDescription("");
                      setIsArticleModalOpen(true);
                    }}
                    className="bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    New Article Story
                  </button>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search articles by title or author..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:outline-none focus:border-zinc-400"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-700 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="News">News</option>
                    <option value="Business">Business</option>
                    <option value="Technology">Technology</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Industry Insights">Industry Insights</option>
                  </select>
                </div>

                {/* ARTICLES TABLE */}
                <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                  <table className="w-full text-left text-xs text-zinc-700">
                    <thead className="bg-zinc-100 text-zinc-600 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200">
                      <tr>
                        <th className="py-3 px-4">Title & Details</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Author</th>
                        <th className="py-3 px-4">Badges</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {filteredArticles.map((art) => (
                        <tr key={art.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-zinc-900 font-serif text-[13px] leading-snug line-clamp-2">
                              {art.title}
                            </p>
                            <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{art.description}</p>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[11px] text-blue-600">
                            {art.category_name || "General"}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-zinc-800">
                            {art.author_name || "Staff Reporter"}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {art.is_featured && (
                                <span className="bg-amber-100 text-amber-800 font-bold text-[9px] px-2 py-0.5 rounded">
                                  ★ HERO FEATURED
                                </span>
                              )}
                              {art.is_editors_pick && (
                                <span className="bg-blue-100 text-blue-800 font-bold text-[9px] px-2 py-0.5 rounded">
                                  ✓ EDITOR'S PICK
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleFeatured(art.id)}
                                className={`p-1.5 rounded transition-colors ${
                                  art.is_featured ? "text-amber-500 bg-amber-50" : "text-zinc-400 hover:text-zinc-700"
                                }`}
                                title="Toggle Featured on Hero"
                              >
                                <Star className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleEditArticleClick(art)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit Article"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Delete Article"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: EDITORIAL REVIEW QUEUE */}
          {activeTab === "editorial_queue" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 font-serif flex items-center gap-2">
                      <Radio className="w-5 h-5 text-amber-500" />
                      Writer Submissions Editorial Review Queue
                    </h2>
                    <p className="text-xs text-zinc-500">Review draft stories submitted by journalists from Writer Studio.</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                    {writerSubmissions.filter((s) => s.status !== "Published").length} Pending Submissions
                  </span>
                </div>

                {writerSubmissions.filter((s) => s.status !== "Published").length === 0 ? (
                  <div className="p-12 text-center text-zinc-400 bg-zinc-50 rounded-lg border border-dashed border-zinc-300">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-zinc-700">Queue Cleared!</p>
                    <p className="text-xs">No pending writer draft submissions requiring review at this time.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {writerSubmissions
                      .filter((s) => s.status !== "Published")
                      .map((sub) => (
                        <div key={sub.id} className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/60 hover:border-zinc-300 transition-all">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <div>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                                {sub.category}
                              </span>
                              <h3 className="text-base font-bold font-serif text-zinc-900 mt-1">
                                {sub.title}
                              </h3>
                              <p className="text-xs text-zinc-500 mt-0.5">Submitted by {(sub as any).authorName || "Staff Reporter"} on {sub.date}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPreviewModalArticle(sub)}
                                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Eye size={14} /> Preview
                              </button>

                              <button
                                onClick={() => handleApproveWriterSubmission(sub)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                <Check size={14} /> Approve & Publish Live
                              </button>

                              <button
                                onClick={() => handleRejectWriterSubmission(sub.id)}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-3 py-2 rounded transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed bg-white p-3 rounded border border-zinc-200">
                            {sub.summary}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: WRITERS BUREAU */}
          {activeTab === "writers" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 font-serif">Writers & Editors Bureau Roster</h2>
                    <p className="text-xs text-zinc-500">Manage journalists, editors, and columnists across bureau desks.</p>
                  </div>

                  <button
                    onClick={() => setIsWriterModalOpen(true)}
                    className="bg-zinc-900 hover:bg-black text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Staff Journalist
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {writers.map((w) => (
                    <div key={w.id} className={`p-5 border rounded-xl transition-all flex items-start gap-4 ${
                      w.status === "Active" ? "border-zinc-200 bg-zinc-50/50 hover:bg-white" : "border-rose-200 bg-rose-50/40 opacity-80"
                    }`}>
                      <div className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-base uppercase shadow-sm ${
                        w.status === "Active" ? "bg-[#BF1E2D] text-white" : "bg-zinc-600 text-zinc-200"
                      }`}>
                        {w.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-zinc-900 font-serif text-sm">{w.name}</h3>
                          
                          {/* ACTIVATE / DEACTIVATE PUBLISHING ACCESS BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleToggleWriterStatus(w.id, w.name)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                              w.status === "Active"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 font-extrabold"
                            }`}
                            title="Click to toggle writer publishing access"
                          >
                            {w.status === "Active" ? "● Active (Deactivate)" : "🚫 Deactivated (Activate)"}
                          </button>
                        </div>

                        <p className="text-xs text-blue-600 font-medium mt-0.5">{w.role}</p>
                        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{w.bio}</p>

                        <div className="mt-3 pt-3 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-400">
                          <span>Articles Published: <strong className="text-zinc-800">{w.articlesCount}</strong></span>
                          <button
                            onClick={() => handleDeleteWriter(w.id, w.name)}
                            className="text-rose-600 hover:underline text-[11px] font-bold cursor-pointer"
                          >
                            Remove Journalist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: READERS & SUBSCRIBERS */}
          {activeTab === "readers" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 font-serif">Readers & VIP Subscribers Database</h2>
                    <p className="text-xs text-zinc-500">Manage registered readers, newsletter subscribers, and enterprise members.</p>
                  </div>

                  <button
                    onClick={() => setIsReaderModalOpen(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Subscriber
                  </button>
                </div>

                <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                  <table className="w-full text-left text-xs text-zinc-700">
                    <thead className="bg-zinc-100 text-zinc-600 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200">
                      <tr>
                        <th className="py-3 px-4">Name & Email</th>
                        <th className="py-3 px-4">Membership Tier</th>
                        <th className="py-3 px-4">Company / Organization</th>
                        <th className="py-3 px-4">Joined Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {readers.map((r) => (
                        <tr key={r.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-zinc-900">{r.name}</p>
                            <p className="text-[11px] text-zinc-400">{r.email}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                              r.membershipType === "VIP Member" ? "bg-purple-100 text-purple-800" :
                              r.membershipType === "Subscriber" ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-700"
                            }`}>
                              ★ {r.membershipType}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-zinc-800">{r.company || "Independent"}</td>
                          <td className="py-3.5 px-4 text-zinc-500">{r.joinedDate}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteReader(r.id, r.email)}
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
            </div>
          )}

          {/* TAB 6: ANALYTICS & AD REVENUE */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 font-serif">Traffic Telemetry & Ad Revenue Insights</h2>
                    <p className="text-xs text-zinc-500">Monthly reader impressions, CPM breakdowns, and category engagement metrics.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Revenue Trend ↑ 18.4%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase">Average CPM</p>
                    <p className="text-2xl font-extrabold text-zinc-900 mt-1">$24.50</p>
                    <p className="text-[10px] text-zinc-400 mt-1">Per 1,000 Verified Reader Views</p>
                  </div>

                  <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase">Top Performing Category</p>
                    <p className="text-2xl font-extrabold text-[#BF1E2D] mt-1">Business & Tech</p>
                    <p className="text-[10px] text-zinc-400 mt-1">42% of total readership traffic</p>
                  </div>

                  <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase">Active Sponsor Slots</p>
                    <p className="text-2xl font-extrabold text-blue-600 mt-1">8 / 8 Active</p>
                    <p className="text-[10px] text-zinc-400 mt-1">100% Sponsorship Inventory Filled</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SITE SETTINGS & TICKER */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 font-serif mb-6 pb-3 border-b border-zinc-200">
                  Global Site Configuration & Announcement Manager
                </h2>

                <form onSubmit={handleSaveTicker} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      LIVE BREAKING NEWS TICKER BANNER
                    </label>
                    <input
                      type="text"
                      value={breakingNewsText}
                      onChange={(e) => setBreakingNewsText(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-red-600 font-bold"
                    />
                    <p className="text-[11px] text-zinc-400 mt-1">This message broadcasts across the website top announcement bar.</p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      Update Live Announcement Ticker
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: CO-ADMINS ROSTER (EXCLUSIVE TO MAIN ADMIN) */}
          {activeTab === "coadmins" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                {(adminUser.role === "Admin" || adminUser.role === "admin") ? (
                  <>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-amber-600" />
                          <h2 className="text-xl font-bold text-zinc-900 font-serif">Co-Admins Roster & Privileges</h2>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Main Admin Control: Grant and manage operational Co-Admin access.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsCoAdminModalOpen(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add Co-Admin
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coAdmins.map((ca) => (
                        <div key={ca.id} className={`p-5 border rounded-xl transition-all flex items-start gap-4 ${
                          ca.status === "Active" ? "border-amber-200 bg-amber-50/40 hover:bg-white" : "border-rose-200 bg-rose-50/40 opacity-80"
                        }`}>
                          <div className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-base uppercase shadow-sm ${
                            ca.status === "Active" ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white" : "bg-zinc-600 text-zinc-200"
                          }`}>
                            {ca.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-bold text-zinc-900 font-serif text-sm">{ca.name}</h3>
                              
                              {/* ACTIVATE / DEACTIVATE ACCOUNT STATUS TOGGLE */}
                              <button
                                type="button"
                                onClick={() => handleToggleCoAdminStatus(ca.id, ca.name)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                                  ca.status === "Active"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                    : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 font-extrabold"
                                }`}
                                title="Click to toggle active status"
                              >
                                {ca.status === "Active" ? "● Active (Deactivate)" : "🚫 Deactivated (Activate)"}
                              </button>
                            </div>

                            <p className="text-xs text-zinc-500 font-medium mt-0.5">{ca.email}</p>

                            <div className="mt-4 pt-3 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-400">
                              <span>Assigned: <strong className="text-zinc-700">{ca.assignedDate}</strong></span>
                              <button
                                onClick={() => handleDeleteCoAdmin(ca.id, ca.name)}
                                className="text-rose-600 hover:text-rose-800 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 size={13} /> Remove Co-Admin
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-zinc-900">Access Restricted</h3>
                    <p className="text-xs text-zinc-500 mt-1">Only Main Admin can view and manage Co-Admins.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsArticleModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold font-serif text-zinc-900 mb-4">
              {editingArticle ? "Edit Article" : "Create New Article Story"}
            </h3>

            <form onSubmit={handleCreateOrUpdateArticle} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">ARTICLE TITLE *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 focus:outline-none"
                  placeholder="Enter story title..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 focus:outline-none bg-white"
                >
                  <option value="News">News</option>
                  <option value="Business">Business</option>
                  <option value="Technology">Technology</option>
                  <option value="Innovation">Innovation</option>
                  <option value="Industry Insights">Industry Insights</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">SUMMARY / EXCERPT</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 focus:outline-none"
                  placeholder="Concise 2-line summary..."
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-zinc-300 text-red-600"
                  />
                  Feature on Hero Banner
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditorsPick}
                    onChange={(e) => setIsEditorsPick(e.target.checked)}
                    className="rounded border-zinc-300 text-red-600"
                  />
                  Mark as Editor's Pick
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#BF1E2D] hover:bg-red-800 text-white text-xs font-bold rounded cursor-pointer"
                >
                  {editingArticle ? "Update Story" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD WRITER MODAL */}
      {isWriterModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative font-sans">
            <button onClick={() => setIsWriterModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold cursor-pointer">✕</button>
            <h3 className="text-lg font-bold font-serif text-zinc-900 mb-4">Add Staff Journalist Account</h3>
            <form onSubmit={handleAddWriter} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">WRITER FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={newWriterName}
                  onChange={(e) => setNewWriterName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 font-medium focus:outline-none focus:border-red-600"
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">WRITER EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={newWriterEmail}
                  onChange={(e) => setNewWriterEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 font-medium focus:outline-none focus:border-red-600"
                  placeholder="e.g. sarah.jenkins@digitaljournal.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">ASSIGN INITIAL PASSWORD *</label>
                <input
                  type="password"
                  required
                  value={newWriterPassword}
                  onChange={(e) => setNewWriterPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 font-medium focus:outline-none focus:border-red-600"
                  placeholder="e.g. writer123"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">DESK ROLE & TITLE</label>
                <input
                  type="text"
                  value={newWriterRole}
                  onChange={(e) => setNewWriterRole(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 font-medium focus:outline-none"
                  placeholder="e.g. Senior Tech Correspondent"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsWriterModalOpen(false)} className="px-4 py-2 bg-zinc-200 text-xs font-bold rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-zinc-900 text-white text-xs font-bold rounded">Add Journalist</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD READER MODAL */}
      {isReaderModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsReaderModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold">✕</button>
            <h3 className="text-lg font-bold font-serif text-zinc-900 mb-4">Add Subscriber Record</h3>
            <form onSubmit={handleAddReader} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={newReaderEmail}
                  onChange={(e) => setNewReaderEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900"
                  placeholder="reader@company.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">MEMBERSHIP TIER</label>
                <select
                  value={newReaderMembership}
                  onChange={(e) => setNewReaderMembership(e.target.value as any)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 bg-white"
                >
                  <option value="Subscriber">Subscriber</option>
                  <option value="VIP Member">VIP Member</option>
                  <option value="Registered Reader">Registered Reader</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsReaderModalOpen(false)} className="px-4 py-2 bg-zinc-200 text-xs font-bold rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded">Add Subscriber</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE PREVIEW MODAL */}
      {previewModalArticle && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 font-standard-sans">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setPreviewModalArticle(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold">✕</button>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded uppercase">
              {'category_name' in previewModalArticle ? previewModalArticle.category_name : (previewModalArticle as SubmittedDraft).category}
            </span>
            <h2 className="text-2xl font-bold font-serif text-black mt-2 leading-tight">
              {previewModalArticle.title}
            </h2>
            <p className="text-xs text-zinc-500 mt-2">
              By <span className="font-semibold text-black">{'author_name' in previewModalArticle ? previewModalArticle.author_name : 'Jennifer Friesen'}</span>
            </p>

            <div className="mt-4 pt-4 border-t border-zinc-200 text-sm text-zinc-800 leading-relaxed font-sans">
              <p className="font-bold text-zinc-700 italic bg-zinc-50 p-3 rounded border-l-4 border-[#BF1E2D] mb-4">
                {'description' in previewModalArticle ? previewModalArticle.description : (previewModalArticle as SubmittedDraft).summary}
              </p>
              {'content' in previewModalArticle && (previewModalArticle as SubmittedDraft).content ? (
                <p>{(previewModalArticle as SubmittedDraft).content}</p>
              ) : (
                <p>Full article publication text rendered on live page route.</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-end">
              <button onClick={() => setPreviewModalArticle(null)} className="bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CO-ADMIN MODAL (MAIN ADMIN EXCLUSIVE) */}
      {isCoAdminModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative font-sans">
            <button
              onClick={() => setIsCoAdminModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold font-serif text-zinc-900">
                Grant New Co-Admin Access
              </h3>
            </div>

            <form onSubmit={handleAddCoAdmin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">CO-ADMIN FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={newCoAdminName}
                  onChange={(e) => setNewCoAdminName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 focus:outline-none focus:border-amber-600 font-medium"
                  placeholder="e.g. Operations Co-Admin"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={newCoAdminEmail}
                  onChange={(e) => setNewCoAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 focus:outline-none focus:border-amber-600 font-medium"
                  placeholder="e.g. coadmin@digitaljournal.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">ASSIGN LOGIN PASSCODE *</label>
                <input
                  type="password"
                  required
                  value={newCoAdminPasscode}
                  onChange={(e) => setNewCoAdminPasscode(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 focus:outline-none focus:border-amber-600 font-medium"
                  placeholder="e.g. coadmin123"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCoAdminModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer shadow"
                >
                  Add Co-Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
