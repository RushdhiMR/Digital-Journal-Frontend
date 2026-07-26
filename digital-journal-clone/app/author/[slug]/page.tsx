import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const authorsDatabase: Record<string, {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}> = {
  "april-hicke": {
    name: "April Hicke",
    role: "TECH ANALYST",
    avatar: "/author_glasses.jpg",
    bio: "April Hicke reports on biotechnology, scientific research, open science initiatives, and artificial intelligence adoption across enterprise ecosystems."
  },
  "ronda-b": {
    name: "Ronda B",
    role: "WRITER",
    avatar: "/author_woman.jpg",
    bio: "A dedicated journalist with a passion for delivering accurate, timely, and impactful news. Committed to ethical reporting and in-depth storytelling, she covers a wide range of topics with professionalism, integrity, and a focus on informing audiences through credible journalism."
  },
  "jennifer-friesen": {
    name: "Jennifer Friesen",
    role: "ASSOCIATE EDITOR",
    avatar: "/author_woman.jpg",
    bio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead. Committed to ethical reporting and in-depth storytelling across energy, technology, and policy."
  },
  "pramod-jain": {
    name: "Pramod Jain",
    role: "SENIOR REPORTER",
    avatar: "/author_bluesuit.jpg",
    bio: "Pramod Jain reports on global supply chains, logistics telemetry, enterprise cloud migrations, and emerging technology markets."
  },
  "chris-hogg": {
    name: "Chris Hogg",
    role: "EXECUTIVE EDITOR",
    avatar: "/author_beard.jpg",
    bio: "Chris Hogg is an executive editor specializing in digital transformation, financial technology, and executive leadership strategies."
  },
  "dr-andrew-forde": {
    name: "Dr. Andrew Forde",
    role: "CHIEF COLUMNIST",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop",
    bio: "Dr. Andrew Forde writes on technological convergence, machine intelligence, and structural policy frameworks."
  },
  "david-potter": {
    name: "David Potter",
    role: "SENIOR COLUMNIST",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&h=250&fit=crop",
    bio: "David Potter focuses on software architecture, DevOps tooling, developer metrics, and infrastructure security."
  },
  "jennifer-lussier": {
    name: "Jennifer Lussier",
    role: "CONTRIBUTING EDITOR",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&fit=crop",
    bio: "Jennifer Lussier covers Canadian innovation ecosystems, youth employment initiatives, and venture capital allocations."
  },
  "dr-tim-sandle": {
    name: "Dr. Tim Sandle",
    role: "SENIOR EDITOR",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&fit=crop",
    bio: "Dr. Tim Sandle is a London-based science journalist covering biotechnology, microbiology, AI in healthcare, and digital transformation."
  },
  "frank-morgan": {
    name: "Frank Morgan",
    role: "POLITICAL CORRESPONDENT",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop",
    bio: "Frank Morgan is Digital Journal's senior political correspondent covering transatlantic diplomacy, legislative policy, and international affairs."
  },
  "sarah-miller": {
    name: "Sarah Miller",
    role: "REGULATORY CORRESPONDENT",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop",
    bio: "Sarah Miller covers international data privacy regulations, cross-border compliance, and digital rights."
  },
  "david-chen": {
    name: "David Chen",
    role: "TECH CORRESPONDENT",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop",
    bio: "David Chen covers open-source software, cloud infrastructure, and quantum computing preview clusters."
  },
  "lisa-chen": {
    name: "Lisa Chen",
    role: "DATA INFRASTRUCTURE REPORTER",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&fit=crop",
    bio: "Lisa Chen covers next-generation data routing, enterprise AI balance nodes, and telecommunications."
  }
};

