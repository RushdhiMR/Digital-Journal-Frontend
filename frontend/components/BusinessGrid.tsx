"use client";

import Link from "next/link";

export default function BusinessGrid() {
  const bottomItems = [
    {
      id: 1,
      title: "Hong Kong activist allowed to stay in UK after deportation threat",
      description: "Wu was detained for hours at London's Heathrow Airport last week and refused entry, he told the BBC.",
      time: "15 mins ago | Asia",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&h=260&fit=crop",
      href: "/business/hong-kong-activist-uk-stay"
    },
    {
      id: 2,
      title: "Chip stocks slide in US and Asia as AI jitters rattle investors",
      description: "Trading on South Korea's Kospi index was paused temporarily on Tuesday morning after slumping by 8%.",
      time: "Just now",
      image: "/ai_chip.png",
      href: "/business/chip-stocks-slide-us-asia"
    },
    {
      id: 3,
      title: "'I just found all the classified stuff downstairs' - Biden to ghostwriter",
      description: "Recordings between Biden and his ghostwriter reveal references to classified information and memory gaps.",
      time: "2 hrs ago | US & Canada",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=260&fit=crop",
      href: "/business/biden-ghostwriter-classified-documents"
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 border-b border-gray-200 font-sans">
      {/* Red Bar Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-6 bg-[#D31220]" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Business
        </h2>
      </div>

      {/* TOP ROW: Text Story (Left) + Large Image (Center) + Video Story (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10 pb-8 border-b border-gray-100">
        
        {/* Left Column Text Story (~28%) */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          <h3 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 hover:text-[#D31220] transition-colors mb-3 font-serif">
            <Link href="/business/assam-worst-floods-in-years">
              &apos;It took everything from us&apos;: India&apos;s Assam faces worst floods in years
            </Link>
          </h3>
          <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
            While flooding happens in Assam every year, a state minister described this year as the worst in six decades.
          </p>
          <span className="text-[11px] text-gray-400 font-medium">
            7 hrs ago | Asia
          </span>
        </div>

        {/* Center Column Large Flood Image (~64%) */}
        <div className="lg:col-span-6 w-full">
          <Link href="/business/assam-worst-floods-in-years" className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 rounded-none block group">
            <img
              src="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1000&h=625&fit=crop"
              alt="Assam floodwaters rescue"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Right Column Secondary Video Story (~28%) */}
        <div className="lg:col-span-3 flex flex-col">
          <Link href="/business/china-fake-ai-videos-disasters" className="relative w-full aspect-[16/10] overflow-hidden bg-gray-900 rounded-none mb-3 block group">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=375&fit=crop"
              alt="China broadcast video stage"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            />
          </Link>
          <h4 className="text-[14px] font-bold leading-snug text-gray-900 hover:text-[#D31220] transition-colors mb-2">
            <Link href="/business/china-fake-ai-videos-disasters">
              China&apos;s new challenge as natural disasters strike - fake AI videos
            </Link>
          </h4>
          <p className="text-[12px] text-gray-600 leading-normal mb-2 line-clamp-3">
            Storms and flooding incidents over the last few months have seen fake videos inundating social media.
          </p>
          <span className="text-[11px] text-gray-400 font-medium">
            7 hrs ago | Asia
          </span>
        </div>

      </div>

      {/* BOTTOM ROW: 3 Cards + Ad Box (4 Equal Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bottomItems.map((item) => (
          <article key={item.id} className="flex flex-col group cursor-pointer">
            <Link href={item.href} className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 rounded-none mb-3 block">
              <img
                src={item.image}
                alt={item.title}
                onError={(e) => { e.currentTarget.src = "/ai_chip.png"; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <h4 className="text-[13.5px] font-bold leading-snug text-gray-900 group-hover:text-[#D31220] transition-colors mb-1.5 font-serif line-clamp-2">
              <Link href={item.href}>
                {item.title}
              </Link>
            </h4>

            <p className="text-[12px] text-gray-600 leading-relaxed mb-2 line-clamp-3">
              {item.description}
            </p>

            <span className="text-[10.5px] text-gray-400 font-medium mt-auto">
              {item.time}
            </span>
          </article>
        ))}

        {/* Column 4: Black Ad Box */}
        <div className="w-full h-[230px] bg-black text-white rounded-none flex items-center justify-center">
          <span className="text-sm font-mono tracking-widest text-gray-400">Ad</span>
        </div>
      </div>

    </section>
  );
}
