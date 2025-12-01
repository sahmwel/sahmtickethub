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

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activePage, setActivePage] = useState("Analytics");

  useEffect(() => {
    // fetchAnalytics must be declared inside the effect
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/admin/api/analytics");
        const data: AnalyticsData = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <div className="p-8 text-xl">Loading analytics...</div>;

  const formatMillion = (num: number) => `₦${(num / 1_000_000).toFixed(1)}m`;

  const eventChartData = {
    labels: analytics.eventTitles,
    datasets: [
      {
        label: "Revenue per Event (₦M)",
        data: analytics.eventsRevenue.map((r) => r / 1_000_000),
        backgroundColor: "rgba(128, 90, 213, 0.7)",
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
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: false },
    },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <AdminSidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 lg:ml-80">
        <TopBar title={activePage} />

        <div className="p-8">
          <h1 className="text-4xl font-black mb-8">Analytics Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="bg-purple-600 text-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-5xl font-black">{formatMillion(analytics.totalRevenue)}</h3>
              <p className="text-xl mt-2">Total Revenue</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
              <h3 className="text-5xl font-black text-purple-600">{analytics.totalEvents}</h3>
              <p className="text-xl mt-2">Total Events</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
              <h3 className="text-5xl font-black text-pink-600">{analytics.totalTickets}</h3>
              <p className="text-xl mt-2">Total Tickets Sold</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
              <h3 className="text-5xl font-black text-pink-600">{formatMillion(analytics.avgRevenue)}</h3>
              <p className="text-xl mt-2">Avg Revenue per Event</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-purple-100 mb-12">
            <Bar
              data={eventChartData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: "Revenue per Event (₦M)" } },
              }}
            />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-purple-100">
            <Bar
              data={organizerChartData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: "Revenue per Organizer (₦M)" } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
