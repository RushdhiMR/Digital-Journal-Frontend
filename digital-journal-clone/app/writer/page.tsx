"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  PenTool,
  FileText,
  Send,
  CheckCircle2,
  Eye,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  BookOpen,
  Trash2,
  ExternalLink,
  X
} from "lucide-react";

interface DraftArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  summary: string;
  content: string;
  imageUrl: string;
  status: "Draft" | "Submitted" | "Published";
  date: string;
  reads: number;
}

export default function WriterStudioPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lockPasscode, setLockPasscode] = useState("");
  const [lockError, setLockError] = useState("");

  // New article form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("NEWS");
  const [subcategory, setSubcategory] = useState("world");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Profile & Password Settings state
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // Preview Modal state
  const [previewArticle, setPreviewArticle] = useState<DraftArticle | null>(null);

  const handleUpdateWriterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");

    if (newPasswordInput !== confirmPasswordInput) {
      setProfileError("❌ New password and confirmation do not match!");
      return;
    }

    if (newPasswordInput.length < 4) {
      setProfileError("❌ New password must be at least 4 characters long.");
      return;
    }

    const email = currentUser?.email?.toLowerCase();
    if (!email) {
      setProfileError("❌ No active user email found.");
      return;
    }

    try {
      // 1. Update in dj_writers_list
      const writersListStr = localStorage.getItem("dj_writers_list");
      let wList: any[] = writersListStr ? JSON.parse(writersListStr) : [];
      let foundInWriterList = false;
      wList = wList.map(w => {
        if (w.email && w.email.toLowerCase() === email) {
          foundInWriterList = true;
          return { ...w, password: newPasswordInput };
        }
        return w;
      });
      if (!foundInWriterList) {
        wList.push({
          id: Date.now(),
          name: currentUser?.name || "Writer",
          email: email,
          password: newPasswordInput,
          role: "Staff Journalist",
          status: "Active"
        });
      }
      localStorage.setItem("dj_writers_list", JSON.stringify(wList));

      // 2. Update in dj_registered_users
      const regStr = localStorage.getItem("dj_registered_users");
      let regList: any[] = regStr ? JSON.parse(regStr) : [];
      const regIdx = regList.findIndex(u => u.email && u.email.toLowerCase() === email);
      if (regIdx >= 0) {
        regList[regIdx] = { ...regList[regIdx], password: newPasswordInput };
      } else {
        regList.push({
          name: currentUser?.name || "Writer",
          email: email,
          password: newPasswordInput,
          role: "Writer",
          registeredAt: new Date().toISOString()
        });
      }
      localStorage.setItem("dj_registered_users", JSON.stringify(regList));

      setProfileMsg("🎉 Account password updated successfully! Next time sign in with your new password.");
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
    } catch (err) {
      console.error(err);
      setProfileError("❌ Failed to update password. Please try again.");
    }
  };

  const [drafts, setDrafts] = useState<DraftArticle[]>([
    {
      id: "draft-1",
      title: "Quantum Computing preview clusters open to enterprise developer beta",
      category: "TECHNOLOGY",
      subcategory: "space-technology",
      summary: "Cloud providers roll out 100-qubit developer environments for financial telemetry research.",
      content: "Distributed quantum algorithms are establishing new benchmarks in cryptanalysis and high-frequency portfolio optimization. Developers across enterprise software firms are testing real-time execution environments.",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=350&fit=crop",
      status: "Published",
      date: "July 24, 2026",
      reads: 14200
    },
    {
      id: "draft-2",
      title: "Canadian biotech consortium publishes open-access genome study",
      category: "INNOVATION",
      subcategory: "health",
      summary: "Open science initiative releases 10,000 sequenced genomes for public medical research.",
      content: "By removing proprietary licensing barriers, researchers aim to accelerate rare disease treatment discovery across international academic and commercial research centers.",
      imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&h=350&fit=crop",
      status: "Submitted",
      date: "July 25, 2026",
      reads: 3890
    }
  ]);

  // Auth & Session Check
  useEffect(() => {
    try {
      const savedWriterStr = localStorage.getItem("dj_writer_user");
      const savedUserStr = localStorage.getItem("dj_user");
      
      let activeUser = null;
      if (savedWriterStr) {
        activeUser = JSON.parse(savedWriterStr);
      } else if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed.role === "Writer" || parsed.role === "Admin" || parsed.email?.toLowerCase().includes("writer") || parsed.email?.toLowerCase().includes("admin")) {
          activeUser = parsed;
        }
      }

      // Check for saved submitted drafts
      const localDrafts = localStorage.getItem("dj_writer_submitted_articles");
      if (localDrafts) {
        setDrafts(JSON.parse(localDrafts));
      }

      // Check if Writer account is Deactivated by Main Admin
      const savedWritersStr = localStorage.getItem("dj_writers_list");
      if (savedWritersStr && activeUser && activeUser.role !== "Admin") {
        const writerList: any[] = JSON.parse(savedWritersStr);
        const matchedWriter = writerList.find(
          (w) => (w.email && w.email.toLowerCase() === activeUser.email?.toLowerCase()) || activeUser.email?.toLowerCase().includes("writer")
        );
        if (matchedWriter && matchedWriter.status === "Deactivated") {
          localStorage.removeItem("dj_writer_user");
          localStorage.removeItem("dj_user");
          setCurrentUser(null);
          setIsAuthenticated(false);
          setLockError("❌ Access Suspended: Your Writer publishing account has been deactivated by the Main Admin. Contact Main Admin to request access.");
          return;
        }
      }

      // Require active Writer or Admin session
      if (activeUser && (activeUser.role === "Writer" || activeUser.role === "Admin" || activeUser.email?.toLowerCase().includes("writer") || activeUser.email?.toLowerCase().includes("admin"))) {
        setCurrentUser(activeUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUnlockWriter = (e: React.FormEvent) => {
    e.preventDefault();
    setLockError("");

    // Check if Writer account status is Deactivated
    try {
      const savedWritersStr = localStorage.getItem("dj_writers_list");
      if (savedWritersStr) {
        const writerList: any[] = JSON.parse(savedWritersStr);
        const matchedWriter = writerList.find((w) => w.status === "Deactivated");
        if (matchedWriter) {
          localStorage.removeItem("dj_writer_user");
          localStorage.removeItem("dj_user");
          setCurrentUser(null);
          setLockError("❌ Access Suspended: Your Writer publishing account has been deactivated by the Main Admin.");
          return;
        }
      }
    } catch (err) {
      console.warn(err);
    }

    const validWriterPasswords = ["writer", "writer123", "writer2026", "admin", "admin123"];
    if (validWriterPasswords.includes(lockPasscode.trim())) {
      const writerAcc = {
        name: "Jennifer Friesen",
        email: "writer@digitaljournal.com",
        role: "Writer"
      };
      localStorage.setItem("dj_user", JSON.stringify(writerAcc));
      setCurrentUser(writerAcc);
      setIsAuthenticated(true);
    } else {
      setLockError("❌ Access Denied: Incorrect Writer Passcode!");
    }
  };

  const handleExitToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("dj_writer_user");
    localStorage.removeItem("dj_user");
    window.location.href = "/";
  };

  const handleExitToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("dj_writer_user");
    localStorage.removeItem("dj_user");
    window.location.href = "/login";
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    // Verify writer status before publishing
    try {
      const savedWritersStr = localStorage.getItem("dj_writers_list");
      if (savedWritersStr && currentUser && currentUser.role !== "Admin") {
        const writerList: any[] = JSON.parse(savedWritersStr);
        const matchedWriter = writerList.find((w) => w.status === "Deactivated");
        if (matchedWriter) {
          alert("❌ Publishing Suspended: Your publishing privileges have been deactivated by the Main Admin.");
          return;
        }
      }
    } catch (err) {
      console.warn(err);
    }

    setIsSubmitting(true);
    setSuccessMsg("");

    const newDraft: DraftArticle = {
      id: `draft-${Date.now()}`,
      title: title.trim(),
      category,
      subcategory,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=350&fit=crop",
      status: "Submitted",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      reads: 0
    };

    setTimeout(() => {
      const updatedList = [newDraft, ...drafts];
      setDrafts(updatedList);
      localStorage.setItem("dj_writer_submitted_articles", JSON.stringify(updatedList));

      setTitle("");
      setSummary("");
      setContent("");
      setImageUrl("");
      setIsSubmitting(false);
      setSuccessMsg("🎉 Story successfully submitted to Editorial Bureau for live publishing!");
      setTimeout(() => setSuccessMsg(""), 4500);
    }, 700);
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("dj_writer_submitted_articles", JSON.stringify(updated));
  };

  // Render Writer Security Lock Screen if unauthorized
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-blue-950/60 border border-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-inner">
            <PenTool size={32} />
          </div>

          <h2 className="text-2xl font-bold font-serif mb-1 text-white">Writer Studio Restricted</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Access requires an authenticated Writer credentials session. Enter passcode below to unlock.
          </p>

          {lockError && (
            <div className="mb-4 bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold p-3 rounded text-center">
              {lockError}
            </div>
          )}

          <form onSubmit={handleUnlockWriter} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                WRITER PASSCODE
              </label>
              <input
                type="password"
                required
                placeholder="Enter Writer Passcode (e.g. writer123)"
                value={lockPasscode}
                onChange={(e) => setLockPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-blue-600 transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-xs py-3.5 rounded transition-all uppercase tracking-wider cursor-pointer shadow"
            >
              VERIFY & UNLOCK WRITER STUDIO
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
            <button
              onClick={handleExitToLogin}
              className="hover:text-zinc-300 transition-colors cursor-pointer text-left"
            >
              ← Return to Login Page
            </button>
            <button
              onClick={handleExitToHome}
              className="hover:text-zinc-300 transition-colors cursor-pointer text-right"
            >
              Go to Home Page →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-standard-sans">
      <Header />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8">
        
        {/* Writer Header Card */}
        <div className="bg-zinc-900 text-white rounded-xl p-6 md:p-8 mb-8 shadow-xl border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#BF1E2D] to-rose-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
              <PenTool size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold font-serif">Writer Studio</h1>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  WRITER ROLE
                </span>
              </div>
              <p className="text-zinc-400 text-sm mt-1">
                Signed in as <span className="text-white font-medium">{currentUser?.name || "Jennifer Friesen"}</span> ({currentUser?.email || "writer@digitaljournal.com"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsProfileSettingsOpen(true)}
              className="flex-1 md:flex-none text-center bg-[#BF1E2D] hover:bg-red-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>⚙</span> Password Settings
            </button>
            {(currentUser?.role === "Admin" || currentUser?.role === "Co-Admin") && (
              <Link
                href="/admin"
                className="flex-1 md:flex-none text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer"
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/reader"
              className="flex-1 md:flex-none text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              Reader Hub
            </Link>
          </div>
        </div>

        {/* Writer Performance Analytics Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Stories</span>
              <FileText size={18} className="text-[#BF1E2D]" />
            </div>
            <p className="text-2xl font-bold text-black font-serif">{drafts.length}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Active author pipeline</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Published</span>
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-black font-serif">
              {drafts.filter(d => d.status === "Published").length}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Live on Digital Journal</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Reader Impressions</span>
              <BarChart3 size={18} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-black font-serif">
              {(drafts.reduce((acc, curr) => acc + (curr.reads || 0), 0) + 18090).toLocaleString()}
            </p>
            <p className="text-[11px] text-blue-600 font-medium mt-1">↑ 14% this month</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Author Bureau</span>
              <ShieldCheck size={18} className="text-amber-500" />
            </div>
            <p className="text-lg font-bold text-black font-serif">Senior Reporter</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Verified Press Badge</p>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Create New Article Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <Sparkles size={20} className="text-[#BF1E2D]" />
                <h2 className="text-xl font-bold text-black font-serif">Submit New Article Story</h2>
              </div>
            </div>

            {successMsg && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-lg flex items-center gap-2 animate-fade-in font-sans">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateArticle} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2 font-sans">
                  ARTICLE TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silicon Valley chip manufacturers announce breakthrough architectural updates"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors bg-white font-serif font-bold text-[16px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2 font-sans">
                    CATEGORY *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded text-sm text-zinc-800 bg-white focus:outline-none focus:border-zinc-400 font-sans"
                  >
                    <option value="NEWS">NEWS</option>
                    <option value="BUSINESS">BUSINESS</option>
                    <option value="INDUSTRY INSIGHTS">INDUSTRY INSIGHTS</option>
                    <option value="TECHNOLOGY">TECHNOLOGY</option>
                    <option value="INNOVATION">INNOVATION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2 font-sans">
                    FEATURE IMAGE URL (OPTIONAL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 bg-white font-sans text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2 font-sans">
                  EXCERPT / SUMMARY
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide a concise 2-line preview summary of the story..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 bg-white font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2 font-sans">
                  STORY CONTENT / PARAGRAPHS *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write full article body paragraphs here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 bg-white font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (title && content) {
                      setPreviewArticle({
                        id: "preview",
                        title,
                        category,
                        summary: summary || title,
                        content,
                        imageUrl: imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=350&fit=crop",
                        status: "Draft",
                        date: new Date().toLocaleDateString(),
                        reads: 0
                      });
                    }
                  }}
                  disabled={!title || !content}
                  className="border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-bold text-xs py-3 px-5 rounded transition-all uppercase tracking-wider cursor-pointer font-sans disabled:opacity-40"
                >
                  👁️ Preview Story
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#BF1E2D] hover:bg-red-800 active:scale-[0.99] text-white font-bold text-xs py-3 px-6 rounded transition-all uppercase tracking-wider cursor-pointer font-sans shadow flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={15} />
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT STORY FOR EDITORIAL REVIEW"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Published & Submitted Stories */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200">
                <h3 className="text-base font-bold text-black font-serif flex items-center gap-2">
                  <FileText size={18} className="text-zinc-700" />
                  My Writer Stories ({drafts.length})
                </h3>
              </div>

              <div className="space-y-4">
                {drafts.map((draft) => (
                  <div key={draft.id} className="p-4 border border-zinc-100 rounded-lg hover:border-zinc-300 transition-colors bg-zinc-50/50 group">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[9px] font-bold text-[#1D9BF0] bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        {draft.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          draft.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                        }`}>
                          ● {draft.status}
                        </span>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                          title="Delete draft"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-[14px] font-bold font-serif leading-snug text-black mb-1.5 line-clamp-2">
                      {draft.title}
                    </h4>

                    <p className="text-[12px] text-zinc-600 font-sans line-clamp-2 mb-3 leading-relaxed">
                      {draft.summary}
                    </p>

                    <div className="flex items-center justify-between text-[10.5px] text-zinc-400 font-sans pt-2 border-t border-zinc-200/60">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {draft.date}
                      </span>
                      <button
                        onClick={() => setPreviewArticle(draft)}
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} /> Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Live Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-standard-sans">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewArticle(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black text-xl font-bold cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#1D9BF0] bg-blue-50 px-2.5 py-1 rounded uppercase tracking-wider">
                {previewArticle.category}
              </span>
              <h2 className="text-2xl font-bold font-serif text-black mt-2 leading-tight">
                {previewArticle.title}
              </h2>
              <p className="text-xs text-zinc-500 font-sans mt-2">
                By <span className="font-semibold text-black">{currentUser?.name || "Jennifer Friesen"}</span> • {previewArticle.date}
              </p>
            </div>

            {previewArticle.imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-zinc-100 border border-zinc-200">
                <img src={previewArticle.imageUrl} alt={previewArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-sm font-sans text-zinc-800 leading-relaxed space-y-3">
              <p className="font-bold text-zinc-700 italic border-l-2 border-[#BF1E2D] pl-3 py-1 bg-zinc-50 rounded-r">
                {previewArticle.summary}
              </p>
              {previewArticle.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setPreviewArticle(null)}
                className="bg-zinc-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WRITER PROFILE & PASSWORD SETTINGS MODAL */}
      {isProfileSettingsOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative font-sans">
            <button
              onClick={() => {
                setIsProfileSettingsOpen(false);
                setProfileMsg("");
                setProfileError("");
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚙</span>
              <h3 className="text-lg font-bold font-serif text-zinc-900">
                Writer Password & Account Settings
              </h3>
            </div>

            {profileMsg && (
              <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold p-3 rounded text-center">
                {profileMsg}
              </div>
            )}

            {profileError && (
              <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold p-3 rounded text-center">
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateWriterPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  ASSIGNED WRITER EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || "writer@digitaljournal.com"}
                  className="w-full px-3 py-2 bg-zinc-100 border border-zinc-300 rounded text-xs text-zinc-600 font-semibold cursor-not-allowed"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Email address assigned by Main Admin for staff credentials.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  SET NEW PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min. 4 characters)"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 focus:outline-none focus:border-red-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  CONFIRM NEW PASSWORD *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password to confirm"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs text-zinc-900 focus:outline-none focus:border-red-600 font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileSettingsOpen(false);
                    setProfileMsg("");
                    setProfileError("");
                  }}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#BF1E2D] hover:bg-red-800 text-white rounded-lg cursor-pointer shadow"
                >
                  Update My Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
