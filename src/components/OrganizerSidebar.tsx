'use client';

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Calendar,
  Menu,
  X,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  route: string;
}

interface OrganizerSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarOpen: boolean;
  onClose: () => void;
}

export default function OrganizerSidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  onClose,
}: OrganizerSidebarProps) {
  const router = useRouter();

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: <Sparkles size={24} />, route: "/organizer/dashboard" },
    { label: "My Events", icon: <Ticket size={24} />, route: "/organizer/events" },
    { label: "Analytics", icon: <Calendar size={24} />, route: "/organizer/analytics" },
  ];

  const handleNavigation = (item: NavItem) => {
    setActivePage(item.label);
    router.push(item.route);
    onClose();
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-purple-900 to-pink-900 text-white z-50 lg:relative lg:block"
          >
            <div className="flex flex-col h-full justify-between p-8">
              <div>
                {/* Logo + Close Button */}
                <div className="flex items-center justify-between mb-12">
                  <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                    TicketHub
                  </h1>
                  <button onClick={onClose}>
                    <X size={28} className="text-white" />
                  </button>
                </div>

                {/* Add Event Button */}
                <button
                  onClick={() => router.push("/organizer/create-event")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:scale-105 transition shadow-2xl mb-12"
                >
                  <Plus size={28} /> Add Event
                </button>

                {/* Navigation */}
                <nav className="space-y-4">
                  {navItems.map((item) => (
                    <div
                      key={item.label}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNavigation(item)}
                      onKeyDown={(e) => e.key === "Enter" && handleNavigation(item)}
                      className={`flex items-center gap-4 py-4 px-6 rounded-xl cursor-pointer transition
                        ${activePage === item.label ? "bg-white/20" : "bg-white/10 hover:bg-white/20"}`}
                    >
                      {item.icon} {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center gap-3 text-pink-200 hover:text-white transition"
              >
                <LogOut size={24} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => onClose()} // toggle handled in parent
          className="fixed top-6 left-6 z-50 lg:hidden bg-white p-2 rounded-full shadow-lg"
        >
          <Menu size={28} className="text-purple-600" />
        </button>
      )}

      {/* Logo for large screens */}
      <div className="hidden lg:flex lg:items-center lg:justify-center py-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="rounded-full shadow-lg"
        />
      </div>
    </>
  );
}
