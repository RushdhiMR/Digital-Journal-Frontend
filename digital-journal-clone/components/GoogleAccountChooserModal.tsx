"use client";

import React from "react";

interface Account {
  name: string;
  email: string;
  avatar?: string;
  status?: string;
}

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: Account) => void;
}

export default function GoogleAccountChooserModal({
  isOpen,
  onClose,
  onSelectAccount,
}: GoogleAccountChooserModalProps) {
  if (!isOpen) return null;

  const accounts: Account[] = [
    {
      name: "Rushdhi Riyaj",
      email: "rushdhiriyaj2005@gmail.com",
      avatar: "RR",
    },
    {
      name: "Nesto Super",
      email: "nestosuper2024@gmail.com",
      avatar: "NS",
      status: "Signed out",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in font-sans">
      {/* Outer Window Container styled like Chrome popup */}
      <div className="w-full max-w-[450px] bg-[#121314] text-white rounded-xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1E1F22] border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            {/* Google G Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-[14px] font-medium text-zinc-200">Sign in with Google</span>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-zinc-800"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-8 flex-1">
          <h2 className="text-[32px] font-normal text-white mb-1.5 tracking-tight font-sans">
            Choose an account
          </h2>
          <p className="text-[15px] text-zinc-300 mb-8 font-sans">
            to continue to <span className="text-blue-400 font-medium hover:underline cursor-pointer">digital-journal.com</span>
          </p>

          {/* Accounts List */}
          <div className="space-y-1 divide-y divide-zinc-800/80">
            {accounts.map((acc, index) => (
              <div
                key={index}
                onClick={() => onSelectAccount(acc)}
                className="flex items-center justify-between py-3.5 px-3 rounded-lg hover:bg-zinc-800/70 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Account Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow">
                    {acc.avatar}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-zinc-100 group-hover:text-white">
                      {acc.name}
                    </h3>
                    <p className="text-[13px] text-zinc-400 font-normal">
                      {acc.email}
                    </p>
                  </div>
                </div>

                {acc.status && (
                  <span className="text-[12px] text-zinc-500 font-normal">
                    {acc.status}
                  </span>
                )}
              </div>
            ))}

            {/* Use Another Account Option */}
            <div
              onClick={() =>
                onSelectAccount({
                  name: "Guest User",
                  email: "user@digitaljournal.com",
                })
              }
              className="flex items-center gap-4 py-3.5 px-3 rounded-lg hover:bg-zinc-800/70 transition-colors cursor-pointer group pt-4"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center flex-shrink-0 border border-zinc-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-zinc-200 group-hover:text-white">
                Use another account
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-[12px] text-zinc-400 bg-[#16171a]">
          <button type="button" className="hover:text-zinc-200 cursor-pointer flex items-center gap-1">
            English (United Kingdom) <span className="text-[10px]">▼</span>
          </button>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-200 transition-colors">Help</a>
            <a href="#" className="hover:text-zinc-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-200 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
