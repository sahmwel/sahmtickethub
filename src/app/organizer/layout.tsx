'use client';

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  TrendingUp,
  Ticket,
  Menu,
  X,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: <TrendingUp size={22} />, route: "/organizer/dashboard" },
    { label: "My Events", icon: <Ticket size={22} />, route: "/organizer/events" },
    { label: "Attendees", icon: <Users size={22} />, route: "/organizer/attendees" },
    { label: "Analytics", icon: <Calendar size={22} />, route: "/organizer/analytics" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -260 }}
        animate={{ x: sidebarOpen ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-purple-900 to-pink-900 text-white z-50 lg:translate-x-0"
      >
        <div className="p-8 h-full flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                TicketHub
              </h1>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X size={26} className="text-white" />
              </button>
            </div>

            {/* Create event button */}
            <button
              onClick={() => router.push("/organizer/create-event-form")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold
              flex items-center justify-center gap-2 hover:scale-105 transition shadow-xl mb-10"
            >
              <Plus size={24} /> Create Event
            </button>

            {/* Nav */}
            <nav className="space-y-3">
              {navItems.map((item) => (
                <div
                  key={item.route}
                  onClick={() => {
                    router.push(item.route);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-4 py-4 px-6 rounded-xl cursor-pointer
                  transition backdrop-blur
                  ${pathname === item.route
                    ? "bg-white/20 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white/90"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <button
            onClick={() => router.push("/auth/login")}
            className="flex items-center gap-3 text-pink-200 hover:text-white transition"
          >
            <LogOut size={22} /> Logout
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:ml-72">

        {/* Top bar */}
        <div className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-purple-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={30} className="text-purple-700" />
            </button>

            {/* Page title with sparkles */}
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
              {navItems.find((i) => i.route === pathname)?.label || "Organizer"}
            </h2>

            {/* Logo */}
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-full shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-2xl hover:scale-105 transition transform">
            <h3 className="text-4xl font-black">₦0.0m</h3>
            <p className="text-pink-100 text-lg mt-2">Total Revenue</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 hover:scale-105 transition transform">
            <h3 className="text-4xl font-black text-purple-600">0</h3>
            <p className="text-gray-700 text-lg mt-2">Tickets Sold</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 hover:scale-105 transition transform">
            <h3 className="text-4xl font-black text-pink-600">0</h3>
            <p className="text-gray-700 text-lg mt-2">Active Events</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 hover:scale-105 transition transform">
            <h3 className="text-4xl font-black text-purple-600">0</h3>
            <p className="text-gray-700 text-lg mt-2">Analytics</p>
          </div>
        </div>

        {/* Page content */}
        <div className="pt-6">{children}</div>

      </div>
    </div>
  );
}
