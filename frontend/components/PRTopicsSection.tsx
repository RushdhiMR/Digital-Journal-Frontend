"use client";

import Link from "next/link";

export default function PRTopicsSection() {
  const prArticles = [
    {
      id: 1,
      title: "Urban real estate tech integrates smart grid infrastructure",
      description: "Commercial building developments adopt automated energy management systems for zero-net emissions targets.",
      author: "David Chen",
      date: "July 28, 2026",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&h=350&fit=crop",
      href: "/pr-topics/urban-real-estate-smart-grid"
    },
    {
      id: 2,
      title: "Deep learning models optimize global supply chain routing",
      description: "Logistics providers utilize predictive AI traffic algorithms to minimize transit delays across oceanic routes.",
      author: "Pramod Asu",
      date: "July 27, 2026",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=350&fit=crop",
      href: "/pr-topics/deep-learning-supply-chain-routing"
    },
    {
      id: 3,
      title: "Data center power consumption drops with liquid immersion cooling",
      description: "Hyperscale cloud operators implement liquid cooling tech to eliminate thermal bottlenecks during peak workloads.",
      author: "Lisa Chen",
      date: "July 27, 2026",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=350&fit=crop",
      href: "/pr-topics/data-center-liquid-immersion-cooling"
    },
    {
      id: 4,
      title: "Fiber optic telecom networks scale to handle multi-terabit traffic",
      description: "Next-gen optical switches increase bandwidth throughput by 400% without incurring exponential hardware upgrades.",
      author: "Sarah Mitchell",
      date: "July 26, 2026",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&h=350&fit=crop",
      href: "/pr-topics/fiber-optic-telecom-networks"
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-6 bg-[#BF1E2D]" />
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
          PR Topics
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {prArticles.map((article) => (
          <article key={article.id} className="flex flex-col group cursor-pointer">
            <Link
              href={article.href}
              className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-none mb-3 block"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <h3 className="text-[13.5px] font-bold leading-snug text-gray-900 group-hover:text-[#BF1E2D] transition-colors mb-2 line-clamp-2">
              <Link href={article.href}>
                {article.title}
              </Link>
            </h3>

            <p className="text-[12px] text-gray-600 leading-relaxed mb-2 line-clamp-3">
              {article.description}
            </p>

            <p className="text-[10.5px] text-gray-400 font-medium mt-auto">
              By <span className="text-gray-700 font-semibold">{article.author}</span> • {article.date}
            </p>
          </article>
        ))}
      </div>

      {/* AD BANNER PLACEHOLDER */}
      <div className="w-full bg-black text-white py-14 flex items-center justify-center rounded-none">
        <span className="text-sm font-mono tracking-widest text-gray-400">Ad</span>
      </div>
    </section>
  );
}
