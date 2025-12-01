'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Users, Ticket, Calendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  revenue: number;
  tickets_sold: number;
  date: string;
}

interface Organizer {
  id: string;
  name: string;
  email: string;
  events_count: number;
  total_tickets: number;
  revenue: number;
  events: Event[];
}

export default function AdminOrganizerDetails() {
  const router = useRouter();
  const pathname = usePathname(); // e.g., /admin/organizer/1
  const id = pathname.split("/").pop(); // get the last segment as id
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("organizers")
        .select("*, events:events(*)") // fetch organizer events too
        .eq("id", id)
        .single();

      if (error) {
        console.error(error.message);
      } else {
        const events: Event[] = data.events || [];
        const organizerData: Organizer = {
          id: data.id,
          name: data.name,
          email: data.email,
          events_count: events.length,
          total_tickets: events.reduce((acc, e) => acc + e.tickets_sold, 0),
          revenue: events.reduce((acc, e) => acc + e.revenue, 0),
          events,
        };
        setOrganizer(organizerData);
      }

      setLoading(false);
    };

    fetchOrganizer();
  }, [id]);

  const formatCurrency = (value: number) => `₦${(value / 1_000_000).toFixed(1)}m`;

  if (loading) return <p className="p-8 text-gray-600">Loading organizer...</p>;
  if (!organizer) return <p className="p-8 text-gray-600">Organizer not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-8">
      <h1 className="text-4xl font-black mb-6 text-gray-900">{organizer.name}</h1>

      {/* Organizer Stats */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 space-y-6 mb-8">
        <p className="text-gray-700">Email: {organizer.email}</p>
        <div className="flex flex-wrap gap-6 text-gray-600">
          <span className="flex items-center gap-2">
            <Users size={20} /> {organizer.events_count} events
          </span>
          <span className="flex items-center gap-2 font-bold text-purple-600">
            <Ticket size={20} /> {organizer.total_tickets} tickets
          </span>
          <span className="font-bold text-purple-600">{formatCurrency(organizer.revenue)}</span>
        </div>

        <button
          onClick={() => router.push(`/admin/organizer/${organizer.id}/edit`)}
          className="mt-4 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition"
        >
          Edit Organizer
        </button>
      </div>

      {/* Organizer Events Table */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Events</h2>
        {organizer.events.length === 0 ? (
          <p className="text-gray-600">No events created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tickets Sold</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {organizer.events.map((event) => (
                  <tr key={event.id} className="hover:bg-purple-50 transition cursor-pointer" onClick={() => router.push(`/admin/event/${event.id}`)}>
                    <td className="px-6 py-4 text-gray-900 font-medium">{event.title}</td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Calendar size={16} /> {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Ticket size={16} /> {event.tickets_sold}
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-600">{formatCurrency(event.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
