"use client";

import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="w-full bg-zinc-950 text-white py-12 md:py-16 px-4 md:px-8 my-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column Text (~60%) */}
        <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6">
          <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-[1.2] mb-4 text-white font-serif">
            The journal of record for technology decisions in Canada
          </h2>

          <p className="text-[14px] md:text-[15px] text-zinc-300 leading-relaxed mb-6 font-sans">
            Digital Journal serves Canadian leaders responsible for what technology delivers across their organizations. Their decisions touch every function and every board conversation about where the organization is going.
          </p>

          <Link
            href="/journal-of-record"
            className="bg-[#BF1E2D] hover:bg-red-700 text-white text-[12px] font-bold uppercase px-6 py-3 tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer rounded-sm"
          >
            Read More &rarr;
          </Link>
        </div>

        {/* Right Column Image (~40%) */}
        <div className="lg:col-span-5 w-full h-[260px] md:h-[320px] overflow-hidden bg-zinc-900 rounded-none relative border border-zinc-800">
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
