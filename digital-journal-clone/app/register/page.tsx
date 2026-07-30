"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAccountChooserModal from "@/components/GoogleAccountChooserModal";
import { UserCheck, Bookmark, Bell, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify passcodes.");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("Password must be at least 4 characters long.");
      return;
    }

    setIsSubmitting(true);

    const newUserObj = { 
      name: fullName.trim(), 
      email: email.toLowerCase().trim(), 
      password: password.trim(), 
      role: "Reader",
      registeredAt: new Date().toISOString()
    };

    try {
      const registeredStr = localStorage.getItem("dj_registered_users");
      const registeredList = registeredStr ? JSON.parse(registeredStr) : [];
      if (!registeredList.some((u: any) => u.email.toLowerCase() === email.toLowerCase().trim())) {
        registeredList.push(newUserObj);
        localStorage.setItem("dj_registered_users", JSON.stringify(registeredList));
      }
    } catch (e) {
      console.warn("Could not persist registered user local state:", e);
    }

    try {
      try {
        await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, email, password }),
        });
      } catch (err) {
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, email, password }),
        });
      }

      localStorage.setItem("dj_user", JSON.stringify({ name: newUserObj.name, email: newUserObj.email, role: "Reader" }));
      localStorage.setItem("dj_toast", `Welcome to Digital Journal, ${newUserObj.name}! Your account has been created.`);

      setSuccessMessage("✓ Registration successful! Setting up your Reader Hub...");
      setTimeout(() => {
        router.push("/reader");
      }, 1000);
    } catch (err) {
      console.warn("Register API error:", err);
      localStorage.setItem("dj_user", JSON.stringify({ name: newUserObj.name, email: newUserObj.email, role: "Reader" }));
      localStorage.setItem("dj_toast", `Welcome to Digital Journal, ${newUserObj.name}! Your account has been created.`);

      setSuccessMessage("✓ Registration successful! Setting up your Reader Hub...");
      setTimeout(() => {
        router.push("/reader");
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setShowGoogleChooser(true);
  };

  const handleSelectGoogleAccount = async (acc: { name: string; email: string }) => {
    setShowGoogleChooser(false);
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const existingStr = localStorage.getItem("dj_device_google_accounts");
      const existingList = existingStr ? JSON.parse(existingStr) : [];
      if (!existingList.some((a: any) => a.email.toLowerCase() === acc.email.toLowerCase())) {
        const initials = acc.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "GA";
        existingList.unshift({
          name: acc.name,
          email: acc.email,
          avatar: initials,
          status: "Device Account",
          isDevice: true,
        });
        localStorage.setItem("dj_device_google_accounts", JSON.stringify(existingList));
      }
    } catch (e) {
      console.warn("Could not persist device google account:", e);
    }

    localStorage.setItem("dj_user", JSON.stringify({ name: acc.name, email: acc.email }));
    localStorage.setItem("dj_toast", `Welcome to Digital Journal, ${acc.name}! You are signed in with Google.`);

    setSuccessMessage(`Authenticated as ${acc.name} (${acc.email}) with Google! Redirecting...`);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Header />

      {/* PLAIN PAGE CONTENT (NO FLOATING POPUP SHADOW BOX) */}
      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: REGISTRATION BRANDING & READER BENEFITS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3 text-xs font-bold text-[#BF1E2D] uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#BF1E2D] rounded-full" />
              <span>JOIN DIGITAL JOURNAL NETWORK</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.15] font-serif">
              Join Digital Journal Today
            </h1>

            <p className="text-gray-600 text-base leading-relaxed font-sans">
              Create your free reader account to follow global market news, personalize topic feeds, save articles for offline reading, and receive daily breaking news summaries.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-none space-y-1.5">
                <UserCheck className="w-5 h-5 text-[#BF1E2D]" />
                <h3 className="font-bold text-sm text-gray-900">Verified Profile</h3>
                <p className="text-xs text-gray-500">Access accredited reader discussions and expert columns.</p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-none space-y-1.5">
                <Bookmark className="w-5 h-5 text-[#BF1E2D]" />
                <h3 className="font-bold text-sm text-gray-900">Saved Articles</h3>
                <p className="text-xs text-gray-500">Bookmark essential reports and read them anytime.</p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-none space-y-1.5">
                <Bell className="w-5 h-5 text-[#BF1E2D]" />
                <h3 className="font-bold text-sm text-gray-900">Topic Alerts</h3>
                <p className="text-xs text-gray-500">Custom notifications on cybersecurity, markets, and world news.</p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-none space-y-1.5">
                <Sparkles className="w-5 h-5 text-[#BF1E2D]" />
                <h3 className="font-bold text-sm text-gray-900">Premium Reading</h3>
                <p className="text-xs text-gray-500">Clean, ad-free reader dashboard and newsletter digests.</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PLAIN FORM LAYOUT (BORDER-0, NO POPUP SHADOW) */}
          <div className="lg:col-span-6 bg-white p-0 sm:p-2">
            
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-serif">Create Secure Account</h2>
              <p className="text-xs text-gray-500 font-bold tracking-wider mt-1 uppercase">
                FILL IN YOUR DETAILS BELOW TO REGISTER
              </p>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3.5 rounded-none text-center">
                ✓ {successMessage}
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-none text-center">
                ⚠ {errorMessage}
              </div>
            )}

            {/* Google Sign In Button */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 px-4 py-3 bg-white hover:bg-gray-50 active:scale-[0.99] transition-all mb-6 cursor-pointer text-sm font-bold text-gray-800 disabled:opacity-50"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
              Sign in with Google
            </button>

            {/* Separator */}
            <div className="relative flex py-3 items-center mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                OR REGISTER WITH EMAIL
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="user_fullname_no_autofill"
                  autoComplete="off"
                  placeholder="e.g. Rushdhi Riyaj"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#BF1E2D] transition-colors bg-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  BUSINESS EMAIL
                </label>
                <input
                  type="email"
                  name="user_business_email_no_autofill"
                  autoComplete="off"
                  placeholder="e.g. reader@digitaljournal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#BF1E2D] transition-colors bg-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  CREATE PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="user_new_password_no_autofill"
                    autoComplete="new-password"
                    placeholder="At least 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 pr-10 py-3 border border-gray-300 rounded-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#BF1E2D] transition-colors bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L21 21m-14.772-14.772l3.472 3.472m3.472 3.472L17.772 17.772M12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="user_confirm_password_no_autofill"
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 pr-10 py-3 border border-gray-300 rounded-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#BF1E2D] transition-colors bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L21 21m-14.772-14.772l3.472 3.472m3.472 3.472L17.772 17.772M12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#BF1E2D] hover:bg-red-800 active:scale-[0.99] text-white font-bold text-sm py-3.5 rounded-none transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      CREATING ACCOUNT...
                    </>
                  ) : (
                    "REGISTER ACCOUNT"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-left">
              <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                Already registered? <span className="text-[#BF1E2D] font-bold hover:underline">Sign in instead</span>
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />

      <GoogleAccountChooserModal
        isOpen={showGoogleChooser}
        onClose={() => setShowGoogleChooser(false)}
        onSelectAccount={handleSelectGoogleAccount}
        requirePasswordSetup={true}
      />
    </div>
  );
}
