import Link from "next/link";

export default function Hero() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Hero Image Clickable Link */}
        <Link
          href="/business/companies/what-tools-business-should-take-from-a-massive-security-breach-to-prevent-future-attacks"
          className="lg:col-span-2 relative w-full aspect-[16/10] sm:aspect-video lg:h-[480px] overflow-hidden bg-gray-100 rounded-none block group"
        >
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop"
            alt="Speaker on Stage"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {/* Hero Content Card */}
        <div className="flex flex-col justify-center h-full">
          <span className="text-[#CC6633] text-xs font-bold uppercase tracking-wider mb-2.5 block">
            Business & Finance
          </span>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4 text-black font-serif">
            <Link
              href="/business/companies/what-tools-business-should-take-from-a-massive-security-breach-to-prevent-future-attacks"
              className="hover:text-[#BF1E2D] transition-colors"
            >
              What tools business should take from a massive security breach to prevent future attacks
            </Link>
          </h1>
          <p className="text-[13.5px] text-gray-700 leading-relaxed mb-5 font-sans">
            A massive security breach has exposed vulnerable systems. Experts suggest key tools businesses should implement to prevent future data theft and secure infrastructure.
          </p>
          <p className="text-[11px] text-gray-400 font-medium">
            By <Link href="/author/david-potter" className="text-black font-semibold hover:text-[#BF1E2D] hover:underline cursor-pointer transition-colors">David Potter</Link> • July 28, 2026
          </p>
        </div>
      </div>
    </section>
  );
}
