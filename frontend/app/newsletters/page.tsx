"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterBanner from "@/components/NewsletterBanner";

interface NewsletterItem {
  id: string;
  title: string;
  schedule: string;
  description: string;
  subcategories: string[];
}

export default function NewslettersPage() {
  const newsletters: NewsletterItem[] = [
    {
      id: "news",
      title: "News",
      schedule: "Daily digest",
      description: "Stay updated with global stories, markets, politics, policy changes, and local news.",
      subcategories: ["World", "Markets", "Politics"]
    },
    {
      id: "business",
      title: "Business",
      schedule: "Weekly summary",
      description: "Get the latest on companies, corporate news, startup trends, and leadership shifts.",
      subcategories: ["Companies", "Corporate News", "Entrepreneurship", "Startups", "Leadership"]
    },
    {
      id: "industry-insights",
      title: "Industry Insights",
      schedule: "Twice a week",
      description: "Keep track of business trends, logistical advancements, and operational metrics across agriculture, tourism, and finance.",
      subcategories: ["Agriculture", "Tourism", "Financial Services", "Health", "Transportation"]
    },
    {
      id: "technology",
      title: "Technology",
      schedule: "Daily updates",
      description: "Deep dive into artificial intelligence developments, cybersecurity protocols, innovations, and space technology.",
      subcategories: ["Artificial Intelligence", "Cybersecurity", "Innovations", "Space Technology"]
    },
    {
      id: "innovation",
      title: "Innovation",
      schedule: "Weekly summary",
      description: "Get the latest on startup pivots, fresh ideas, and creative business strategy.",
      subcategories: []
    },
    {
      id: "events",
      title: "Events",
      schedule: "Once a week",
      description: "Never miss developer conferences, summits, online webinars, and community tech meetups.",
      subcategories: []
    }
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === newsletters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(newsletters.map((n) => n.id));
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
      setSelectedIds([]);
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Top Banner section */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-12 text-center font-standard-sans">
        <h1 className="text-[28px] md:text-[34px] font-bold text-[#BF1E2D] uppercase tracking-[2px]">
          NEWSLETTERS
        </h1>
        <p className="text-[12px] text-zinc-500 mt-2">
          Stay up to date with our daily newsletters.
        </p>
      </section>

      {/* Main Body block */}
      <div className="max-w-[840px] mx-auto px-4 py-16 font-standard-sans">
        
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-[24px] md:text-[28px] font-semibold text-zinc-900 leading-tight mb-4">
            Let the best of London BigBen news come to you.
          </h2>
          <p className="text-[13px] text-zinc-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Select any of the free newsletters below. Then, enter your email address and click &quot;Sign Up Now.&quot;<br />
            Your newsletter subscriptions with us are subject to London BigBen&apos;s{" "}
            <Link href="#" className="underline text-[#BF1E2D] font-bold">Terms and Conditions</Link> and{" "}
            <Link href="#" className="underline text-[#BF1E2D] font-bold">Privacy Policy</Link>.
          </p>

          <button
            onClick={selectAll}
            className="mt-8 bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-[12px] px-6 py-3 tracking-wider uppercase cursor-pointer transition-colors rounded-none"
          >
            {selectedIds.length === newsletters.length ? "DESELECT ALL NEWSLETTERS" : "SELECT ALL NEWSLETTERS"}
          </button>
        </div>

        {/* Checkbox grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-t border-b border-zinc-200 py-12 my-12">
          {newsletters.map((n) => {
            const isChecked = selectedIds.includes(n.id);
            return (
              <div
                key={n.id}
                onClick={() => toggleSelect(n.id)}
                className="flex items-start gap-4 cursor-pointer group"
              >
                {/* Custom Checkbox */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by div click
                    className="w-4.5 h-4.5 accent-[#BF1E2D] cursor-pointer"
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col w-full">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[16px] text-zinc-900 group-hover:text-[#BF1E2D] transition-colors leading-none">
                      {n.title}
                    </span>
                    <span className="text-[11px] italic text-zinc-400 font-sans font-normal">
                      {n.schedule}
                    </span>
                  </div>
                  
                  {/* Brief description */}
                  <p className="text-[12.5px] text-zinc-500 leading-relaxed font-sans font-normal mt-2">
                    {n.description}
                  </p>

                  {/* Dive Deeper bullet points */}
                  {n.subcategories.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-100">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-zinc-400">
                        Dive Deeper:
                      </span>
                      <ul className="mt-2 space-y-1.5 pl-1 text-[12.5px] text-zinc-600 font-sans font-normal">
                        {n.subcategories.map((sub, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#BF1E2D] flex-shrink-0"></span>
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom high-fidelity signup form */}
        <NewsletterBanner />

      </div>

      <Footer />
    </main>
  );
}
