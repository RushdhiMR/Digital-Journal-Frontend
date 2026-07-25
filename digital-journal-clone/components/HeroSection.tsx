export default function HeroSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.1fr] gap-8 items-center">
        {/* Main Hero Image */}
        <div className="relative w-full h-[320px] md:h-[400px] lg:h-[480px] overflow-hidden bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200&h=800&fit=crop"
            alt="Security breach on smartphone"
            className="w-full h-full object-cover"
          />
        </div>
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
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-[1.12] mb-4 text-black hover:text-red-600 transition-colors cursor-pointer">
            What tools business should take from a massive security breach to prevent future attacks
          </h1>
          <p className="text-[14.5px] lg:text-[15.5px] text-gray-700 leading-relaxed mb-6">
            A massive security breach has exposed vulnerable systems. Experts suggest key tools businesses should implement to prevent future data theft and secure infrastructure.
          </p>
          <p className="text-[11.5px] text-gray-400 font-medium">
            By <span className="text-black font-semibold">John Doe</span> • July 13, 2026
          </p>
        </div>
      </div>
    </section>
  );
}
