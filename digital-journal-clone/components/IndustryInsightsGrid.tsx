"use client";

export default function IndustryInsightsGrid() {
  const industryInsightsArticles = [
    {
      title: "Venture capital firms shift focus to sustainable tech sector pipelines",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=350&h=220&fit=crop",
      description: "Investors redirect capital toward companies that prioritize carbon capture, sustainable energy storage, and efficiency..."
    },
    {
      title: "How remote leadership models are evolving to meet product goals",
      image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=350&h=220&fit=crop",
      description: "Engineering teams adapt asynchronous planning methods to ship software features without co-location bottlenecks..."
    },
    {
      title: "Global logistics platforms integrate machine learning for routing",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=350&h=220&fit=crop",
      description: "Predictive neural networks recalculate global shipping routes in real time based on weather and customs data..."
    },
    {
      title: "Why corporate investment in developer experience yields positive ROI",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=350&h=220&fit=crop",
      description: "Improving local development pipelines, test suites, and docs reduces burnout and boosts engineering throughput..."
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 border-t border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black uppercase">
          Industry <span className="bg-[#E2F0D9] text-black px-2 py-0.5 ml-1">Insights</span>
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">
          NEWS AND ANALYSIS COVERING ENERGY, HEALTH, LOGISTICS AND INFRASTRUCTURE
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {industryInsightsArticles.map((article, index) => (
          <article key={index} className="flex flex-col cursor-pointer group">
            <div className="relative w-full aspect-[4/3] overflow-hidden mb-3 bg-gray-100">
              <img
                src={article.image}
                alt={article.title}
                onError={(e) => { e.currentTarget.src = "/ai_hero.png"; }}
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
            <h3 className="text-[13.5px] font-bold leading-tight text-black group-hover:text-red-600 transition-colors mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-[11.5px] text-gray-600 leading-relaxed mb-1 line-clamp-3">
              {article.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
