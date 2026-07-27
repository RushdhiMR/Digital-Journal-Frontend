"use client";

import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";

export interface Account {
  name: string;
  email: string;
  avatar?: string;
  status?: string;
  isDevice?: boolean;
  password?: string;
}

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: Account) => void;
}

const KNOWN_PASSWORDS: Record<string, string[]> = {
  "admin@digitaljournal.com": ["admin", "admin123", "admin2026"],
  "coadmin@digitaljournal.com": ["coadmin", "coadmin123", "coadmin2026"],
  "writer@digitaljournal.com": ["writer", "writer123", "writer2026"],
  "reader@digitaljournal.com": ["reader", "reader123", "reader2026"],
};

export default function GoogleAccountChooserModal({
  isOpen,
  onClose,
  onSelectAccount,
}: GoogleAccountChooserModalProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [mode, setMode] = useState<"choose" | "email_input" | "password_verify" | "password_create">("choose");
  
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  
  const [pendingAccount, setPendingAccount] = useState<Account | null>(null);
  
  // Password states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setCustomEmail("");
    setCustomName("");
    setPassword("");
    setConfirmPassword("");
    setFormError("");
    setPendingAccount(null);

    try {
      const savedAccountsStr = localStorage.getItem("dj_device_google_accounts");
      const activeUserStr = localStorage.getItem("dj_user");

      const deviceList: Account[] = savedAccountsStr ? JSON.parse(savedAccountsStr) : [];

      if (activeUserStr) {
        const activeUser = JSON.parse(activeUserStr);
        if (activeUser?.email) {
          const found = deviceList.find((a) => a.email.toLowerCase() === activeUser.email.toLowerCase());
          if (found) {
            found.status = "Signed in";
            found.isDevice = true;
          } else {
            const initials = activeUser.name
              ? activeUser.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
              : activeUser.email.slice(0, 2).toUpperCase();

            deviceList.unshift({
              name: activeUser.name || activeUser.email.split("@")[0],
              email: activeUser.email,
              avatar: initials,
              status: "Signed in",
              isDevice: true,
            });
          }
        }
      }

      setAccounts(deviceList);

      if (deviceList.length === 0) {
        setMode("email_input");
      } else {
        setMode("choose");
      }
    } catch (e) {
      console.warn("Error reading local device google accounts:", e);
      setAccounts([]);
      setMode("email_input");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to check if an email already exists in system registry or local registered accounts
  const checkAccountExistence = (email: string) => {
    const lower = email.trim().toLowerCase();
    
    // Check known system accounts
    if (KNOWN_PASSWORDS[lower]) {
      return { exists: true, isSystem: true, validPasswords: KNOWN_PASSWORDS[lower] };
    }

    // Check locally registered accounts
    try {
      const regStr = localStorage.getItem("dj_registered_users");
      if (regStr) {
        const regList: any[] = JSON.parse(regStr);
        const match = regList.find((u) => u.email && u.email.toLowerCase() === lower);
        if (match) {
          return { exists: true, isSystem: false, matchUser: match };
        }
      }
    } catch (e) {
      console.warn(e);
    }

    return { exists: false, isSystem: false };
  };

  const handleSelectDeviceAccount = (acc: Account) => {
    setFormError("");
    setPassword("");
    setConfirmPassword("");
    setPendingAccount(acc);

    const check = checkAccountExistence(acc.email);
    if (check.exists) {
      setMode("password_verify");
    } else {
      setMode("password_create");
    }
  };

  const handleEmailInputNext = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedEmail = customEmail.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setFormError("Please enter a valid Google email address.");
      return;
    }

    const nameFromEmail =
      customName.trim() ||
      trimmedEmail
        .split("@")[0]
        .split(".")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const initials =
      nameFromEmail
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "GA";

    const acc: Account = {
      name: nameFromEmail,
      email: trimmedEmail,
      avatar: initials,
      status: "Device Account",
      isDevice: true,
    };

    setPendingAccount(acc);
    setPassword("");
    setConfirmPassword("");

    const check = checkAccountExistence(trimmedEmail);
    if (check.exists) {
      setMode("password_verify");
    } else {
      setMode("password_create");
    }
  };

  const handleVerifyPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!pendingAccount) return;
    if (!password.trim()) {
      setFormError("Please enter your account password.");
      return;
    }

    const check = checkAccountExistence(pendingAccount.email);
    const entered = password.trim().toLowerCase();

    if (check.isSystem && check.validPasswords) {
      if (!check.validPasswords.includes(entered)) {
        setFormError(`❌ Incorrect password for '${pendingAccount.email}'.`);
        return;
      }
    } else if (check.matchUser) {
      if (check.matchUser.password && check.matchUser.password.toLowerCase() !== entered) {
        setFormError(`❌ Incorrect password for '${pendingAccount.email}'.`);
        return;
      }
    }

    // Password verified! Complete sign-in
    completeAccountSignIn(pendingAccount);
  };

  const handleCreatePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!pendingAccount) return;
    if (!password || password.length < 4) {
      setFormError("Password must be at least 4 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match. Please re-enter.");
      return;
    }

    // Save new account with created password into dj_registered_users registry
    try {
      const regStr = localStorage.getItem("dj_registered_users");
      const regList: any[] = regStr ? JSON.parse(regStr) : [];
      
      const newUser = {
        name: pendingAccount.name,
        email: pendingAccount.email,
        password: password.trim(),
        role: "Reader",
        createdAt: new Date().toISOString(),
      };

      regList.unshift(newUser);
      localStorage.setItem("dj_registered_users", JSON.stringify(regList));
    } catch (err) {
      console.warn("Could not save new user registration:", err);
    }

    // Complete sign-in
    completeAccountSignIn(pendingAccount);
  };

  const completeAccountSignIn = (acc: Account) => {
    // Save to local device google accounts
    try {
      const existingStr = localStorage.getItem("dj_device_google_accounts");
      const existingList: Account[] = existingStr ? JSON.parse(existingStr) : [];
      if (!existingList.some((a) => a.email.toLowerCase() === acc.email.toLowerCase())) {
        existingList.unshift(acc);
        localStorage.setItem("dj_device_google_accounts", JSON.stringify(existingList));
      }
    } catch (err) {
      console.warn("Failed to persist device account:", err);
    }

    onSelectAccount(acc);
  };

  const handleRemoveAccount = (e: React.MouseEvent, emailToRemove: string) => {
    e.stopPropagation();
    const updated = accounts.filter((a) => a.email.toLowerCase() !== emailToRemove.toLowerCase());
    setAccounts(updated);
    try {
      localStorage.setItem("dj_device_google_accounts", JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to update device accounts list:", err);
    }
    if (updated.length === 0) {
      setMode("email_input");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-[450px] bg-[#121314] text-white rounded-xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1E1F22] border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
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

        {/* Body */}
        <div className="p-7 md:p-8 flex-1">

          {/* MODE 1: CHOOSE ACCOUNT */}
          {mode === "choose" && (
            <>
              <h2 className="text-[26px] font-normal text-white mb-1 tracking-tight font-sans">
                Choose an account
              </h2>
              <p className="text-[13.5px] text-zinc-400 mb-6 font-sans">
                to continue to <span className="text-blue-400 font-medium hover:underline">digital-journal.com</span>
              </p>

              <div className="space-y-1 divide-y divide-zinc-800/80 max-h-[260px] overflow-y-auto pr-1">
                {accounts.map((acc, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectDeviceAccount(acc)}
                    className="flex items-center justify-between py-3.5 px-3 rounded-lg hover:bg-zinc-800/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
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

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleRemoveAccount(e, acc.email)}
                        className="text-zinc-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove account from device"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => {
                    setMode("email_input");
                    setCustomEmail("");
                    setCustomName("");
                    setFormError("");
                  }}
                  className="flex items-center gap-4 py-3.5 px-3 rounded-lg hover:bg-zinc-800/70 transition-colors cursor-pointer group pt-4"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center flex-shrink-0 border border-zinc-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-zinc-200 group-hover:text-white">
                    Use another Google account
                  </span>
                </div>
              </div>
            </>
          )}

          {/* MODE 2: EMAIL INPUT */}
          {mode === "email_input" && (
            <form onSubmit={handleEmailInputNext} className="space-y-4">
              <div>
                <h2 className="text-[24px] font-medium text-white mb-1 tracking-tight font-sans">
                  Sign in with Google
                </h2>
                <p className="text-[13px] text-zinc-400 font-sans">
                  Enter your Google email address for this device.
                </p>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 font-sans">
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. user@gmail.com"
                  autoFocus
                  required
                  className="w-full bg-[#1A1B1E] border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 font-sans">
                  Account Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#1A1B1E] border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {accounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMode("choose")}
                    className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer shadow"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: PASSWORD VERIFY (For Existing Accounts) */}
          {mode === "password_verify" && pendingAccount && (
            <form onSubmit={handleVerifyPasswordSubmit} className="space-y-4">
              <div>
                <h2 className="text-[22px] font-medium text-white mb-1 tracking-tight font-sans flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  Enter Account Password
                </h2>
                <p className="text-[13px] text-zinc-400 font-sans">
                  Enter password for <span className="text-white font-medium">{pendingAccount.email}</span>
                </p>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 font-sans">
                  Account Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  autoFocus
                  required
                  className="w-full bg-[#1A1B1E] border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setMode(accounts.length > 0 ? "choose" : "email_input")}
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer shadow"
                >
                  Verify & Sign In
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: PASSWORD CREATE (For New Accounts) */}
          {mode === "password_create" && pendingAccount && (
            <form onSubmit={handleCreatePasswordSubmit} className="space-y-4">
              <div>
                <h2 className="text-[22px] font-medium text-white mb-1 tracking-tight font-sans flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                  Set New Account Password
                </h2>
                <p className="text-[12.5px] text-zinc-400 font-sans">
                  Since <span className="text-white font-medium">{pendingAccount.email}</span> is a new account, set a password to protect your sign in.
                </p>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 font-sans">
                  Create Account Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a new password (min 4 chars)"
                  autoFocus
                  required
                  className="w-full bg-[#1A1B1E] border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 font-sans">
                  Confirm Account Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full bg-[#1A1B1E] border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setMode(accounts.length > 0 ? "choose" : "email_input")}
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shadow"
                >
                  Create Password & Sign In
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
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
