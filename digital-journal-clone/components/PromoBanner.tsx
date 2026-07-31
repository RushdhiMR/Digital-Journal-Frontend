"use client";

import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="w-full bg-zinc-950 text-white py-10 md:py-12 px-6 md:px-12 lg:px-16 my-6">
      <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
        
        {/* Left Column Text (~60% width) */}
        <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6 justify-center">
          <h2 className="text-xl md:text-2xl lg:text-[26px] font-bold leading-[1.25] mb-3 text-white font-serif">
            The journal of record for technology decisions in Canada
          </h2>

          <p className="text-[13px] md:text-[13.5px] text-zinc-300 leading-relaxed mb-5 font-sans">
            Digital Journal serves Canadian leaders responsible for what technology delivers across their organizations. Their decisions touch every function and every board conversation about where the organization is going.
          </p>

          <Link
            href="/journal-of-record"
            className="bg-[#BF1E2D] hover:bg-red-700 text-white text-[11px] font-bold uppercase px-5 py-2.5 tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer rounded-sm"
          >
            Read More &rarr;
          </Link>
        </div>

        {/* Right Column Image (~40% width, reduced height) */}
        <div className="lg:col-span-5 w-full h-[190px] sm:h-[210px] md:h-[240px] overflow-hidden bg-zinc-900 rounded-none relative border border-zinc-800 self-center">
          <img
            src="/ai_studio_booth.png"
            alt="Digital Journal Studio Booth"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&h=600&fit=crop";
            }}
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}
