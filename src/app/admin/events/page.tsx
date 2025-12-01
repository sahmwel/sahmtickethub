'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Ticket, Calendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  tickets_sold: number;
  revenue: number;
  status: string;
}

export default function AdminEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // define async function inside effect
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("events").select("*");
      if (error) {
        console.error(error.message);
      } else {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents(); // call it
  }, []); // run once on mount

  const formatCurrency = (value: number) => `₦${(value / 1_000_000).toFixed(1)}m`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-8">
      <h1 className="text-4xl font-black mb-8 text-gray-900">All Events</h1>

      {loading ? (
        <p className="text-xl text-gray-600">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-xl text-gray-600">No events found.</p>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 flex items-center justify-between cursor-pointer hover:shadow-2xl transition"
              onClick={() => router.push(`/admin/event/${event.id}`)}
            >
              <div>
                <h2 className="text-2xl font-black text-gray-900">{event.title}</h2>
                <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <Calendar size={20} /> {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2">
                    <Ticket size={20} /> {event.tickets_sold} sold
                  </span>
                  <span className="font-bold text-purple-600">{formatCurrency(event.revenue)}</span>
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
      )}
    </div>
  );
}
