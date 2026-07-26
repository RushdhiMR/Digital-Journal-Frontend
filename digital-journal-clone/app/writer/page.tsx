"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PenTool, FileText, Send, CheckCircle2, Eye, Clock, Sparkles } from "lucide-react";

interface DraftArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  status: "Draft" | "Submitted" | "Published";
  date: string;
}

export default function WriterStudioPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  
  // New article form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("NEWS");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [drafts, setDrafts] = useState<DraftArticle[]>([
    {
      id: "draft-1",
      title: "Quantum Computing preview clusters open to enterprise developer beta",
      category: "TECHNOLOGY",
      summary: "Cloud providers roll out 100-qubit developer environments for financial telemetry research.",
      content: "Distributed quantum algorithms are establishing new benchmarks in cryptanalysis and high-frequency portfolio optimization...",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=350&fit=crop",
      status: "Published",
      date: "July 24, 2026"
    },
    {
      id: "draft-2",
      title: "Canadian biotech consortium publishes open-access genome study",
      category: "INNOVATION",
      summary: "Open science initiative releases 10,000 sequenced genomes for public medical research.",
      content: "By removing proprietary licensing barriers, researchers aim to accelerate rare disease treatment discovery...",
      imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&h=350&fit=crop",
      status: "Submitted",
      date: "July 25, 2026"
    }
  ]);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("dj_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      } else {
        // Default Writer session if accessed directly
        const writerUser = { name: "Jennifer Friesen", email: "writer@digitaljournal.com", role: "Writer" };
        localStorage.setItem("dj_user", JSON.stringify(writerUser));
        setCurrentUser(writerUser);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    setSuccessMsg("");

    const newDraft: DraftArticle = {
      id: `draft-${Date.now()}`,
      title,
      category,
      summary: summary || title,
      content,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=350&fit=crop",
      status: "Submitted",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    setTimeout(() => {
      setDrafts([newDraft, ...drafts]);
      setTitle("");
      setSummary("");
      setContent("");
      setImageUrl("");
      setIsSubmitting(false);
      setSuccessMsg("🎉 Article successfully submitted for editorial review!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 800);
  };

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
                Signed in as <span className="text-white font-medium">{currentUser?.name || "Writer"}</span> ({currentUser?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/admin"
              className="flex-1 md:flex-none text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold px-4 py-2.5 rounded transition-all cursor-pointer"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/reader"
              className="flex-1 md:flex-none text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold px-4 py-2.5 rounded transition-all cursor-pointer"
            >
              Reader Hub
            </Link>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Create New Article Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-zinc-200">
              <Sparkles size={20} className="text-[#BF1E2D]" />
              <h2 className="text-xl font-bold text-black font-serif">Submit New Article Story</h2>
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
                  placeholder="e.g. Next-generation AI models reshape enterprise supply chains"
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

              <div className="pt-2 flex justify-end">
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
                  <div key={draft.id} className="p-4 border border-zinc-100 rounded-lg hover:border-zinc-300 transition-colors bg-zinc-50/50">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[9px] font-bold text-[#1D9BF0] bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        {draft.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        draft.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                      }`}>
                        ● {draft.status}
                      </span>
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
                      <Link href="/news" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                        <Eye size={12} /> View Live
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
