'use client';

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AdminSidebar from "@/components/AdminSidebar";
import TopBar from "@/components/TopBar";

// Register ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type AnalyticsData = {
  totalRevenue: number;
  totalEvents: number;
  totalTickets: number;
  avgRevenue: number;
  eventTitles: string[];
  eventsRevenue: number[];
  organizersRevenue: { name: string; revenue: number }[];
};

// FIXED: Removed `as const` → no more readonly error
const navItems = [
  { label: "Dashboard", route: "/admin" },
  { label: "Events", route: "/admin/events" },
  { label: "Organizers", route: "/admin/organizers" },
  { label: "Analytics", route: "/admin/analytics" },
  { label: "Users", route: "/admin/users" },
  { label: "Settings", route: "/admin/settings" },
];

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activePage, setActivePage] = useState("Analytics");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/admin/api/analytics");
        if (!res.ok) throw new Error("Failed to load analytics");
        const data: AnalyticsData = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      }
    };
    fetchAnalytics();
  }, []);

  const formatMillion = (num: number) => `₦${(num / 1_000_000).toFixed(1)}m`;

  if (!analytics) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <AdminSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navItems={navItems}
          onNavigate={(label) => {
            setActivePage(label);
            setSidebarOpen(false);
          }}
        />
        <div className="flex-1 lg:ml-80">
          <TopBar title="Analytics" onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-8">
            <p className="text-2xl text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  const eventChartData = {
    labels: analytics.eventTitles,
    datasets: [
      {
        label: "Revenue per Event (₦M)",
        data: analytics.eventsRevenue.map((r) => r / 1_000_000),
        backgroundColor: "rgba(128, 90, 213, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const organizerChartData = {
    labels: analytics.organizersRevenue.map((o) => o.name),
    datasets: [
      {
        label: "Revenue per Organizer (₦M)",
        data: analytics.organizersRevenue.map((o) => o.revenue / 1_000_000),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        onNavigate={(label) => {
          setActivePage(label);
          setSidebarOpen(false);
        }}
      />

      <div className="flex-1 lg:ml-80 transition-all duration-300">
        <TopBar title={activePage} onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-6 lg:p-10">
          <h1 className="text-4xl lg:text-5xl font-black mb-10 text-gray-900">
            Analytics Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-purple-600 text-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition">
              <h3 className="text-5xl font-black">{formatMillion(analytics.totalRevenue)}</h3>
              <p className="text-xl mt-2 opacity-90">Total Revenue</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
              <h3 className="text-5xl font-black text-purple-600">{analytics.totalEvents}</h3>
              <p className="text-xl mt-2 text-gray-700">Total Events</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-pink-100">
              <h3 className="text-5xl font-black text-pink-600">{analytics.totalTickets}</h3>
              <p className="text-xl mt-2 text-gray-700">Tickets Sold</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-rose-100">
              <h3 className="text-5xl font-black text-rose-600">{formatMillion(analytics.avgRevenue)}</h3>
              <p className="text-xl mt-2 text-gray-700">Avg per Event</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-purple-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Revenue by Event</h2>
              <div className="h-96">
                <Bar
                  data={eventChartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: { display: true, text: "Revenue per Event (₦M)" },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-purple-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Revenue by Organizer</h2>
              <div className="h-96">
                <Bar
                  data={organizerChartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: { display: true, text: "Revenue per Organizer (₦M)" },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}