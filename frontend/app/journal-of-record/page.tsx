"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function JournalOfRecordPage() {
  return (
    <main className="min-h-screen bg-white font-standard-sans">
      <Header />

      {/* SECTION 1: HERO BANNER WITH STUDIO BOOTH BACKGROUND */}
      <section className="relative w-full min-h-[520px] md:min-h-[620px] flex items-center justify-center text-white py-20 px-4 md:px-8 overflow-hidden bg-black">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/ai_studio_booth.png"
            alt="London BigBen Studio"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop";
            }}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/70" />
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto flex flex-col items-start">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] text-white tracking-tight mb-6 max-w-4xl">
            The journal of record for technology decisions in Canada
          </h1>
          <p className="text-zinc-200 text-base md:text-[18px] leading-relaxed max-w-3xl font-sans">
            We cover innovation, technology, and business leadership for the leaders who own technology decisions and everyone around them who needs to understand what those decisions mean.
          </p>
        </div>
      </section>

      {/* SECTION 2: WHITE SECTION WITH RED MAPLE LEAF & STATS GRID */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white text-black">
        <div className="max-w-[1400px] mx-auto">
          {/* Red Maple Leaf */}
          <div className="text-[#BF1E2D] text-3xl mb-4 font-bold select-none">
            🍁
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold text-[#BF1E2D] mb-6 tracking-tight">
            A publication for how leaders think about technology
          </h2>

          <p className="text-zinc-800 text-[14px] md:text-[15.5px] leading-relaxed max-w-4xl font-sans mb-16">
            London BigBen serves Canadian leaders responsible for what technology platforms mean for their organization. Find out what decisions touch every function and board conversation about where the organization is going. They work alongside CEOs navigating transformation, CFOs weighing investment, COOs driving execution, and boards setting expectations. London BigBen connects that entire conversation.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Stats Grid Left */}
            <div className="flex flex-col justify-between h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-1">
                    1.5 million
                  </h3>
                  <p className="text-[12.5px] text-zinc-600 font-sans leading-snug">
                    Monthly average readers across web &amp; social networks
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-1">
                    150K+ followers
                  </h3>
                  <p className="text-[12.5px] text-zinc-600 font-sans leading-snug">
                    Engaged executive and senior decision maker audience
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-1">
                    8x more likely to be senior
                  </h3>
                  <p className="text-[12.5px] text-zinc-600 font-sans leading-snug">
                    Audience index vs general tech news &amp; business media
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-1">
                    Official media partner
                  </h3>
                  <p className="text-[12.5px] text-zinc-600 font-sans leading-snug">
                    Selected partner for leading tech summits and conferences
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/newsletters"
                  className="bg-[#BF1E2D] hover:bg-red-700 text-white font-bold text-[12px] uppercase tracking-wider px-8 py-3.5 transition-colors inline-block font-sans"
                >
                  JOIN US
                </Link>
              </div>
            </div>

            {/* Auditorium Photo Right */}
            <div className="w-full h-[320px] md:h-[420px] overflow-hidden rounded-sm bg-zinc-100">
              <img
                src="/ai_auditorium.png"
                alt="Tech summit audience"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop";
                }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BLACK SECTION WITH RED DOWN ARROW & SILOS CONTENT */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-black text-white">
        <div className="max-w-[1400px] mx-auto">
          {/* Centered Red Down Arrow */}
          <div className="text-[#BF1E2D] text-3xl font-bold text-center mb-6">
            &#x25BC;
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-center text-white mb-20 max-w-3xl mx-auto tracking-tight leading-tight">
            Canada&apos;s best work happens in silos, and that&apos;s a problem
          </h2>

          {/* Alternating Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div className="w-full h-[340px] md:h-[420px] overflow-hidden rounded-sm bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop"
                alt="Executive discussion"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-5 text-zinc-300 text-[14px] md:text-[15px] leading-relaxed font-sans">
              <p>
                The technology narrative in Canada is rich with talent, innovation, and ambition. But for too long, that narrative has been fragmented across regional hubs and isolated sectors.
              </p>
              <p>
                The market has changed. Technology decisions touch every function and every board conversation about where the organization is going.
              </p>
              <p>
                The challenge is that these conversations happen in isolation &mdash; without a national platform to bridge the gap between technical builders and executive decision-makers.
              </p>
              <p>
                London BigBen connects these conversations into a unified national discourse, giving leaders the context they need to make informed technology decisions.
              </p>
            </div>
          </div>

          {/* Alternating Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <div className="space-y-5 text-zinc-300 text-[14px] md:text-[15px] leading-relaxed font-sans order-2 lg:order-1">
              <p>
                An ecosystem in silos limits momentum. Leaders who can&apos;t see beyond their own sector miss opportunities to scale, innovate, and lead in the global innovation economy.
              </p>
              <p>
                From AI to quantum, energy to health, Canadian innovators are building solutions that could transform industries. But without connected reporting, these breakthroughs remain isolated in regional hubs.
              </p>
              <p>
                London BigBen bridges this gap. We bring together the leaders, stories, and insights that matter, connecting Canada&apos;s technology ecosystem in one place.
              </p>
            </div>

            <div className="w-full h-[340px] md:h-[420px] overflow-hidden rounded-sm bg-zinc-900 order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Female leader in studio setup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Centered Button */}
          <div className="text-center pt-6">
            <Link
              href="/events"
              className="bg-[#BF1E2D] hover:bg-red-700 text-white font-bold text-[12px] uppercase tracking-wider px-8 py-4 transition-colors inline-block font-sans"
            >
              TELL US WHAT YOU&apos;RE BUILDING
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIGHT GREY SECTION WITH TEAM PHOTO */}
      <section className="py-20 md:py-24 px-4 md:px-8 bg-[#F4F4F4] text-black">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full h-[340px] md:h-[440px] overflow-hidden rounded-sm bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop"
              alt="London BigBen team at event"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col items-start max-w-xl">
            <span className="text-[#BF1E2D] font-extrabold text-[11px] tracking-wider uppercase mb-3 font-sans">
              WORK WITH LONDON BIGBEN
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-5 leading-tight tracking-tight">
              The most consequential work in Canada deserves an audience that matches it
            </h2>
            <p className="text-zinc-700 text-[14.5px] leading-relaxed mb-8 font-sans">
              We partner with Canadian organizations to tell their stories, spotlight their leaders, and connect them with the decision-makers who matter.
            </p>
            <Link
              href="/newsletters"
              className="bg-[#BF1E2D] hover:bg-red-700 text-white font-bold text-[12px] uppercase tracking-wider px-7 py-3.5 transition-colors inline-flex items-center gap-2 font-sans"
            >
              JOIN US &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: DARK CHARCOAL FOOTER / CONTACT SECTION */}
      <section className="py-20 md:py-24 px-4 md:px-8 bg-[#2A2A2A] text-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Callout */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight max-w-sm tracking-tight">
              Reach the leaders who decide what comes next
            </h2>
            <Link
              href="/newsletters"
              className="bg-[#BF1E2D] hover:bg-red-700 text-white font-bold text-[12px] uppercase tracking-wider px-7 py-3.5 transition-colors inline-block font-sans"
            >
              GET IN TOUCH
            </Link>
          </div>

          {/* Right Feature List */}
          <div className="lg:col-span-7 space-y-8 font-sans">
            <div className="border-t border-zinc-600/60 pt-6">
              <h3 className="text-lg font-bold text-white mb-2 font-standard-sans">
                Editorial partnerships
              </h3>
              <p className="text-zinc-300 text-[13.5px] leading-relaxed">
                In-depth editorial series, multi-part reports, and thought leadership pieces that position your organization at the center of the technology conversation.
              </p>
            </div>

            <div className="border-t border-zinc-600/60 pt-6">
              <h3 className="text-lg font-bold text-white mb-2 font-standard-sans">
                Event coverage
              </h3>
              <p className="text-zinc-300 text-[13.5px] leading-relaxed">
                On-site reporting, video interviews, and live event coverage that extends the reach of your conference or summit to our national audience.
              </p>
            </div>

            <div className="border-t border-zinc-600/60 pt-6">
              <h3 className="text-lg font-bold text-white mb-2 font-standard-sans">
                Hosted programs
              </h3>
              <p className="text-zinc-300 text-[13.5px] leading-relaxed">
                Custom roundtables, executive dinners, and intimate discussions that bring together the leaders you want to reach for high-value conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
