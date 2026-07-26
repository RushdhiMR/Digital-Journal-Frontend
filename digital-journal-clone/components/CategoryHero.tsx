import Link from "next/link";

interface CategoryHeroProps {
  categoryName: string;
  categoryColor: string; // Tailwind class, e.g. "bg-[#BEEDF7]" or "bg-[#FFE9D6]"
  articleTitle: string;
  articleDescription: string;
  articleImage: string;
  articleAuthor: string;
  articleDate: string;
}

export default function CategoryHero({
  categoryName,
  categoryColor,
  articleTitle,
  articleDescription,
  articleImage,
  articleAuthor,
  articleDate
}: CategoryHeroProps) {
  const authorSlug = articleAuthor.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      {/* Category Header Title */}
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-extrabold text-black uppercase">
          <span className={`${categoryColor} text-black px-3 py-1`}>{categoryName}</span>
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-wider">
          Explore news, columns, analysis, and expert reviews in {categoryName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Featured Image */}
        <div className="lg:col-span-2 relative w-full h-[400px] lg:h-[480px] overflow-hidden bg-gray-100">
          <img
            src={articleImage}
            alt={articleTitle}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Article Details Card */}
        <div className="flex flex-col justify-center h-full">
          <span className="text-[#CC6633] text-xs font-bold uppercase tracking-wider mb-2.5 block">
            Featured Story
          </span>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4 text-black hover:text-red-600 transition-colors cursor-pointer">
            {articleTitle}
          </h1>
          <p className="text-[13.5px] text-gray-700 leading-relaxed mb-5">
            {articleDescription}
          </p>
          <p className="text-[11px] text-gray-400">
            By <Link href={`/author/${authorSlug}`} className="text-black font-semibold hover:text-[#BF1E2D] hover:underline cursor-pointer transition-colors">{articleAuthor}</Link> • {articleDate}
          </p>
        </div>
      </div>
    </section>
  );
}
