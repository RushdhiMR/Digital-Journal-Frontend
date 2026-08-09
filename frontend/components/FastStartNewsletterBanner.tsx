"use client";

import { useState } from 'react';

export default function FastStartNewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (e) {
      console.warn("Newsletter request error:", e);
    }

    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <div className="clear-both w-full my-10 p-6 md:p-8 bg-white border-y-2 border-[#D97706]/70 font-serif rounded-xs shadow-xs" style={{ clear: 'both' }}>
      <h3 className="text-[20px] md:text-[23px] font-bold text-[#B45309] mb-1.5 font-serif leading-snug tracking-tight">
        Digital Journal Fast Start — <span className="font-normal italic text-[#92400E]">Let the best of news come to you</span>
      </h3>
      <p className="text-[13px] text-zinc-600 font-sans mb-5 font-normal">
        Sign up for daily news updates sent directly to your inbox.
      </p>
      
      {subscribed ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3.5 rounded font-sans">
          ✓ Thank you for subscribing to Digital Journal Fast Start!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2.5 text-[14px] border border-amber-200 focus:border-[#B45309] rounded-none focus:outline-none font-sans bg-white text-zinc-800 placeholder-zinc-400"
            required
          />
          <button
            type="submit"
            className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-[12px] uppercase tracking-wider px-6 py-2.5 rounded-none transition-colors font-sans whitespace-nowrap cursor-pointer shadow-sm"
          >
            SIGN UP NOW
          </button>
        </form>
      )}

      <p className="text-[10.5px] text-zinc-400 font-sans mt-3">
        By submitting your email you agree to our <a href="#" className="underline text-zinc-500 hover:text-black">Terms of Service</a> and <a href="#" className="underline text-zinc-500 hover:text-black">Privacy Policy</a>.
      </p>
    </div>
  );
}
