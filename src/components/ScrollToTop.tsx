// components/ScrollToTop.tsx
'use client';

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling just 300px (works even on short pages)
      setIsVisible(window.scrollY > 300);
    };

    // Run on mount + on every scroll
    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null; // Don't render anything when hidden

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-[9999] 
                 flex h-14 w-14 items-center justify-center rounded-full 
                 bg-gradient-to-r from-purple-600 to-pink-600 
                 text-white shadow-2xl shadow-purple-600/50 
                 ring-4 ring-white/20 backdrop-blur-xl
                 transition-all hover:scale-110 active:scale-95"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-7 w-7" strokeWidth={3} />
    </button>
  );
}