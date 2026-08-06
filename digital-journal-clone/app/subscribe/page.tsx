"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FastStartNewsletterBanner from "@/components/FastStartNewsletterBanner";
import { CheckCircle2, Mail, ShieldCheck, Zap, Bell, Sparkles, Check, Star } from "lucide-react";

interface TopicItem {
  id: string;
  title: string;
  schedule: string;
  description: string;
  tags: string[];
}

export default function SubscribePage() {
  const topics: TopicItem[] = [
    {
      id: "world",
      title: "World & Geopolitics",
      schedule: "Daily Digest (8:00 AM EST)",
      description: "Verified international reporting, policy revisions, and global security analysis.",
      tags: ["World Affairs", "Global Policy", "Security"]
    },
    {
      id: "business",
      title: "Business & Financial Markets",
      schedule: "Daily & Weekly Summaries",
      description: "Market shifts, enterprise earnings, startup valuations, and corporate governance.",
      tags: ["Markets", "Corporate News", "Startups"]
    },
    {
      id: "technology",
      title: "Technology & Artificial Intelligence",
      schedule: "Daily Digest (12:00 PM EST)",
      description: "Breakthroughs in generative AI, cybersecurity protocols, and systems engineering.",
      tags: ["AI & Data", "Cybersecurity", "Hardware"]
    },
    {
      id: "industry",
      title: "Industry Insights & Logistics",
      schedule: "Twice Weekly (Tue / Thu)",
      description: "Metrics and operational advancements across clean energy, logistics, and healthcare.",
      tags: ["Energy", "Supply Chain", "Health Tech"]
    },
    {
      id: "innovation",
      title: "Innovation & Strategy",
      schedule: "Weekly Summary (Saturdays)",
      description: "Disruptive business models, design thinking, venture capital, and startup pivots.",
      tags: ["Venture Capital", "Design Thinking"]
    },
    {
      id: "events",
      title: "Developer Summits & Events",
      schedule: "Weekly Calendar (Wednesdays)",
      description: "Curated developer summits, tech webinars, and industry panel schedules.",
      tags: ["Conferences", "Webinars", "Meetups"]
    }
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>(["world", "business", "technology"]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState<"free" | "premium">("premium");
  const [subscribed, setSubscribed] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, tier, topics: selectedIds }),
      });
    } catch (err) {
      try {
        await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, tier, topics: selectedIds }),
        });
      } catch (e) {
        console.warn("Subscribe offline sync:", e);
      }
    }

    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
      setName("");
    }, 5000);
  };

  return (
    <main className="min-h-screen bg-white font-standard-sans">
      <Header />

      {/* TOAST SUCCESS NOTIFICATION */}
      {subscribed && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-bold py-3.5 px-8 rounded-full border border-zinc-700 shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>✓ Welcome to Digital Journal! Your subscription is active.</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="bg-zinc-900 text-white py-16 px-4 border-b border-zinc-800 text-center relative overflow-hidden font-sans">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#BF1E2D]/20 border border-[#BF1E2D]/40 text-[#FF4D5E] text-[11px] font-bold uppercase tracking-wider mb-4 rounded-full">
            <Sparkles size={14} />
            <span>Digital Journal Official Subscriptions</span>
          </div>

          <h1 className="font-serif text-[34px] sm:text-[44px] md:text-[50px] font-bold text-white tracking-tight leading-[1.12] mb-4">
            Independent Journalism. Real-Time Intelligence.
          </h1>

          <p className="text-[14px] md:text-[16.5px] text-zinc-300 font-sans max-w-2xl mx-auto leading-relaxed font-normal">
            Subscribe to Digital Journal to unlock daily news digests, executive intelligence, and customized topic feeds delivered directly to your inbox.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-12 font-sans">
        
        {/* SUBSCRIPTION TIER CARDS */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold text-[#BF1E2D] uppercase tracking-wider block mb-1">
              Select Subscription Tier
            </span>
            <h2 className="font-serif text-[24px] md:text-[28px] font-bold text-zinc-900">
              Choose the Plan That Fits Your Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Reader Tier */}
            <div
              onClick={() => setTier("free")}
              className={`p-6 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                tier === "free"
                  ? "bg-white border-[#BF1E2D] ring-2 ring-[#BF1E2D]/20 shadow-md"
                  : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[18px] text-zinc-900 font-serif">
                    Digital Journal Fast Start
                  </h3>
                  <span className="text-[11px] bg-zinc-200 text-zinc-800 font-bold px-2.5 py-0.5 rounded">
                    FREE
                  </span>
                </div>
                <p className="text-[12.5px] text-zinc-600 mb-5 leading-relaxed">
                  Daily morning news summaries and essential headlines from around the world.
                </p>

                <ul className="space-y-2 text-[12.5px] text-zinc-700 mb-6 font-sans">
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-emerald-600 flex-shrink-0" />
                    <span>Daily Morning Briefing (8 AM)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-emerald-600 flex-shrink-0" />
                    <span>Standard Website Reading Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-emerald-600 flex-shrink-0" />
                    <span>Cancel or modify anytime</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <span className="font-bold text-[22px] text-zinc-900">$0</span>
                <span className="text-[12px] text-zinc-500 font-normal"> / forever free</span>
              </div>
            </div>

            {/* Premium Full Access Tier */}
            <div
              onClick={() => setTier("premium")}
              className={`p-6 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                tier === "premium"
                  ? "bg-red-50/30 border-[#BF1E2D] ring-2 ring-[#BF1E2D]/30 shadow-lg"
                  : "bg-white border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div className="absolute top-3 right-3 bg-[#BF1E2D] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
                <Star size={11} className="fill-white" />
                <span>MOST POPULAR</span>
              </div>

              <div>
                <div className="mb-2 pr-24">
                  <h3 className="font-bold text-[18px] text-zinc-900 font-serif">
                    Full Journal Access
                  </h3>
                </div>
                <p className="text-[12.5px] text-zinc-600 mb-5 leading-relaxed">
                  Complete unrestricted access, tailored topic digests, real-time alerts, and ad-free experience.
                </p>

                <ul className="space-y-2 text-[12.5px] text-zinc-800 mb-6 font-sans">
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-[#BF1E2D] flex-shrink-0 font-bold" />
                    <span><strong>Unrestricted</strong> Breaking News Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-[#BF1E2D] flex-shrink-0 font-bold" />
                    <span><strong>All Custom Topic Digests</strong> (Tech, AI, Markets)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-[#BF1E2D] flex-shrink-0 font-bold" />
                    <span><strong>Real-Time</strong> Policy & Market Signals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-[#BF1E2D] flex-shrink-0 font-bold" />
                    <span><strong>Reader Saved Stories</strong> Dashboard Sync</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-red-100">
                <span className="font-bold text-[22px] text-[#BF1E2D]">All-Access Pass</span>
                <span className="text-[12px] text-zinc-500 font-normal"> — 100% Free Trial Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOPICS SELECTION */}
        <div className="mb-12">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
            <h3 className="font-serif text-[20px] font-bold text-zinc-900">
              Customize Your Topic Subscriptions
            </h3>
            <span className="text-[12px] text-zinc-500">
              {selectedIds.length} of {topics.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topics.map((item) => {
              const isChecked = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`p-4.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? "bg-red-50/40 border-[#BF1E2D]"
                      : "bg-white border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="pt-0.5 flex-shrink-0">
                    <div
                      className={`w-4.5 h-4.5 rounded flex items-center justify-center transition-colors ${
                        isChecked ? "bg-[#BF1E2D] text-white" : "border-2 border-zinc-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check size={13} strokeWidth={3} />}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-[15px] text-zinc-900 font-serif leading-snug mb-0.5">
                      {item.title}
                    </h4>
                    <span className="text-[10.5px] font-bold text-[#BF1E2D] uppercase tracking-wider block mb-1.5">
                      {item.schedule}
                    </span>
                    <p className="text-[12px] text-zinc-600 font-sans leading-relaxed mb-2 font-normal">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-[9.5px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INPUT FORM */}
        <div className="bg-zinc-900 text-white rounded-xl p-6 md:p-10 shadow-xl border border-zinc-800 mb-14">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-serif text-[24px] font-bold text-white mb-2 text-center">
              Complete Your Subscription
            </h3>
            <p className="text-[13px] text-zinc-400 text-center mb-6 font-sans">
              Enter your email address to receive your curated Digital Journal updates.
            </p>

            <form onSubmit={handleSubscribeSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-4 py-3 text-[14px] bg-zinc-800 border border-zinc-700 focus:border-[#BF1E2D] text-white placeholder-zinc-500 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1">
                    Email Address <span className="text-[#BF1E2D]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 text-[14px] bg-zinc-800 border border-zinc-700 focus:border-[#BF1E2D] text-white placeholder-zinc-500 rounded focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#BF1E2D] hover:bg-red-700 text-white font-bold text-[14px] uppercase tracking-wider rounded transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <Mail size={18} />
                <span>Subscribe Now</span>
              </button>

              <p className="text-[11px] text-zinc-400 text-center pt-2 font-sans">
                🔒 Spam-free guarantee. Unsubscribe with 1 click anytime. Subject to Digital Journal&apos;s <Link href="#" className="underline text-zinc-300 hover:text-white">Terms of Service</Link> & <Link href="#" className="underline text-zinc-300 hover:text-white">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>

        {/* BENEFIT HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-200">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 border border-zinc-100">
            <ShieldCheck className="w-6 h-6 text-[#BF1E2D] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[14px] text-zinc-900 font-serif mb-1">Verified Newsroom</h4>
              <p className="text-[12px] text-zinc-600 leading-relaxed">Fact-checked stories directly from verified journalists.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 border border-zinc-100">
            <Zap className="w-6 h-6 text-[#BF1E2D] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[14px] text-zinc-900 font-serif mb-1">Real-Time Market Signals</h4>
              <p className="text-[12px] text-zinc-600 leading-relaxed">Instant updates on regulatory shifts & tech innovations.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 border border-zinc-100">
            <Bell className="w-6 h-6 text-[#BF1E2D] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[14px] text-zinc-900 font-serif mb-1">Total Control</h4>
              <p className="text-[12px] text-zinc-600 leading-relaxed">Manage your frequency or pause emails with 1 click.</p>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
