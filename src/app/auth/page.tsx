'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Check,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const router = useRouter();

  const closeModal = () => router.back();

  const getPasswordStrength = (pass:string) => {
    if (!pass) return { strength: 0, label: "", color: "" };
    if (pass.length < 6) return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (pass.length < 8) return { strength: 2, label: "Fair", color: "bg-orange-500" };
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass))
      return { strength: 4, label: "Very Strong", color: "bg-emerald-500" };
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass))
      return { strength: 3, label: "Strong", color: "bg-green-500" };
    return { strength: 2, label: "Medium", color: "bg-yellow-500" };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = !confirmPassword || password === confirmPassword;
  const isStrongEnough = strength.strength >= 2;

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    if (!isLogin && (!isStrongEnough || !passwordsMatch)) return;

   // Mock role (replace with your auth logic)
  const role = prompt("Enter role (admin / organizer)", "")?.toLowerCase();

  if (role === "admin") {
    router.push("/admin");
  } else if (role === "organizer") {
    router.push("/organizer");
  } else {
    alert("Access denied. Only Admins and Organizers can log in.");
    router.push("/"); // redirect to home
  }
};

 const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!forgotEmail.includes("@")) return alert("Please enter a valid email");
  setEmailSent(true);
};


  return (
    <AnimatePresence>
      {!showForgot ? (
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
            className="bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-rose-900/95 backdrop-blur-3xl border border-white/20 rounded-3xl w-full max-w-sm md:max-w-xs lg:max-w-sm shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto relative"
          >
            {/* Only X closes modal */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white/70 hover:text-white transition z-10"
              type="button"
            >
              <X size={24} />
            </button>

            <div className="text-center pt-8 pb-4 px-4 md:px-5">
              <Image
                src="/logo-white.png"
                alt="SahmTicketHub"
                width={140}
                height={60}
                className="mx-auto mb-4"
                priority
              />
              <h2 className="text-2xl md:text-xl font-black text-white">
                {isLogin ? "Welcome Back" : "Join the Vibe"}
              </h2>
              <p className="text-pink-200 text-xs mt-1">
                {isLogin ? "Log in to your account" : "Create your organizer account"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-white/10 backdrop-blur mx-4 rounded-xl p-1 mb-5">
              {["Log In", "Sign Up"].map((tab) => (
                <button
                  key={tab}
                  type="button" // ✅ Important
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

            <form onSubmit={handleSubmit} className="px-4 md:px-5 pb-8 space-y-4">
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full pl-10 pr-3 py-3 md:py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                    <input
                      type="tel"
                      required
                      placeholder="+234 801 234 5678"
                      className="w-full pl-10 pr-3 py-3 md:py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full pl-10 pr-3 py-3 md:py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 md:py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!isLogin && password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${
                          level <= strength.strength ? strength.color : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-pink-200 text-right font-medium">
                    {strength.label}
                  </p>
                </div>
              )}

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className={`w-full pl-10 pr-10 py-3 md:py-2.5 bg-white/10 border rounded-xl text-white placeholder-pink-300 focus:outline-none ${
                      confirmPassword && !passwordsMatch
                        ? "border-red-500"
                        : "border-white/20 focus:border-purple-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  {confirmPassword && passwordsMatch && (
                    <Check className="absolute right-10 top-1/2 -translate-y-1/2 text-green-400 w-4 h-4" />
                  )}
                  {confirmPassword && !passwordsMatch && (
                    <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 text-red-400 w-4 h-4" />
                  )}
                </div>
              )}

              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-pink-300 text-xs hover:underline block text-right w-full font-medium"
                >
                  Forgot password?
                </button>
              )}

              <button
                type="submit"
                disabled={!isLogin && (!isStrongEnough || !passwordsMatch)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-base py-3.5 md:py-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogin ? "Log In" : "Create Account"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-3xl border border-white/20 rounded-3xl w-full max-w-sm md:max-w-xs lg:max-w-sm p-8 shadow-3xl relative"
            onClick={(e) => e.stopPropagation()} // Stop backdrop clicks
          >
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-3 left-3 text-white/70 hover:text-white"
              type="button"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="text-center">
              <Image
                src="/logo-white.png"
                alt="SahmTicketHub"
                width={130}
                height={50}
                className="mx-auto mb-4"
                priority
              />

              <h2 className="text-2xl md:text-xl font-black text-white mb-2">Reset Password</h2>
              <p className="text-pink-200 text-xs mb-6">
                {emailSent
                  ? "Check your email for the reset link"
                  : "Enter your email and we’ll send you a reset link"}
              </p>

              {!emailSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="youremail@example.com"
                      className="w-full pl-10 pr-3 py-3 md:py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:border-purple-400 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-3 rounded-xl hover:scale-105 transition-all shadow-xl text-sm"
                  >
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="py-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-400" />
                  </div>
                  <p className="text-white font-bold text-lg">Email Sent!</p>
                  <p className="text-pink-200 text-xs mt-2">Check your inbox (and spam folder)</p>
                </div>
              )}

              <button
                onClick={() => setShowForgot(false)}
                className="mt-6 text-pink-300 hover:underline font-medium text-xs"
                type="button"
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
