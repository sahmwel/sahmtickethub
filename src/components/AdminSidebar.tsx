"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, LogOut, Plus } from "lucide-react";
import Image from "next/image";
import { NavItem } from "@/types";

interface AdminSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  open: boolean;           // controlled by parent
  onClose: () => void;     // parent closes sidebar
  navItems: NavItem[];     // passed from parent
  onNavigate: (label: string, route: string) => void; // callback to parent
}

export default function AdminSidebar({
  activePage,
  setActivePage,
  open,
  onClose,
  navItems,
  onNavigate,
}: AdminSidebarProps) {
  const router = useRouter();

  const handleNavigation = (item: NavItem) => {
    setActivePage(item.label);
    onNavigate(item.label, item.route);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
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
        {open && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-purple-900 to-pink-900 text-white z-50 lg:relative lg:block"
          >
            <div className="flex flex-col h-full justify-between p-8">
              <div>
                {/* Logo + Close Button */}
                <div className="flex items-center justify-between mb-12">
                  <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                    TicketHub Admin
                  </h1>
                  <button onClick={onClose}>
                    <X size={28} className="text-white" />
                  </button>
                </div>

                {/* Large screen logo */}
                <div className="hidden lg:flex lg:items-center lg:justify-center py-6 mb-12">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="rounded-full shadow-lg"
                  />
                </div>

                {/* Add Organizer Button */}
                <button
                  onClick={() =>
                    handleNavigation({ label: "Add Organizer", route: "/admin/create-organizer" })
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:scale-105 transition shadow-2xl mb-12"
                >
                  <Plus size={28} /> Add Organizer
                </button>

                {/* Navigation */}
                <nav className="space-y-4">
                  {navItems.map((item) => (
                    <div
                      key={item.label}
                      onClick={() => handleNavigation(item)}
                      className={`flex items-center gap-4 py-4 px-6 rounded-xl cursor-pointer transition
                        ${activePage === item.label ? "bg-white/20" : "bg-white/10 hover:bg-white/20"}`}
                    >
                      {item.icon} {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Logout */}
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
    </>
  );
}
