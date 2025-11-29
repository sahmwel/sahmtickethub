// src/components/Navbar.tsx
'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Move NavLink OUTSIDE Navbar — this fixes the error!
const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="relative text-lg font-semibold text-white/90 
               transition-all duration-300 
               hover:text-white 
               focus-visible:text-white 
               focus-visible:outline-none
               after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
               after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 
               after:transition-all after:duration-500
               hover:after:w-full 
               focus-visible:after:w-full"
  >
    {children}
  </Link>
);

// Now Navbar is clean and safe
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">

          <Link href="/" className="group -my-10 md:-my-12 lg:-my-14">
            <div className="relative">
              <Image
                src="/logo-white.png"
                alt="SahmTicketHub"
                width={176}
                height={176}
                className="h-28 md:h-36 lg:h-44 w-auto object-contain 
                           drop-shadow-2xl 
                           transition-all duration-500 
                           group-hover:scale-110"
                priority
              />
              <div className="absolute -inset-12 md:-inset-16 
                              bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-rose-600/50 
                              rounded-full blur-3xl opacity-60 
                              group-hover:opacity-100 
                              transition-all duration-700 -z-10" />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <NavLink href="/events">Events</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/privacy">Privacy</NavLink>
          </div>

          <div className="hidden lg:block">
            <Link
              href="/create-event"
              className="bg-gradient-to-r from-purple-600 to-pink-600 
                         hover:from-purple-500 hover:to-pink-500
                         text-white font-bold px-8 py-3.5 rounded-full 
                         shadow-xl hover:shadow-purple-500/50 
                         flex items-center gap-3 text-base 
                         transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
              Create Event
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-3 rounded-xl hover:bg-white/10 transition z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </nav>

    {/* MOBILE MENU – Full-width links, perfect spacing, premium feel */}
<motion.div
  initial={false}
  animate={{
    y: isOpen ? 0 : -30,
    opacity: isOpen ? 1 : 0,
  }}
  transition={{ duration: 0.45, ease: "easeOut" }}
  className={`fixed inset-x-0 top-16 lg:hidden z-40 h-[calc(100dvh-64px)] 
              ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
>
  <div className="absolute inset-0 bg-black/70 backdrop-blur-3xl" />

  <div className="relative z-10 flex flex-col pt-10 px-8">
    {/* Full-width links with perfect spacing */}
    <NavLink href="/events" onClick={() => setIsOpen(false)}>
      <span className="block w-full py-5 text-2xl font-medium text-white/90 hover:text-white text-center">
        Events
      </span>
    </NavLink>
    <NavLink href="/about" onClick={() => setIsOpen(false)}>
      <span className="block w-full py-5 text-2xl font-medium text-white/90 hover:text-white text-center">
        About
      </span>
    </NavLink>
    <NavLink href="/contact" onClick={() => setIsOpen(false)}>
      <span className="block w-full py-5 text-2xl font-medium text-white/90 hover:text-white text-center">
        Contact
      </span>
    </NavLink>
    <NavLink href="/privacy" onClick={() => setIsOpen(false)}>
      <span className="block w-full py-5 text-2xl font-medium text-white/90 hover:text-white text-center">
        Privacy
      </span>
    </NavLink>

    {/* Full-width CTA button */}
    <Link
      href="/create-event"
      onClick={() => setIsOpen(false)}
      className="mt-12 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 
                 hover:from-purple-500 hover:to-pink-500
                 text-white font-bold text-lg 
                 px-16 py-5 rounded-2xl 
                 shadow-2xl hover:shadow-purple-600/70 
                 flex items-center justify-center gap-3 
                 transition-all duration-300 
                 hover:scale-105 active:scale-95"
    >
      <Plus className="w-7 h-7" strokeWidth={2.5} />
      Create Event
    </Link>
  </div>
</motion.div>

      <div className="h-16 md:h-20 lg:h-24" />
    </>
  );
}