"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ALL_ARTICLES = [
  {
    title: "Review: Has AI been chasing the wrong dream since Alan Turing?",
    description: "The essential question, then, is not whether machines can imitate people. Turing asked a brilliant question for the early age of computing.",
    category: "Innovation",
    href: "/innovation/people",
    date: "By Dr. Tim Sandle • July 19, 2026",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop"
  },
  {
    title: "Silicon chips learn to write DNA: Research points to cleaner route for synthetic biology",
    description: "The Harvard chip is an early-stage demonstration rather than an industrial replacement for current DNA synthesis platforms.",
    category: "Technology",
    href: "/technology/emerging-tech",
    date: "By Dr. Tim Sandle • July 19, 2026",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop"
  },
  {
    title: "Canada's soft robotics research is moving from laboratory novelty to business tool",
    description: "Canada's advantage lies in combining engineering research, AI strength, materials science, and medical technology.",
    category: "Technology",
    href: "/technology/infrastructure",
    date: "By Dr. Tim Sandle • July 19, 2026",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop"
  },
  {
    title: "Pocket-size AI: Powerful phones star at China show",
    description: "Wide adoption of phones running on so-called AI agents would be a revolution, but would also take control away from major apps.",
    category: "Technology",
    href: "/technology/emerging-tech",
    date: "By AFP • July 19, 2026",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=300&fit=crop"
  },
  {
    title: "Boeing gets order for 100 737 MAX jets from leasing company SMBC",
    description: "US aircraft manufacturer Boeing Monday said it has received an order for 100 of its 737 MAX jets from leasing company SMBC Aviation Capital.",
    category: "Industry Insights",
    href: "/industry-insights/boeing-gets-order-for-100-737-max-jets-from-leasing-company-smbc",
    date: "By AFP • July 20, 2026",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=500&h=300&fit=crop"
  },
  {
    title: "SpaceX abruptly scrubs Starship test flight",
    description: "Aerospace company SpaceX abruptly cancelled a highly anticipated test launch of its Starship rocket at the last minute.",
    category: "Industry Insights",
    href: "/industry-insights/spacex-abruptly-scrubs-starship-test-flight",
    date: "By AFP • July 19, 2026",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop"
  },
  {
    title: "New science report could boost climate suits against oil giants",
    description: "New analysis formats for attributing weather extremeness to greenhouse gas emissions... Common ground for potential lawsuits.",
    category: "News",
    href: "/news/environment",
    date: "By David Chen • July 19, 2026",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=220&h=150&fit=crop"
  },
  {
    title: "Uber to gobble up Delivery Hero in Taiwan food delivery deal",
    description: "The deal would expand Uber Eats' presence in the competitive Asian food delivery space, in a transaction valued at $950 million.",
    category: "News",
    href: "/news/business",
    date: "By Jane Smith • July 19, 2026",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=220&h=150&fit=crop"
  }
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState(ALL_ARTICLES);

  useEffect(() => {
    if (!query) {
      setResults(ALL_ARTICLES);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = ALL_ARTICLES.filter(
        (art) =>
          art.title.toLowerCase().includes(lowerQuery) ||
          art.description.toLowerCase().includes(lowerQuery) ||
          art.category.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    }
  }, [query]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 font-standard-sans min-h-[60vh]">
      <div className="border-b border-zinc-200 pb-6 mb-10">
        <h1 className="text-[28px] md:text-[34px] font-bold text-zinc-900 leading-tight">
          Search Results
        </h1>
        <p className="text-[14px] text-zinc-500 mt-2 font-normal">
          {query ? (
            <>
              Showing results for &quot;<span className="font-semibold text-black">{query}</span>&quot; ({results.length} articles found)
            </>
          ) : (
            "Explore our latest articles"
          )}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((art, idx) => (
            <article key={idx} className="flex flex-col border border-zinc-200 p-4 rounded-lg hover:shadow-md transition-shadow bg-white">
              <div className="aspect-video w-full overflow-hidden bg-zinc-100 mb-4 rounded">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-2">
                {art.category}
              </span>
              <Link href={art.href} className="text-[16px] font-bold leading-snug text-zinc-900 hover:text-red-600 hover:underline mb-2">
                {art.title}
              </Link>
              <p className="text-[13px] text-zinc-600 leading-relaxed mb-4 line-clamp-3">
                {art.description}
              </p>
              <span className="text-[11px] text-zinc-400 mt-auto">{art.date}</span>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-50 border border-zinc-200 rounded-lg">
          <p className="text-[16px] text-zinc-500 font-medium">
            No articles found matching &quot;{query}&quot;.
          </p>
          <Link href="/" className="inline-block mt-4 text-[13px] font-bold text-red-600 hover:underline">
            Return to Homepage
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 text-center font-standard-sans min-h-[60vh]">
          <p className="text-[15px] text-zinc-500">Loading search results...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
