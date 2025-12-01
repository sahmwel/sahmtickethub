'use client';

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

interface AnalyticsData {
  month: string;
  revenue: number;
  tickets: number;
}

const formatCurrency = (value: number) => `₦${(value / 1_000_000).toFixed(1)}m`;

export default function OrganizerAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/organizer/analytics');
        const json = await res.json();

        // Example response expected:
        // [{ month: 'Jan', revenue: 12000000, tickets: 120 }, ...]
        setData(json);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Loading analytics...</div>;
  }

  const totalRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
  const totalTickets = data.reduce((acc, d) => acc + d.tickets, 0);

  return (
    <div className="px-8 pb-20">
      <h1 className="text-4xl font-black text-gray-900 mb-6">Analytics Overview</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-purple-600 text-white rounded-3xl p-6 shadow-2xl hover:scale-105 transition transform">
          <h2 className="text-3xl font-bold">{formatCurrency(totalRevenue)}</h2>
          <p className="mt-2 text-pink-100">Total Revenue</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 hover:scale-105 transition transform">
          <h2 className="text-3xl font-bold text-purple-600">{totalTickets}</h2>
          <p className="mt-2 text-gray-700">Tickets Sold</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 hover:scale-105 transition transform">
          <h2 className="text-3xl font-bold text-pink-600">{data.length}</h2>
          <p className="mt-2 text-gray-700">Active Months</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 hover:scale-105 transition transform">
          <h2 className="text-3xl font-bold text-purple-600">{Math.max(...data.map(d => d.tickets))}</h2>
          <p className="mt-2 text-gray-700">Most Tickets Sold</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 border border-purple-100 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tickets Chart */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 border border-purple-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Tickets Sold</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tickets" name="Tickets Sold" stroke="#ec4899" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
