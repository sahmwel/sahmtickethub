'use client';

import React from "react";
import Image from "next/image";
import { Menu, Sparkles } from "lucide-react";

interface TopBarProps {
  title: string;
  onMenuClick?: () => void; // Optional, shows mobile menu button if provided
  logoSrc?: string;
  rightIcon?: React.ReactNode;
}

export default function TopBar({ title, onMenuClick, logoSrc = "/logo.png" }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-purple-100">
      <div className="flex items-center justify-between px-8 py-6">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-full hover:bg-purple-100 transition"
          >
            <Menu size={32} className="text-purple-600" />
          </button>
        )}

        {/* Title with Sparkles Icon */}
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />
          {title}
        </h1>

        {/* Logo */}
        <Image
          src={logoSrc}
          alt="Logo"
          width={48}
          height={48}
          className="rounded-full shadow-lg object-cover"
        />
      </div>
    </header>
  );
}
