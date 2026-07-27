"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.1fr] gap-8 items-center">
        {/* Main Hero Image Clickable Link */}
        <Link
          href="/business/companies/what-tools-business-should-take-from-a-massive-security-breach-to-prevent-future-attacks"
          className="relative w-full aspect-[16/10] sm:aspect-video lg:h-[480px] overflow-hidden bg-gray-100 rounded-lg block group"
        >
          <img
            src="/ai_hero.png"
            alt="Security breach and high tech digital infrastructure"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200&h=800&fit=crop"; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {/* Hero Content Card */}
        <div className="flex flex-col justify-center">
          <div className="flex gap-2 mb-3">
            <span className="bg-[#FAF0E6] text-[#CC6633] text-[10px] font-bold uppercase px-2.5 py-1 tracking-wider">
              Business
            </span>
            <span className="bg-[#E6F2F5] text-[#165C61] text-[10px] font-bold uppercase px-2.5 py-1 tracking-wider">
              Security
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-[1.12] mb-4 text-black font-serif">
            <Link
              href="/business/companies/what-tools-business-should-take-from-a-massive-security-breach-to-prevent-future-attacks"
              className="hover:text-[#BF1E2D] transition-colors"
            >
              What tools business should take from a massive security breach to prevent future attacks
            </Link>
          </h1>
          <p className="text-[14.5px] lg:text-[15.5px] text-gray-700 leading-relaxed mb-6 font-sans">
            A massive security breach has exposed vulnerable systems. Experts suggest key tools businesses should implement to prevent future data theft and secure infrastructure.
          </p>
          <p className="text-[11.5px] text-gray-400 font-medium">
            By <Link href="/author/john-doe" className="text-black font-semibold hover:text-[#BF1E2D] hover:underline cursor-pointer transition-colors">John Doe</Link> • July 13, 2026
          </p>
        </div>
      </div>
    </section>
  );
}
