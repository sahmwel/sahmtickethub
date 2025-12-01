'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [role, setRole] = useState<"admin" | "organizer">("organizer");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isStrongEnough = password.length >= 6;

  // ===== SIGN UP =====
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isStrongEnough || !passwordsMatch) return alert("Password too weak or does not match");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });
    if (error) return alert(error.message);
    if (data.user) {
      setUserId(data.user.id);

      // Insert into profiles
      await supabase.from("profiles").insert({ id: data.user.id, role });

      // Generate OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      await supabase.from("otp_codes").insert({ user_id: data.user.id, otp: generatedOtp });

      // Send OTP email via API route
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: generatedOtp }),
      });

      if (!response.ok) return alert("Failed to send OTP email");
      setShowOTP(true);
    }
  };

  // ===== VERIFY OTP =====
  const handleVerifyOTP = async () => {
    if (!userId) return alert("User not found");

    const { data, error } = await supabase
      .from("otp_codes")
      .select("otp")
      .eq("user_id", userId)
      .eq("otp", otp)
      .single();

    if (error || !data) return alert("Invalid OTP");

    // Delete OTP after verification
    await supabase.from("otp_codes").delete().eq("user_id", userId);

    alert("OTP verified! You can now log in.");
    setShowOTP(false);
    setIsLogin(true);
  };

  // ===== LOGIN =====
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    if (!data.user?.email_confirmed_at) return alert("Please verify your email first");

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profileData) return alert("Failed to fetch user role");

    if (profileData.role === "admin") router.push("/admin");
    else router.push("/organizer");
  };

  // ===== FORGOT PASSWORD =====
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!forgotEmail.includes("@")) return alert("Invalid email");

    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: window.location.origin + "/auth/login",
    });

    if (error) return alert(error.message);
    alert("Check your email for password reset link");
    setShowForgot(false);
  };

  return (
    <AnimatePresence>
      {!showOTP ? (
        !showForgot ? (
          // LOGIN / SIGNUP
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-rose-900/95 backdrop-blur-3xl border border-white/20 rounded-3xl w-full max-w-sm shadow-3xl overflow-hidden relative"
            >
              <button onClick={() => router.back()} className="absolute top-3 right-3 text-white/70 hover:text-white transition z-10">
                <X size={24} />
              </button>

              <div className="text-center pt-8 pb-4 px-4 md:px-5">
                <Image src="/logo-white.png" alt="SahmTicketHub" width={140} height={60} className="mx-auto mb-4" />
                <h2 className="text-2xl md:text-xl font-black text-white">{isLogin ? "Welcome Back" : "Join the Vibe"}</h2>
              </div>

              {/* Tab */}
              <div className="flex bg-white/10 backdrop-blur mx-4 rounded-xl p-1 mb-5">
                {["Log In", "Sign Up"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setIsLogin(tab === "Log In")}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      (isLogin && tab === "Log In") || (!isLogin && tab === "Sign Up")
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                        : "text-white/60"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={isLogin ? handleLogin : handleSignUp} className="px-4 md:px-5 pb-8 space-y-4">
                {!isLogin && (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <input type="text" required placeholder="Full Name" className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <input type="tel" required placeholder="+234 801 234 5678" className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <label className="text-white text-xs flex items-center gap-1">
                        Role:
                        <select value={role} onChange={(e) => setRole(e.target.value as "admin"|"organizer")} className="ml-2 bg-white/10 text-white text-xs rounded-md px-2 py-1">
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </label>
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none" />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {!isLogin && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm Password" className="w-full pl-10 pr-10 py-3 bg-white/10 border rounded-xl text-white placeholder-pink-300 focus:outline-none" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}

                {isLogin && (
                  <button type="button" onClick={() => setShowForgot(true)} className="text-pink-300 text-xs hover:underline block text-right w-full font-medium">Forgot password?</button>
                )}

                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-base py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all">
                  {isLogin ? "Log In" : "Create Account"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        ) : (
          // FORGOT PASSWORD MODAL
          <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <motion.div className="bg-purple-900/95 p-6 rounded-xl w-full max-w-sm relative">
              <button onClick={() => setShowForgot(false)} className="absolute top-3 left-3 text-white/70 hover:text-white">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-white font-bold text-xl mb-4">Reset Password</h2>
              <form onSubmit={handleForgotPassword}>
                <div className="relative mb-4">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-3 py-3 rounded-xl text-white bg-white/10 border border-white/20 focus:outline-none" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold">Send Reset Link</button>
              </form>
            </motion.div>
          </motion.div>
        )
      ) : (
        // OTP MODAL
        <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <motion.div className="bg-purple-900/90 p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-white font-bold text-xl mb-4">Enter OTP</h2>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" placeholder="Enter OTP" className="w-full p-3 rounded-xl mb-4" />
            <button onClick={handleVerifyOTP} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold">Verify</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
