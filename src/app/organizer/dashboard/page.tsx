'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Ticket } from "lucide-react";

import OrganizerSidebar from "@/components/OrganizerSidebar";
import TopBar from "@/components/TopBar";

interface Event {
  id: string;
  title: string;
  date: string;
  ticket_sold: number;
  revenue: number;
  status: string;
}

interface Analytics {
  totalRevenue: number;
  totalTickets: number;
  totalEvents: number;
  avgRevenue: number;
}

const formatCurrency = (value: number) =>
  `₦${(value / 1_000_000).toFixed(1)}m`;

export default function OrganizerDashboard() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    totalTickets: 0,
    totalEvents: 0,
    avgRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsRes, analyticsRes] = await Promise.all([
          fetch("/organizer/api/events"),
          fetch("/organizer/api/analytics"),
        ]);

        const eventsData = await eventsRes.json();
        const analyticsData = await analyticsRes.json();

        setEvents(eventsData);
        setAnalytics(analyticsData);
      } catch (e) {
        console.error("Failed to load dashboard:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="pt-24 lg:pt-28 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      
      {/* Sidebar */}
      <OrganizerSidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage="Dashboard"
        setActivePage={() => {}}
      />

      {/* MAIN CONTENT */}
      <div className="lg:ml-80">
        
        {/* Top Bar */}
        <TopBar
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
          rightIcon={<Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />}
        />

        {/* STATS */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-5xl font-black">{formatCurrency(analytics.totalRevenue)}</h3>
            <p className="text-pink-100 text-xl mt-2">Total Revenue</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
            <h3 className="text-5xl font-black text-purple-600">{analytics.totalTickets}</h3>
            <p className="text-gray-700 text-xl mt-2">Tickets Sold</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
            <h3 className="text-5xl font-black text-pink-600">{analytics.totalEvents}</h3>
            <p className="text-gray-700 text-xl mt-2">Total Events</p>
          </div>
        </div>

        {/* EVENT LIST */}
        <div className="px-8 pb-20">
          <h2 className="text-4xl font-black mb-8 text-gray-900">Your Events</h2>

          {loading ? (
            <p className="text-xl text-gray-600">Loading...</p>
          ) : events.length > 0 ? (
            <div className="space-y-6">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push(`/organizer/events/${event.id}`)}
                  className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 flex items-center justify-between cursor-pointer hover:shadow-2xl transition"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{event.title}</h3>

                    <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600">
                      <span className="flex items-center gap-2">
                        <Calendar size={20} /> {event.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Ticket size={20} /> {event.ticket_sold} sold
                      </span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(event.revenue)}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`px-6 py-3 rounded-full font-bold text-white ${
                      event.status === "Live" ? "bg-green-600" : "bg-gray-600"
                    }`}
                  >
                    {event.status}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Sparkles className="w-24 h-24 text-purple-300 mx-auto mb-8" />
              <h3 className="text-3xl font-black text-gray-900 mb-4">No events yet</h3>
              <p className="text-xl text-gray-600">Create your first event!</p>
              <button
                onClick={() => router.push("/organizer/create-event")}
                className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:scale-105 transition shadow-2xl"
              >
                Create Event Now
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
