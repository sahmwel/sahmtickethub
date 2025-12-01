'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadEvents() {
      const res = await fetch("/organizer/api/events");
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-2xl font-bold text-gray-600">Loading events...</div>
    );

  return (
    <div className="p-8 pb-20">
      <h2 className="text-4xl font-black mb-10 text-gray-900">My Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-600 text-xl">You have not created any events yet.</p>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/organizer/events/${event.id}`)}
              className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100 cursor-pointer hover:shadow-2xl transition"
            >
              <h3 className="text-2xl font-black">{event.title}</h3>

              <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar size={20} /> {event.date}
                </span>

                <span className="flex items-center gap-2">
                  <Ticket size={20} /> {event.total_tickets || 0} sold
                </span>

                <span className="font-bold text-purple-600">
                  ₦{(event.revenue / 1_000_000).toFixed(1)}m
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
