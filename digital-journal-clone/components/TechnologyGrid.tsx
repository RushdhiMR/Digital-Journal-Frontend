"use client";

import Link from "next/link";

export default function TechnologyGrid() {
  const technologyArticles = [
    {
      title: "Silicon Valley chip manufacturers announce breakthrough architectural updates",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=380&fit=crop",
      description: "New nanometer transistor architectures are set to double computing speeds while reducing power requirements...",
      category: "technology",
      subcategory: "innovations"
    },
    {
      title: "New quantum computing clusters open to public cloud developer preview",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=380&fit=crop",
      description: "Developers can now run quantum algorithms directly on secure cloud nodes powered by next-gen cooling systems...",
      category: "technology",
      subcategory: "innovations"
    },
    {
      title: "Open-source database platform raises record funding round for scaling",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=380&fit=crop",
      description: "The open-source ecosystem gains support with a massive funding round targeted at global replication modules...",
      category: "technology",
      subcategory: "innovations"
    },
    {
      title: "How edge computing is transforming real-time telemetry processing",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=380&fit=crop",
      description: "Processing data closer to the source decreases latency and allows immediate feedback in remote sensor arrays...",
      category: "technology",
      subcategory: "cybersecurity"
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 border-t border-gray-200 font-standard-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black uppercase">
          <span className="bg-[#FFE9D6] text-black px-2 py-0.5">Technology</span>
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">
          LATEST NEWS IN CHIPS, INFRASTRUCTURE AND SYSTEM DEVELOPMENTS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technologyArticles.map((article, index) => {
          const slug = article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          const articleUrl = `/${article.category}/${article.subcategory}/${slug}`;

          return (
            <article key={index} className="flex flex-col group">
              <Link href={articleUrl} className="relative w-full aspect-[4/3] overflow-hidden mb-3 bg-gray-100 rounded-lg block">
                <img
                  src={article.image}
                  alt={article.title}
                  onError={(e) => { e.currentTarget.src = "/ai_chip.png"; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h3 className="text-[13.5px] font-bold leading-tight text-black mb-2 line-clamp-2">
                <Link href={articleUrl} className="group-hover:text-[#BF1E2D] transition-colors">
                  {article.title}
                </Link>
              </h3>
              <p className="text-[11.5px] text-gray-600 leading-relaxed mb-1 line-clamp-3 font-sans">
                {article.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
