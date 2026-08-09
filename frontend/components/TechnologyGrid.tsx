"use client";

import Link from "next/link";

export default function TechnologyGrid() {
  const techArticles = [
    {
      id: 1,
      title: "Here's what to eat to keep your bones strong (that's not just dairy)",
      description: "Our bone density begins declining earlier than you might think. But ensuring our diet is rich in certain nutrients can help to keep our skeletons strong.",
      image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&h=480&fit=crop",
      href: "/technology/what-to-eat-keep-bones-strong"
    },
    {
      id: 2,
      title: "Where giant sharks swim so close to shore you can nearly touch them",
      description: "Basking sharks are one of the world's largest and most elusive fish species but these gentle giants cruise off the Irish coast each year.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=480&fit=crop",
      href: "/technology/where-giant-sharks-swim-close-to-shore"
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 border-b border-gray-200 font-sans">
      {/* Red Bar Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-6 bg-[#D31220]" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Technology
        </h2>
      </div>

      {/* 2 Equal 50/50 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {techArticles.map((article) => (
          <article key={article.id} className="flex flex-col group cursor-pointer">
            <Link
              href={article.href}
              className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-none mb-4 block"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <h3 className="text-xl font-bold leading-snug text-gray-900 group-hover:text-[#D31220] transition-colors mb-2 font-serif">
              <Link href={article.href}>
                {article.title}
              </Link>
            </h3>

            <p className="text-[13px] text-gray-600 leading-relaxed font-sans">
              {article.description}
            </p>
          </article>
        ))}
      </div>

      {/* FULL WIDTH CENTERED AD BANNER */}
      <div className="w-full bg-black text-white py-14 flex items-center justify-center rounded-none">
        <span className="text-sm font-mono tracking-widest text-gray-400">Ad</span>
      </div>
    </section>
  );
}
