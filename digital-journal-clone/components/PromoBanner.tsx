"use client";

import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="w-full bg-black text-white py-12 md:py-16 px-4 md:px-8 my-8 font-standard-sans">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left Column Text */}
        <div className="flex flex-col items-start max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold leading-[1.15] mb-5 text-white tracking-tight">
            The journal of record for technology decisions in Canada
          </h2>

          <div className="space-y-4 text-zinc-300 text-[13.5px] md:text-[14.5px] leading-relaxed mb-6 font-sans">
            <p>
              Digital Journal serves Canadian leaders responsible for what technology delivers across their organizations. Their decisions touch every function and every board conversation about where the organization is going.
            </p>
            <p>
              They work alongside CEOs navigating transformation, CFOs weighing investment, COOs driving execution, and boards setting expectations.
            </p>
            <p>
              We&apos;ve been connecting that entire conversation since 1998.
            </p>
          </div>

          <Link
            href="/journal-of-record"
            className="bg-[#BF1E2D] hover:bg-red-700 text-white text-[12px] font-bold px-6 py-3 tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer font-sans"
          >
            Learn more &rarr;
          </Link>
        </div>

        {/* Right Column Image */}
        <div className="w-full h-[320px] md:h-[400px] overflow-hidden bg-zinc-900 rounded-sm">
          <img
            src="/ai_studio_booth.png"
            alt="Digital Journal Studio Booth"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop";
            }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
