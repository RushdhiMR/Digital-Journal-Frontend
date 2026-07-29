"use client";

import Link from "next/link";

export default function HeroSection() {
  const trendingArticles = [
    {
      id: 1,
      title: "Can space AI data centres solve Earth's computing crisis?",
      date: "July 28, 2026",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=150&fit=crop",
      href: "/technology/artificial-intelligence/can-space-ai-data-centres-solve-earths-computing-crisis"
    },
    {
      id: 2,
      title: "Canadian mathematician honoured for reshaping global data networks",
      date: "July 27, 2026",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=150&fit=crop",
      href: "/business/companies/canadian-mathematician-honoured-for-reshaping-global-data-networks"
    },
    {
      id: 3,
      title: "China's Kimi K3 model rattles US AI technology industry",
      date: "July 26, 2026",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=150&fit=crop",
      href: "/technology/innovations/chinas-kimi-k3-model-rattles-us-ai-technology-industry"
    },
    {
      id: 4,
      title: "Startups bet on autonomous AI agents for leaner enterprise operations",
      date: "July 25, 2026",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=150&fit=crop",
      href: "/business/startups/startups-bet-on-autonomous-ai-agents"
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 border-b border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: Large Featured Image (~40%) */}
        <div className="lg:col-span-5 w-full">
          <Link
            href="/business/security/what-tools-business-should-take-from-a-massive-security-breach-to-prevent-future-attacks"
            className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900 rounded-none block group"
          >
            <img
              src="https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1000&h=750&fit=crop"
              alt="Cyber security command center with screens"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 bg-[#BF1E2D] text-white text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider">
              SECURITY / TECH
            </div>
          </Link>
        </div>

        {/* COLUMN 2: Main Featured Article Details (~42%) */}
        <div className="lg:col-span-4 flex flex-col justify-center pr-0 lg:pr-2">
          <div className="flex gap-2 mb-3">
            <span className="bg-red-50 text-[#BF1E2D] text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider border border-red-200">
              BUSINESS
            </span>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider border border-blue-200">
              CYBERSECURITY
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold leading-[1.2] mb-3 text-gray-900 font-serif">
            <Link
              href="/business/security/what-tools-business-should-take-from-a-massive-security-breach-to-prevent-future-attacks"
              className="hover:text-[#BF1E2D] transition-colors"
            >
              What tools business should take from a massive security breach to prevent future attacks
            </Link>
          </h1>

          <p className="text-[13.5px] text-gray-600 leading-relaxed mb-4 font-sans">
            A massive security breach has exposed vulnerable systems. Experts suggest key tools businesses should implement to prevent future data theft, protect customer records, and secure infrastructure.
          </p>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                alt="John Doe"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-900">
                By <Link href="/author/john-doe" className="hover:text-[#BF1E2D] underline">John Doe</Link>
              </p>
              <p className="text-[10.5px] text-gray-400">July 28, 2026 • 4 min read</p>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Right Sidebar - Numbered Trending News (~18%) */}
        <div className="lg:col-span-3 border-t lg:border-t-0 border-l-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
            <div className="w-2.5 h-2.5 bg-[#BF1E2D]" />
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-900">
              Trending News
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {trendingArticles.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="py-3 flex items-start gap-3 group cursor-pointer block"
              >
                <div className="flex-1">
                  <h3 className="text-[12.5px] font-bold leading-snug text-gray-900 group-hover:text-[#BF1E2D] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {item.date}
                  </span>
                </div>
                <div className="relative w-[70px] h-[52px] overflow-hidden bg-gray-100 flex-shrink-0 rounded-none">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