export async function generateStaticParams() {
  return [
    { slug: "april-hicke" },
    { slug: "ronda-b" },
    { slug: "jennifer-friesen" },
    { slug: "pramod-jain" },
    { slug: "chris-hogg" },
    { slug: "dr-andrew-forde" },
    { slug: "david-potter" },
    { slug: "jennifer-lussier" },
    { slug: "dr-tim-sandle" },
    { slug: "frank-morgan" },
    { slug: "sarah-miller" },
    { slug: "david-chen" },
    { slug: "lisa-chen" }
  ];
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;
  
  const rawName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const defaultAvatar = slug.includes('hicke') ? "/author_glasses.jpg"
                      : slug.includes('jain') ? "/author_bluesuit.jpg"
                      : slug.includes('hogg') ? "/author_beard.jpg"
                      : slug.includes('friesen') || slug.includes('ronda') || slug.includes('lussier') ? "/author_woman.jpg"
                      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop";

  const author = authorsDatabase[slug] || {
    name: rawName,
    role: "STAFF WRITER",
    avatar: defaultAvatar,
    bio: `${rawName} is a dedicated journalist for Digital Journal covering breaking news, enterprise technology, policy developments, and market trends.`
  };

  const authorArticles = [
    {
      category: "POLITICS",
      href: "/news/politics/trump-declares-iran-ceasefire-over-raising-questions-about-the-next-phase-of-the-conflict",
      title: "Trump Declares Iran Ceasefire 'Over,' Raising Questions About the Next Phase of the Conflict",
      desc: "The fragile ceasefire between the United States and Iran appears to have entered a new and uncertain stage after President Donald Trump declared that the truce has effectively ended. While...",
      date: `BY ${author.name.toUpperCase()} • JUL 19, 2026`,
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=350&fit=crop"
    },
    {
      category: "BUSINESS",
      href: "/news/markets/us-stocks-end-higher-as-sk-hynixs-wall-street-debut-and-metas-ai-momentum-lift-markets",
      title: "U.S. Stocks End Higher as SK Hynix's Wall Street Debut and Meta's AI Momentum Lift Markets",
      desc: "U.S. stock markets closed higher on Friday as investors responded positively to SK Hynix's debut on U.S. exchanges and continued optimism surrounding artificial intelligence investments. The S&P...",
      date: `BY ${author.name.toUpperCase()} • JUL 18, 2026`,
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=350&fit=crop"
    },
    {
      category: "BUSINESS",
      href: "/business/companies/new-exclusive-decoration-design-fit-out-llc-structural-acrylic-pioneers-in-the-uae",
      title: "New Exclusive Decoration Design & Fit Out LLC – Structural Acrylic Pioneers in the UAE",
      desc: "Dubai, UAE – New Exclusive Decoration Design & Fit Out LLC, recognized as New Exclusive Structural Acrylic Pioneers, is redefining the future of luxury pool design and architectural transparency...",
      date: `BY ${author.name.toUpperCase()} • JUL 15, 2026`,
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&h=350&fit=crop"
    },
    {
      category: "SPORTS",
      href: "/news/world/argentina-edge-switzerland-in-extra-time-to-set-up-world-cup-semi-final-clash-with-england",
      title: "Argentina Edge Switzerland in Extra Time to Set Up World Cup Semi-Final Clash With England",
      desc: "After defeating Switzerland 3-1 following extra time in an intense quarter-final that featured controversy, drama, and a stunning winning goal from Julián Álvarez. The reigning world champions will...",
      date: `BY ${author.name.toUpperCase()} • JUL 12, 2026`,
      image: "/argentina_vs_switzerland.png"
    },
    {
      category: "POLITICS",
      href: "/news/politics/trumps-hormuz-retreat-highlights-struggles-to-end-iran-conflict",
      title: "Trump's Hormuz Retreat Highlights Struggles to End Iran Conflict",
      desc: "On Monday, Trump announced that all vessels using the strategically important waterway would be required to pay a 20% fee, arguing that the charge would help cover the costs of maintaining...",
      date: `BY ${author.name.toUpperCase()} • JUL 15, 2026`,
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=350&fit=crop"
    },
    {
      category: "BUSINESS",
      href: "/business/corporate-news/ice-suspends-most-vehicle-stops-after-fatal-shootings-in-texas-and-maine",
      title: "ICE Suspends Most Vehicle Stops After Fatal Shootings in Texas and Maine",
      desc: "According to US media reports citing law enforcement sources, the suspension takes effect immediately and applies to most routine vehicle stops. Exceptions will be made for cases involving serious...",
      date: `BY ${author.name.toUpperCase()} • JUL 15, 2026`,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=350&fit=crop"
    },
    {
      category: "HEALTH",
      href: "/industry-insights/health/us-explosive-diarrhoea-outbreak-remains-unsolved-as-cases-near-7000",
      title: "US \"Explosive Diarrhoea\" Outbreak Remains Unsolved as Cases Near 7,000",
      desc: "The outbreak has now spread to 34 states, with nearly 7,000 confirmed cases, according to the US Centers for Disease Control and Prevention (CDC). While the illness is rarely fatal, it can cause...",
      date: `BY ${author.name.toUpperCase()} • JUL 15, 2026`,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=350&fit=crop"
    },
    {
      category: "CRYPTO",
      href: "/news/markets/crypto-news-today-july-15-bitcoin-reclaims-65000-jpmorgan-warns-of-hyperliquid-risks",
      title: "Crypto News Today (July 15): Bitcoin Reclaims $65,000, JPMorgan Warns of Hyperliquid Risks",
      desc: "Bitcoin staged a strong recovery on July 15, rising more than 3.5% in the past 24 hours and reclaiming the $65,000 level. The rally was supported by renewed institutional demand, with $181 million...",
      date: `BY ${author.name.toUpperCase()} • JUL 15, 2026`,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=350&fit=crop"
    },
    {
      category: "BUSINESS",
      href: "/news/markets/crypto-market-overview-bitcoin-stabilizes-zcash-targets-new-highs",
      title: "Crypto Market Overview: Bitcoin Stabilizes, Zcash Targets New Highs, Pump.fun Extends Recovery",
      desc: "While Bitcoin remains the market's primary focus, Zcash (ZEC) and Pump.fun (PUMP) emerged as some of the strongest-performing cryptocurrencies over the past 24 hours. Bitcoin Tests Key Resistance...",
      date: `BY ${author.name.toUpperCase()} • JUL 15, 2026`,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=350&fit=crop"
    }
  ];

  const mostReadSidebar = [
    { rank: 1, href: "/business/companies/new-exclusive-decoration-design-fit-out-llc-structural-acrylic-pioneers-in-the-uae", title: "New Exclusive Decoration Design & Fit Out LLC – Structural Acrylic Pioneers in the UAE", views: "50 views" },
    { rank: 2, href: "/news/politics/trump-declares-iran-ceasefire-over-raising-questions-about-the-next-phase-of-the-conflict", title: "Trump Declares Iran Ceasefire 'Over,' Raising Questions About the Next Phase of the Conflict", views: "38 views" },
    { rank: 3, href: "/news/politics/trumps-hormuz-retreat-highlights-struggles-to-end-iran-conflict", title: "Trump's Hormuz Retreat Highlights Struggles to End Iran Conflict", views: "24 views" },
    { rank: 4, href: "/news/markets/crypto-market-overview-bitcoin-stabilizes-zcash-targets-new-highs", title: "Crypto Market Overview: Bitcoin Stabilizes, Zcash Targets New Highs, Pump.fun Extends Recovery", views: "8 views" },
    { rank: 5, href: "/news/markets/us-stocks-end-higher-as-sk-hynixs-wall-street-debut-and-metas-ai-momentum-lift-markets", title: "U.S. Stocks End Higher as SK Hynix's Wall Street Debut and Meta's AI Momentum Lift Markets", views: "3 views" }
  ];

  return (
    <main className="min-h-screen bg-white font-standard-sans">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        
        {/* Author Bio Header Card (Matching Image 1) */}
        <div className="flex flex-col sm:flex-row items-start gap-6 pb-8 mb-8 border-b border-zinc-200">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-zinc-300">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col">
            <h1 className="font-serif text-[32px] font-bold text-black leading-none mb-1">
              {author.name}
            </h1>
            <span className="text-[10.5px] font-bold text-[#BF1E2D] uppercase tracking-wider mb-3">
              {author.role}
            </span>
            <p className="text-[13.5px] text-zinc-600 leading-relaxed max-w-3xl">
              {author.bio}
            </p>
          </div>
        </div>

        {/* Section Title: MORE FROM [AUTHOR] */}
        <div className="border-b-2 border-black pb-2 mb-8">
          <h2 className="text-[14px] font-bold text-black uppercase tracking-wider">
            MORE FROM {author.name.toUpperCase()}
          </h2>
        </div>

        {/* 8 Cols / 4 Cols Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Author Articles List */}
          <div className="lg:col-span-8 space-y-8">
            {authorArticles.map((article, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-5 pb-8 border-b border-zinc-100 last:border-none group cursor-pointer">
                {/* Thumbnail Image */}
                <Link href={article.href} className="relative w-full sm:w-[210px] h-[135px] flex-shrink-0 overflow-hidden bg-gray-100 rounded-sm border border-zinc-200 block">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Article Info */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#1D9BF0] uppercase tracking-wider mb-1">
                    {article.category}
                  </span>
                  <Link href={article.href} className="font-serif text-[18px] md:text-[20px] font-bold leading-snug text-black group-hover:text-[#BF1E2D] transition-colors mb-2">
                    {article.title}
                  </Link>
                  <p className="text-[13px] text-zinc-600 leading-relaxed font-sans line-clamp-2 mb-3">
                    {article.desc}
                  </p>
                  <span className="text-[10.5px] text-zinc-400 font-bold tracking-wide font-sans">
                    {article.date}
                  </span>
                </div>
              </div>
            ))}

            {/* Pagination Controls (Matching Image 1) */}
            <div className="flex items-center justify-center gap-2 pt-6 font-sans text-[12px]">
              <button className="px-4 py-2 border border-zinc-200 text-zinc-400 font-bold cursor-not-allowed bg-zinc-50">
                PREV
              </button>
              <button className="w-9 h-9 border border-[#BF1E2D] bg-[#BF1E2D] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-9 h-9 border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-100 flex items-center justify-center">
                2
              </button>
              <button className="px-4 py-2 border border-zinc-200 text-zinc-800 font-bold hover:bg-zinc-100 cursor-pointer">
                NEXT
              </button>
            </div>
          </div>

          {/* Right Column: Sidebar (MOST READ + Ad Banner matching Image 1) */}
          <div className="lg:col-span-4 lg:pl-2 space-y-8">
            
            {/* MOST READ Card Widget */}
            <div className="border border-zinc-200 rounded p-6 bg-white shadow-xs">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-zinc-200">
                <span className="text-[#1D9BF0]">📈</span>
                <h3 className="text-[14px] font-bold text-black uppercase tracking-wider">
                  MOST READ
                </h3>
              </div>

              <div className="space-y-4">
                {mostReadSidebar.map((item) => (
                  <div key={item.rank} className="flex gap-3 items-start border-b border-zinc-100 pb-3 last:border-none group cursor-pointer">
                    <span className="text-[20px] font-serif font-bold text-zinc-300 group-hover:text-[#BF1E2D] leading-none pt-0.5">
                      {item.rank}
                    </span>
                    <div className="flex flex-col">
                      <Link href={item.href} className="font-serif text-[12.5px] font-bold text-black leading-snug hover:text-[#BF1E2D] transition-colors mb-1 block">
                        {item.title}
                      </Link>
                      <span className="text-[10px] text-zinc-400 font-sans">{item.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsored Editorial Ad Card (Matching Image 1 Louis Vuitton Banner) */}
            <div className="relative w-full aspect-[4/3] bg-zinc-900 rounded overflow-hidden shadow-md flex items-end p-6 cursor-pointer group">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=450&fit=crop"
                alt="Luxury Fashion Editorial"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div className="relative z-10 text-white font-serif">
                <p className="text-[22px] font-bold tracking-[2px] uppercase leading-tight mb-1">
                  LOUIS VUITTON
                </p>
                <p className="text-[10px] uppercase tracking-[1px] text-zinc-300 font-sans">
                  Le Monogram, Transcending Generations Since 1896
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
