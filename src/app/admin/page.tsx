"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

import AdminSidebar from "@/components/AdminSidebar";
import TopBar from "@/components/TopBar";
import { supabase } from "@/lib/supabaseClient";

// Types
interface Organizer {
  id: string;
  name: string;
  email: string;
  events?: number;
  revenue?: string;
}

interface Event {
  id: string;
  title: string;
  organizer_id: string;
  revenue: number;
}

interface NavItem {
  label: string;
  route: string;
  icon?: React.ReactNode; 
}

// AdminDashboard
export default function AdminDashboard() {
  const router = useRouter();

  // Sidebar & navigation state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  // Data state
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const navItems: NavItem[] = [
    { label: "Dashboard", route: "/admin/dashboard" },
    { label: "Organizers", route: "/admin/organizers" },
    { label: "All Events", route: "/admin/events" },
    { label: "Analytics", route: "/admin/analytics" },
  ];

  // Fetch organizers and events in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgResult, eventsResult] = await Promise.all([
          supabase.from<'organizers', Organizer>("organizers").select("*"),
          supabase.from<'events', Event>("events").select("*")
        ]);

        const orgData = orgResult.data || [];
        const eventsData = eventsResult.data || [];

        // Update events stats
        setEventsCount(eventsData.length);
        setTotalRevenue(eventsData.reduce((acc, e) => acc + (e.revenue || 0), 0));

        // Enrich organizers
        const enrichedOrganizers = orgData.map(org => {
          const orgEvents = eventsData.filter(e => e.organizer_id === org.id);
          const orgRevenue = orgEvents.reduce((sum, e) => sum + (e.revenue || 0), 0);

          return {
            ...org,
            events: orgEvents.length,
            revenue: `₦${(orgRevenue / 1_000_000).toFixed(1)}m`,
          };
        });

        setOrganizers(enrichedOrganizers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (label: string, route: string) => {
    setActivePage(label);
    router.push(route);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex">
      {/* Sidebar */}
    <AdminSidebar
  activePage={activePage}
  setActivePage={setActivePage}
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  navItems={navItems}
  onNavigate={handleNavigation}
/>


      {/* Main Content */}
      <div className="flex-1">
        <TopBar title={activePage} onMenuClick={() => setSidebarOpen(prev => !prev)} />

        {/* Stats Cards */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl hover:scale-105 transition transform">
            <h3 className="text-5xl font-black">₦{(totalRevenue / 1_000_000).toFixed(1)}m</h3>
            <p className="text-pink-100 text-xl mt-2">Total Revenue</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100 hover:scale-105 transition transform">
            <h3 className="text-5xl font-black text-purple-600">{organizers.length}</h3>
            <p className="text-gray-700 text-xl mt-2">Active Organizers</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100 hover:scale-105 transition transform">
            <h3 className="text-5xl font-black text-pink-600">{eventsCount}</h3>
            <p className="text-gray-700 text-xl mt-2">Events Managed</p>
          </div>
        </div>

        {/* Organizers List */}
        <div className="px-8 pb-20">
          <h2 className="text-4xl font-black mb-8 text-gray-900">Organizers</h2>

          {organizers.length > 0 ? (
            <div className="space-y-6">
              {organizers.map(org => (
                <motion.div
                  key={org.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 flex items-center justify-between cursor-pointer hover:shadow-2xl transition"
                  onClick={() => router.push(`/admin/organizer/${org.id}`)}
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{org.name}</h3>
                    <p className="text-gray-600">{org.email}</p>
                    <p className="text-gray-700 mt-2">
                      {org.events} events • {org.revenue}
                    </p>
                  </div>
                  <div className="px-6 py-3 rounded-full font-bold text-white bg-purple-600">
                    Manage
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Shield className="w-24 h-24 text-purple-300 mx-auto mb-8" />
              <h3 className="text-3xl font-black text-gray-900 mb-4">No organizers yet</h3>
              <p className="text-xl text-gray-600">Add your first organizer to start managing events!</p>
              <button
                onClick={() => router.push("/admin/create-organizer")}
                className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:scale-105 transition shadow-2xl"
              >
                Add Organizer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
