"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, LogOut, Plus } from "lucide-react";
import Image from "next/image";

// Define the NavItem type once — used by both sidebar and pages
export type NavItem = {
  label: string;
  route: string;
  icon?: React.ReactNode; // optional icon (you can add later)
};

interface AdminSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  onNavigate: (label: string, route: string) => void;
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
      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative inset-y-0 left-0 w-80 bg-gradient-to-b from-purple-900 via-purple-800 to-pink-900 text-white z-50 flex flex-col"
          >
            <div className="flex flex-col h-full justify-between p-8">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
                    TicketHub
                  </h1>
                  <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* Logo (desktop) */}
                <div className="hidden lg:flex justify-center mb-12">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Image
                      src="/logo.png"
                      alt="TicketHub Logo"
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </div>
                </div>

                {/* Add Organizer Button */}
                <button
                  onClick={() =>
                    handleNavigation({ label: "Add Organizer", route: "/admin/organizers/create" })
                  }
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl transform hover:scale-105 transition mb-10"
                >
                  <Plus size={28} />
                  Add Organizer
                </button>

                {/* Navigation */}
                <nav className="space-y-3">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item)}
                      className={`
                        w-full flex items-center gap-4 py-4 px-6 rounded-2xl text-left
                        transition-all duration-200 transform hover:scale-105
                        ${activePage === item.label
                          ? "bg-white/25 shadow-lg font-semibold"
                          : "hover:bg-white/15"
                        }
                      `}
                    >
                      {item.icon && <span className="text-xl">{item.icon}</span>}
                      <span className="text-lg">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Logout */}
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center gap-3 py-4 px-6 rounded-xl hover:bg-white/15 transition text-pink-200 hover:text-white"
              >
                <LogOut size={24} />
                <span className="text-lg">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}