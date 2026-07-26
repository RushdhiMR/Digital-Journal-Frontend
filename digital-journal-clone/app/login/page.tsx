"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAccountChooserModal from "@/components/GoogleAccountChooserModal";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  const [selectedRole, setSelectedRole] = useState<"Admin" | "Writer" | "Reader">("Admin");

  const handleRoleSelect = (role: "Admin" | "Writer" | "Reader") => {
    setSelectedRole(role);
    setErrorMessage("");
    setSuccessMessage("");

    if (role === "Admin") {
      setEmail("admin@digitaljournal.com");
      setPassword("admin123");
    } else if (role === "Writer") {
      setEmail("writer@digitaljournal.com");
      setPassword("writer123");
    } else {
      setEmail("reader@digitaljournal.com");
      setPassword("reader123");
    }
  };

  const handleQuickLogin = (userEmail: string, userPass: string, userName: string, roleName: "Admin" | "Writer" | "Reader") => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSelectedRole(roleName);
    setEmail(userEmail);
    setPassword(userPass);

    const loggedUser = {
      name: userName,
      email: userEmail,
      role: roleName
    };

    localStorage.setItem("dj_user", JSON.stringify(loggedUser));
    if (roleName === "Admin") {
      localStorage.setItem("dj_admin_user", JSON.stringify(loggedUser));
    }
    localStorage.setItem("dj_toast", `Welcome back, ${userName}! Signed in as ${roleName}.`);

    const destPath = roleName === "Admin" ? "/admin" : roleName === "Writer" ? "/writer" : "/reader";
    setSuccessMessage(`Authenticated as ${roleName}! Navigating to ${destPath}...`);

    setTimeout(() => {
      router.push(destPath);
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please enter both business email and passcode.");
      return;
    }
    setIsSubmitting(true);

    let roleName: "Admin" | "Writer" | "Reader" = selectedRole;
    let userName = email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    if (email.toLowerCase().includes("admin")) {
      roleName = "Admin";
      userName = "System Administrator";
    } else if (email.toLowerCase().includes("writer")) {
      roleName = "Writer";
      userName = "Jennifer Friesen";
    } else if (email.toLowerCase().includes("reader")) {
      roleName = "Reader";
      userName = userName || "Alex Reader";
    }

    const targetDestination = roleName === "Admin" ? "/admin" : roleName === "Writer" ? "/writer" : "/reader";

    try {
      let res;
      try {
        res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      } catch (err) {
        res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      }
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMessage(data.error || "Authentication failed. Please check credentials.");
        setIsSubmitting(false);
        return;
      }
      const loggedUser = data.user ? { ...data.user, role: roleName } : { name: userName, email, role: roleName };
      localStorage.setItem("dj_user", JSON.stringify(loggedUser));
      if (roleName === "Admin") {
        localStorage.setItem("dj_admin_user", JSON.stringify(loggedUser));
      }
      localStorage.setItem("dj_toast", `Welcome back, ${loggedUser.name}! Signed in as ${roleName}.`);

      setSuccessMessage(`Successfully signed in as ${roleName}! Opening ${targetDestination}...`);
      setTimeout(() => {
        router.push(targetDestination);
      }, 800);
    } catch (err) {
      console.warn("Login API fallback mode:", err);
      const fallbackUser = { name: userName, email, role: roleName };
      localStorage.setItem("dj_user", JSON.stringify(fallbackUser));
      if (roleName === "Admin") {
        localStorage.setItem("dj_admin_user", JSON.stringify(fallbackUser));
      }
      localStorage.setItem("dj_toast", `Welcome back, ${fallbackUser.name}! Signed in as ${roleName}.`);

      setSuccessMessage(`Successfully signed in as ${roleName}! Opening ${targetDestination}...`);
      setTimeout(() => {
        router.push(targetDestination);
      }, 800);
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

    // Persist selected Google account to device accounts list
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

    // Trigger backend login endpoint to dispatch email notification
    try {
      await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: acc.email, password: "google_oauth_authenticated" }),
      });
    } catch (err) {
      try {
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: acc.email, password: "google_oauth_authenticated" }),
        });
      } catch (e) {
        console.warn("Google Sign-in email notification error:", e);
      }
    }

    localStorage.setItem("dj_user", JSON.stringify({ name: acc.name, email: acc.email }));
    localStorage.setItem("dj_toast", `Welcome back, ${acc.name}! You are successfully signed in with Google.`);

    setSuccessMessage(`Authenticated as ${acc.name} (${acc.email}) with Google! Redirecting...`);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-standard-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {/* Card Container */}
        <div className="w-full max-w-[460px] bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden p-6 md:p-8">
          
          {/* Website Logo Header */}
          <div className="flex flex-col items-center mb-6 pt-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img
                src="/logo.png"
                alt="Digital Journal Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-[20px] font-bold tracking-[0.5px] text-black uppercase font-standard-sans">
                DIGITAL JOURNAL
              </span>
            </Link>
          </div>

          {/* Login Title & Subtext */}
          <div className="mb-6 text-center">
            <h1 className="text-[26px] font-bold text-black font-standard-sans leading-none">Login</h1>
            <p className="text-[10px] text-zinc-400 font-bold tracking-[1px] mt-2 uppercase font-standard-sans">
              SIGN IN TO YOUR ACCOUNT
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-6">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 text-center">
              SELECT LOGIN PORTAL TYPE
            </p>
            <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleRoleSelect("Admin")}
                className={`py-2 text-[11px] font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedRole === "Admin"
                    ? "bg-red-700 text-white shadow-sm"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-200"
                }`}
              >
                <span>🛡️</span> Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("Writer")}
                className={`py-2 text-[11px] font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedRole === "Writer"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-200"
                }`}
              >
                <span>✍️</span> Writer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("Reader")}
                className={`py-2 text-[11px] font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedRole === "Reader"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-200"
                }`}
              >
                <span>📖</span> Reader
              </button>
            </div>
          </div>

          {/* Quick Role Demo Logins */}
          <div className="mb-6 bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 text-center">
              1-CLICK DEMO LOGIN ACCOUNTS
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@digitaljournal.com", "admin123", "System Admin", "Admin")}
                className="flex flex-col items-center justify-center py-2 px-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded transition-colors text-[10px] font-bold cursor-pointer"
              >
                <span className="text-[14px] mb-0.5">🛡️</span>
                <span>ADMIN</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("writer@digitaljournal.com", "writer123", "Jennifer Friesen", "Writer")}
                className="flex flex-col items-center justify-center py-2 px-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded transition-colors text-[10px] font-bold cursor-pointer"
              >
                <span className="text-[14px] mb-0.5">✍️</span>
                <span>WRITER</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("reader@digitaljournal.com", "reader123", "Alex Reader", "Reader")}
                className="flex flex-col items-center justify-center py-2 px-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded transition-colors text-[10px] font-bold cursor-pointer"
              >
                <span className="text-[14px] mb-0.5">📖</span>
                <span>READER</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3 rounded text-center animate-fade-in font-sans">
              ✓ {successMessage}
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded text-center font-sans">
              ⚠ {errorMessage}
            </div>
          )}

          {/* Google Sign In Button */}
          <button 
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-zinc-200 rounded px-4 py-2.5 bg-white hover:bg-zinc-50 active:scale-[0.99] transition-all mb-6 cursor-pointer font-standard-sans text-[14px] font-bold text-zinc-700 disabled:opacity-50 shadow-sm"
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
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink mx-4 text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-standard-sans">
              OR ENTER {selectedRole.toUpperCase()} CREDENTIALS
            </span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* Business Email Input */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-2 font-standard-sans">
                {selectedRole.toUpperCase()} EMAIL
              </label>
              <input
                type="email"
                name="user_business_email_no_autofill"
                autoComplete="off"
                placeholder={
                  selectedRole === "Admin" ? "admin@digitaljournal.com" :
                  selectedRole === "Writer" ? "writer@digitaljournal.com" :
                  "reader@digitaljournal.com"
                }
                value={email}
                onChange={(e) => {
                  const val = e.target.value;
                  setEmail(val);
                  if (val.toLowerCase().includes("admin")) setSelectedRole("Admin");
                  else if (val.toLowerCase().includes("writer")) setSelectedRole("Writer");
                  else if (val.toLowerCase().includes("reader")) setSelectedRole("Reader");
                }}
                className="w-full px-4 py-3 border border-zinc-200 rounded text-[14px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors font-standard-sans bg-white font-medium"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-2 font-standard-sans">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="user_password_no_autofill"
                  autoComplete="new-password"
                  placeholder="Enter passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 pr-10 py-3 border border-zinc-200 rounded text-[14px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors font-standard-sans bg-white"
                  required
                />
                {/* Eye Button Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
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

            {/* Submit Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-bold text-[14px] py-3.5 rounded transition-all uppercase tracking-wider cursor-pointer font-standard-sans disabled:opacity-50 flex items-center justify-center gap-2 shadow ${
                  selectedRole === "Admin" ? "bg-red-700 hover:bg-red-800" :
                  selectedRole === "Writer" ? "bg-blue-700 hover:bg-blue-800" :
                  "bg-emerald-700 hover:bg-emerald-800"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    VERIFYING...
                  </>
                ) : (
                  `SIGN IN TO ${selectedRole === "Admin" ? "ADMIN PORTAL" : selectedRole === "Writer" ? "WRITER STUDIO" : "READER HUB"}`
                )}
              </button>
            </div>
          </form>

          {/* Footer Create Account Link */}
          <div className="mt-8 text-center">
            <Link href="/register" className="text-[13px] text-zinc-600 hover:text-black transition-colors font-standard-sans">
              New to Digital Journal? <span className="text-[#BF1E2D] font-bold hover:underline">Create secure account</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />

      {/* Google Account Chooser Popup Modal */}
      <GoogleAccountChooserModal
        isOpen={showGoogleChooser}
        onClose={() => setShowGoogleChooser(false)}
        onSelectAccount={handleSelectGoogleAccount}
      />
    </div>
  );
}
