'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, Ticket } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  tickets_sold: number;
  revenue: number;
  status: string;
  description?: string;
}

export default function AdminEventDetails() {
  const router = useRouter();
  const pathname = usePathname(); // e.g., /admin/event/1
  const id = pathname.split("/").pop(); // get the last segment as id
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error.message);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  const formatCurrency = (value: number) => `₦${(value / 1_000_000).toFixed(1)}m`;

  if (loading) return <p className="p-8 text-gray-600">Loading event...</p>;
  if (!event) return <p className="p-8 text-gray-600">Event not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-8">
      <h1 className="text-4xl font-black mb-6 text-gray-900">{event.title}</h1>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 space-y-6">
        <p className="text-gray-700">{event.description || "No description provided."}</p>

        <div className="flex flex-wrap gap-6 text-gray-600">
          <span className="flex items-center gap-2">
            <Calendar size={20} /> {new Date(event.date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-2">
            <Ticket size={20} /> {event.tickets_sold} sold
          </span>
          <span className="font-bold text-purple-600">{formatCurrency(event.revenue)}</span>
          <span className={`px-4 py-1 rounded-full font-bold text-white ${
            event.status === "Live" ? "bg-green-600" : "bg-gray-600"
          }`}>
            {event.status}
          </span>
        </div>

        <button
          onClick={() => router.push(`/admin/event/${event.id}/edit`)}
          className="mt-4 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition"
        >
          Edit Event
        </button>
      </div>
    </div>
  );
}
