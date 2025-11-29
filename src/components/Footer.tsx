// src/components/Footer.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Send } from "lucide-react";
import { SiInstagram, SiX, SiWhatsapp } from "@icons-pack/react-simple-icons";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    // Replace with your actual API endpoint later
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Added smooth scroll to top on success
      setTimeout(() => setStatus("idle"), 4000);
    }, 1200);
  };

  return (
    <footer className="bg-gradient-to-t from-purple-950 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16"> {/* Further reduced padding for smaller height */}

        {/* Logo + Tagline */}
        <div className="text-center mb-12 md:mb-16"> {/* Reduced margin */}
          <div className="relative inline-block group">
            <Image
              src="/logo-white.png"
              alt="SahmTicketHub"
              width={160}   // Reduced size for smaller logo
              height={160}  // Reduced size for smaller logo
              className="mx-auto drop-shadow-2xl transition-all duration-700 group-hover:scale-110"
              priority
            />

            <div className="absolute -inset-8 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-full blur-3xl opacity-50 group-hover:opacity-90 scale-75 group-hover:scale-125 transition-all duration-1000 -z-10" /> {/* Reduced glow inset */}
          </div>
          <p className="mt-6 text-pink-100 text-base md:text-xl font-medium"> {/* Reduced margin & size */}
            Nigeria’s most beautiful way to discover and create events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12"> {/* Reduced gaps */}

          {/* Explore */}
          <div>
            <h3 className="text-xl font-bold mb-4">Explore</h3> {/* Reduced size & margin */}
            <ul className="space-y-3 text-pink-200"> {/* Reduced spacing */}
              <li><Link href="/events" className="hover:text-white transition">All Events</Link></li>
              <li><Link href="/create-event" className="hover:text-white transition">Create Event</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          {/* Support + FAQ */}
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3> {/* Reduced size & margin */}
            <ul className="space-y-3 text-pink-200"> {/* Reduced spacing */}
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition font-medium">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="hover:text-white transition">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3> {/* Reduced size & margin */}
            <div className="space-y-4 text-pink-200 mb-6"> {/* Reduced spacing & margin */}
              <a href="mailto:info@sahmtickethub.online" className="flex items-center gap-3 hover:text-white transition">
                <Mail size={18} /> info@sahmtickethub.online
              </a>
              <a href="tel:+2347035651109" className="flex items-center gap-3 hover:text-white transition">
                <Phone size={18} /> +234 703 565 1109
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4"> {/* Reduced gap */}
              <a href="https://instagram.com/sahmtickethub" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all duration-300 group shadow-lg"> {/* Reduced size */}
                <SiInstagram size={20} className="group-hover:scale-110 transition" /> {/* Reduced icon size */}
              </a>
              <a href="https://x.com/sahmtickethub" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group shadow-lg"> {/* Reduced size */}
                <SiX size={20} className="group-hover:scale-110 transition" /> {/* Reduced icon size */}
              </a>
              <a href="https://wa.me/2347035651109" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 transition-all duration-300 group shadow-lg"> {/* Reduced size */}
                <SiWhatsapp size={20} className="group-hover:scale-110 transition" /> {/* Reduced icon size */}
              </a>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3> {/* Reduced size & margin */}
            <p className="text-pink-200 mb-4 text-sm"> {/* Reduced margin & size */}
              Get exclusive event alerts, early tickets & secret parties in your city.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3"> {/* Reduced spacing */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-4 h-4" /> {/* Reduced size */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:border-white/50 transition" 
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-70" 
              >
                {status === "loading" ? (
                  "Subscribing..."
                ) : status === "success" ? (
                  "Subscribed!"
                ) : (
                  <>
                    Subscribe Now <Send size={18} /> {/* Reduced icon size */}
                  </>
                )}
              </button>

              {status === "success" && (
                <p className="text-emerald-300 text-xs text-center animate-pulse"> {/* Reduced size */}
                  Welcome to the party!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center"> {/* Reduced margins */}
          <p className="text-pink-200 text-xs font-medium"> {/* Reduced size */}
            © 2025 <span className="text-white font-bold">SahmTicketHub</span> • Made with love in Kaduna, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}