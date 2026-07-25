export default function PromoBanner() {
  return (
    <section className="w-full bg-[#0C0C0C] text-white py-12 px-4 md:px-8 my-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Column Text */}
        <div className="flex flex-col items-start max-w-xl">
          <span className="text-red-500 text-[10px] font-extrabold tracking-wider uppercase mb-2">
            Space Sovereignty
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">
            The journey of research for secure space decisions in Canada
          </h2>
          <p className="text-zinc-400 text-[13.5px] leading-relaxed mb-6">
            A comparison between Canada&apos;s and Europe&apos;s approach to securing space infrastructure and orbital resources. With commitment to protecting digital rights, international protocols may well set global benchmarks.
          </p>
          <p className="text-[11px] text-zinc-500 mb-6">
            By <span className="text-white font-semibold">Lisa Chen</span> • July 13, 2026
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-6 py-2.5 uppercase tracking-wider transition-colors">
            Read More
          </button>
        </div>
        {/* Right Column Image */}
        <div className="w-full h-[320px] md:h-[380px] overflow-hidden bg-zinc-900">
          <img
            src="https://images.unsplash.com/photo-1579294800821-694d95e86143?w=800&h=500&fit=crop"
            alt="Montreal Biosphere Dome"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
