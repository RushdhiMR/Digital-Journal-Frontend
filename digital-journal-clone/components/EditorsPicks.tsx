import Link from 'next/link';

export default function EditorsPicks() {
  const editorsPicks = [
    {
      title: "Review: Has AI been chasing the wrong dream since Alan Turing?",
      description: "The essential question, then, is not whether machines can imitate people. Turing asked a brilliant question for the early age of computing. Denning asks a different question for the age of generative AI.",
      author: "Dr. Tim Sandle",
      date: "July 19, 2026 5:29 PM EDT",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop"
    },
    {
      title: "Silicon chips learn to write DNA: Research points to cleaner route for synthetic biology",
      description: "The Harvard chip is an early-stage demonstration rather than an industrial replacement for current DNA synthesis platforms. Nevertheless, the work establishes a new benchmark for parallel enzymatic DNA synthesis.",
      author: "Dr. Tim Sandle",
      date: "July 19, 2026 5:23 PM EDT",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop"
    },
    {
      title: "Canada's soft robotics research is moving from laboratory novelty to business tool",
      description: "Canada's advantage lies in combining engineering research, AI strength, materials science, medical technology and strong university-industry pathways. The challenge will be scale-up: moving devices from prototypes and laboratory demonstrations to manufacturable, validated, regulated and commercially supported products.",
      author: "Dr. Tim Sandle",
      date: "July 19, 2026 2:47 PM EDT",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop"
    },
    {
      title: "Pocket-size AI: Powerful phones star at China show",
      description: "Wide adoption of phones running on so-called AI agents would be a revolution, but would also take control away from major apps, which aren't always happy about it.",
      author: "AFP",
      date: "July 19, 2026",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=300&fit=crop"
    }
  ];

  const sidebarPicks = [
    {
      title: "Canadian mathematician honoured for reshaping how the world moves resources and data",
      date: "July 18, 2026",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=120&h=120&fit=crop",
      href: "/news/world/argentina-edge-switzerland-in-extra-time-to-set-up-world-cup-semi-final-clash-with-england"
    },
    {
      title: "Space data centres: Can orbiting AI infrastructure solve Earth's computing crisis?",
      date: "July 17, 2026",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&h=120&fit=crop",
      href: "/news/markets/us-stocks-end-higher-as-sk-hynixs-wall-street-debut-and-metas-ai-momentum-lift-markets"
    },
    {
      title: "China's Kimi K3 rattles US AI industry",
      date: "July 17, 2026",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop",
      href: "/news/politics/trumps-hormuz-retreat-highlights-struggles-to-end-iran-conflict"
    },
    {
      title: "Startups bet on AI, and a leaner future",
      date: "July 17, 2026",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&h=120&fit=crop",
      href: "/business/companies/new-exclusive-decoration-design-fit-out-llc-structural-acrylic-pioneers-in-the-uae"
    },
    {
      title: "What Alberta found when it pointed 50 agents at its own code",
      date: "July 16, 2026",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=120&h=120&fit=crop",
      href: "/business/corporate-news/ice-suspends-most-vehicle-stops-after-fatal-shootings-in-texas-and-maine"
    }
  ];

  return (
    <section className="font-standard-sans max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      {/* Heading Block */}
      <div className="mb-6">
        <div className="inline-block bg-[#FFF5C6] px-2 py-0.5 mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-black">
            Editor&apos;s picks
          </h2>
        </div>
        <p className="text-[14px] text-gray-800 font-medium font-standard-sans mt-1">
          What we&apos;d read if we only had 10 minutes
        </p>
        {/* Separator Accent Line */}
        <div className="relative w-full border-t border-gray-200 mt-3">
          <div className="absolute top-0 left-0 w-16 h-[3px] bg-black -translate-y-[2px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Grid: 2x2 featured articles */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {editorsPicks.map((article, index) => (
            <article key={index} className="flex flex-col cursor-pointer group">
              <div className="relative w-full aspect-video overflow-hidden mb-3 bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                />
              </div>
              <h3 className="text-[16px] font-bold leading-snug text-black group-hover:text-[#CC3333] transition-colors mb-2">
                {article.title}
              </h3>
              <p className="text-[13px] text-zinc-700 leading-relaxed mb-3">
                {article.description}
              </p>
              <p className="text-[11px] text-zinc-500 font-normal">
                By <Link href={`/author/${article.author.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="underline hover:text-[#CC3333] cursor-pointer">{article.author}</Link> {article.date}
              </p>
            </article>
          ))}
        </div>

        {/* Right Sidebar Stack */}
        <div className="space-y-6">
          {sidebarPicks.map((article, index) => (
            <Link key={index} href={article.href} className="flex gap-4 items-start cursor-pointer group">
              <div className="relative w-[75px] h-[75px] flex-shrink-0 overflow-hidden bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[13px] font-bold leading-tight text-black group-hover:text-[#CC3333] transition-colors mb-1.5">
                  {article.title}
                </h4>
                <p className="text-[11px] text-zinc-400 font-normal">{article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
