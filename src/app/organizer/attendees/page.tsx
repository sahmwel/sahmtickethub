'use client';

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendees() {
      const res = await fetch("/organizer/api/attendees");
      const data = await res.json();
      setAttendees(data);
      setLoading(false);
    }
    loadAttendees();
  }, []);

  if (loading)
    return <div className="p-8 text-2xl font-bold text-gray-600">Loading attendees...</div>;

  return (
    <div className="p-8 pb-20">
      <h2 className="text-4xl font-black mb-10 text-gray-900">Attendees</h2>

      {attendees.length === 0 ? (
        <p className="text-gray-600 text-xl">No attendees yet.</p>
      ) : (
        <div className="space-y-6">
          {attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="bg-white p-8 rounded-3xl border shadow-xl"
            >
              <h3 className="text-2xl font-black">
                {attendee.fullname}
              </h3>

              <p className="text-gray-700 mt-2">{attendee.email}</p>

              <div className="flex items-center gap-4 mt-4 text-gray-700">
                <Users /> {attendee.ticket_type} – {attendee.quantity} tickets
              </div>

              <p className="font-bold text-purple-600 mt-4">
                ₦{attendee.total_price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
