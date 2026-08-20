"use client";

import { useState } from "react";

export default function NewsletterFormCard() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, companyName }),
      });
    } catch (e) {
      console.warn("Newsletter API request error:", e);
    }

    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
      setFirstName("");
      setLastName("");
      setCompanyName("");
    }, 4000);
  };

  return (
    <div className="w-full bg-[#F4F4F4] border border-zinc-200/80 p-8 md:p-12 my-10 rounded-xl text-left font-standard-sans max-w-[800px] mx-auto shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-[28px] md:text-[34px] font-bold text-black leading-tight font-standard-sans">
          What does this <span className="italic font-bold">really</span> mean?
        </h3>
        <p className="text-[13.5px] md:text-[14.5px] text-zinc-600 mt-3 leading-relaxed max-w-2xl mx-auto font-normal font-sans">
          Sign up for our weekly newsletter where we look at the technology stories reshaping how Canadian businesses operate and compete, and what they mean for the people running them.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-[620px] mx-auto space-y-5">
        {/* Email field */}
        <div>
          <label className="block text-[13.5px] font-bold text-zinc-800 mb-1.5 font-standard-sans">
            Email <span className="text-zinc-400 font-normal ml-0.5">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-md text-[14px] text-zinc-800 focus:outline-none focus:border-zinc-500 transition-colors font-sans"
          />
        </div>

        {/* First name field */}
        <div>
          <label className="block text-[13.5px] font-bold text-zinc-800 mb-1.5 font-standard-sans">
            First name <span className="text-zinc-400 font-normal ml-0.5">*</span>
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-md text-[14px] text-zinc-800 focus:outline-none focus:border-zinc-500 transition-colors font-sans"
          />
        </div>

        {/* Last name field */}
        <div>
          <label className="block text-[13.5px] font-bold text-zinc-800 mb-1.5 font-standard-sans">
            Last name <span className="text-zinc-400 font-normal ml-0.5">*</span>
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-md text-[14px] text-zinc-800 focus:outline-none focus:border-zinc-500 transition-colors font-sans"
          />
        </div>

        {/* Company name field */}
        <div>
          <label className="block text-[13.5px] font-bold text-zinc-800 mb-1.5 font-standard-sans">
            Company name <span className="text-zinc-400 font-normal ml-0.5">*</span>
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-md text-[14px] text-zinc-800 focus:outline-none focus:border-zinc-500 transition-colors font-sans"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#BF1E2D] hover:bg-red-800 text-white font-bold text-[14px] px-6 py-2.5 rounded-md flex items-center gap-2 cursor-pointer transition-colors font-standard-sans"
          >
            Submit <span className="text-[16px] leading-none">&rarr;</span>
          </button>
        </div>
      </form>

      {/* Success state */}
      {subscribed && (
        <div className="mt-6 max-w-[620px] mx-auto p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-[13px] font-bold rounded-md">
          ✓ Subscribed successfully! Thank you for subscribing to London BigBen.
        </div>
      )}

      {/* Footer text */}
      <p className="text-[13px] text-zinc-700 text-center leading-relaxed mt-10 font-normal font-sans">
        We land in your <span className="font-bold">inbox</span> on <span className="font-bold">Tuesdays.</span> You can <span className="font-bold">unsubscribe</span> at any <span className="font-bold">time.</span>
      </p>
    </div>
  );
}
