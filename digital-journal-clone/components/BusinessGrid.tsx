export default function BusinessGrid() {
  const businessArticles = [
    {
      title: "Canada's Conexiom bets that the future of AI lies in automation, not experimentation",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=350&h=220&fit=crop",
      description: "Conexiom's CEO discusses how automating key transactional data is the key to enterprise growth..."
    },
    {
      title: "Canada's AI adoption problem meets its youth employment problem",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=350&h=220&fit=crop",
      description: "A new study outlines how integrating AI training into entry-level roles could solve both problems..."
    },
    {
      title: "Op-Ed: Rethinking humanity as automation rewrites human realities",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=350&h=220&fit=crop",
      description: "Automation is not just about replacing jobs; it's about redefining what it means to be human..."
    },
    {
      title: "Lightworks, Scotiabank, Sun Life and TELUS launch AI Consortium",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=350&h=220&fit=crop",
      description: "Major financial and telecom leaders collaborate to invest in and govern ethical AI models..."
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 font-standard-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black uppercase">
          <span className="bg-[#FFE9D6] text-black px-2 py-0.5">Business</span>
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">
          DISCOVER THE LATEST TRENDS IN COMPANIES, CORPORATE STRUCTURES AND STARTUPS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {businessArticles.map((article, index) => (
          <article key={index} className="flex flex-col cursor-pointer group">
            <div className="relative w-full aspect-[4/3] overflow-hidden mb-3 bg-gray-100">
              <img
                src={article.image}
                alt={article.title}
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
