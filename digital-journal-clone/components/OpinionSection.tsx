"use client";

import Link from "next/link";

export default function OpinionSection() {
  const opinionArticles = [
    {
      id: 1,
      title: "Remote leadership models evolve to meet global production goals",
      description: "Distributed teams require agile workflows and output-based metrics rather than traditional hours tracking.",
      author: "Jessica Lee",
      date: "July 28, 2026",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=350&fit=crop",
      href: "/opinion/remote-leadership-models-evolve"
    },
    {
      id: 2,
      title: "Why corporate investment in developer experience yields positive ROI",
      description: "Reducing friction in internal software pipelines directly accelerates feature delivery and developer retention.",
      author: "Agil Riaz",
      date: "July 27, 2026",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=350&fit=crop",
      href: "/opinion/developer-experience-positive-roi"
    },
    {
      id: 3,
      title: "Transitioning from monolithic legacy systems to agile microservices",
      description: "Step-by-step decoupling of monolithic databases enables fault tolerance and seamless scalability.",
      author: "Lisa Chen",
      date: "July 27, 2026",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=350&fit=crop",
      href: "/opinion/legacy-systems-agile-microservices"
    },
    {
      id: 4,
      title: "Spurring innovation in a digital age requires bold corporate culture",
      description: "Companies that encourage experimental sandboxing outpace competitors in discovering disruptive tech features.",
      author: "Shon Higgs",
      date: "July 26, 2026",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&h=350&fit=crop",
      href: "/opinion/spurring-innovation-digital-age"
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-6 bg-[#BF1E2D]" />
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
          Opinion
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {opinionArticles.map((article) => (
          <article key={article.id} className="flex flex-col group cursor-pointer">
            <Link
              href={article.href}
              className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-sm mb-3 block"
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
    </section>
  );
}
