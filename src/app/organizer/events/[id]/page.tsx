'use client';

import { useEffect, useState } from "react";
import { Calendar, Ticket, Users, TrendingUp } from "lucide-react";

export default function EventDetailsPage({ params }: any) {
  const { id } = params;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      const res = await fetch(`/organizer/api/events?id=${id}`);
      const data = await res.json();
      setEvent(data);
      setLoading(false);
    }
    loadEvent();
  }, [id]);

  if (loading) return <div className="p-8 text-xl">Loading...</div>;

  if (!event)
    return <div className="p-8 text-xl text-red-500">Event not found.</div>;

  return (
    <div className="p-10">
      <h1 className="text-5xl font-black mb-6">{event.title}</h1>

      <div className="flex items-center gap-4 text-gray-700 text-xl mb-10">
        <Calendar /> {event.date}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-purple-600 text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-4xl font-black">{event.revenue}</h2>
          <p className="text-purple-200 text-xl">Revenue</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-xl">
          <h2 className="text-4xl font-black text-purple-600">
            {event.ticket_sold}
          </h2>
          <p className="text-gray-700 text-xl">Tickets Sold</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-xl">
          <h2 className="text-4xl font-black text-pink-600">{event.attendees}</h2>
          <p className="text-gray-700 text-xl">Attendees</p>
        </div>
      </div>
    </div>
  );
}
