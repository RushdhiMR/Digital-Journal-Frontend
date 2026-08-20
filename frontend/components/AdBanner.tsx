"use client";

interface AdBannerProps {
  label?: string;
  className?: string;
}

export default function AdBanner({ label = "ADVERTISEMENT", className = "" }: AdBannerProps) {
  return (
    <div className={`w-full max-w-[1400px] mx-auto px-4 md:px-6 my-8 ${className}`}>
      <div className="w-full bg-[#111827] border border-gray-800 rounded-none py-10 md:py-12 px-6 flex flex-col items-center justify-center text-center shadow-xs">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#D31220] font-extrabold mb-1">
          {label}
        </span>
        <p className="text-xs font-mono tracking-widest text-gray-400 uppercase">
          London BigBen Premium Sponsor Banner
        </p>
      </div>
    </div>
  );
}
