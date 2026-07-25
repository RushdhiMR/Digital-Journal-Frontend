export default function TechnologyGrid() {
  const technologyArticles = [
    {
      title: "Silicon Valley chip manufacturers announce breakthrough architectural updates",
      image: "https://images.unsplash.com/photo-1601524909162-be87252be298?w=350&h=220&fit=crop",
      description: "New nanometer transistor architectures are set to double computing speeds while reducing power requirements..."
    },
    {
      title: "New quantum computing clusters open to public cloud developer preview",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=350&h=220&fit=crop",
      description: "Developers can now run quantum algorithms directly on secure cloud nodes powered by next-gen cooling systems..."
    },
    {
      title: "Open-source database platform raises record funding round for scaling",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=350&h=220&fit=crop",
      description: "The open-source ecosystem gains support with a massive funding round targeted at global replication modules..."
    },
    {
      title: "How edge computing is transforming real-time telemetry processing",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=350&h=220&fit=crop",
      description: "Processing data closer to the source decreases latency and allows immediate feedback in remote sensor arrays..."
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 border-t border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black uppercase">
          <span className="bg-[#FFE9D6] text-black px-2 py-0.5">Technology</span>
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">
          LATEST NEWS IN CHIPS, INFRASTRUCTURE AND SYSTEM DEVELOPMENTS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technologyArticles.map((article, index) => (
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
