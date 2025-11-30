'use client';

import { useState } from "react";
import {
  Moon,
  Music,
  Headphones,
  Users,
  Waves,
  GraduationCap,
  Gift,
  Palette,
  Calendar,
  Clock,
} from "lucide-react";

const categories = [
  { name: "House Party", icon: Moon, color: "from-pink-500 to-rose-500" },
  { name: "Concert", icon: Music, color: "from-purple-500 to-pink-500" },
  { name: "Listening Party", icon: Headphones, color: "from-indigo-500 to-blue-500" },
  { name: "Meet and Greet", icon: Users, color: "from-amber-500 to-orange-500" },
  { name: "Pool Party", icon: Waves, color: "from-blue-500 to-cyan-500" },
  { name: "Workshop/Seminar", icon: GraduationCap, color: "from-indigo-500 to-purple-500" },
  { name: "Birthday Party", icon: Gift, color: "from-green-500 to-emerald-500" },
  { name: "Club Party", icon: Moon, color: "from-fuchsia-500 to-violet-500" },
  { name: "Themed Party", icon: Palette, color: "from-fuchsia-500 to-purple-500" },
  { name: "Beach Party", icon: Waves, color: "from-teal-500 to-green-500" },
] as const;

export default function CreateEventPage() {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState<"Free" | "Paid">("Free");
  const [ticketPrice, setTicketPrice] = useState<number>(0);

  return (
    <div className="min-h-screen bg-purple-50 py-16 px-6 md:px-12 lg:px-24">
      <h1 className="text-4xl font-black text-gray-900 mb-8">Create New Event</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT: Form */}
        <form className="space-y-6">
          {/* Event Name */}
          <div>
            <label className="block font-bold mb-2 text-gray-700">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter your event title"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold mb-2 text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event"
              rows={4}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2 text-gray-700 flex items-center gap-2">
                <Calendar size={18} /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-700 flex items-center gap-2">
                <Clock size={18} /> Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold mb-2 text-gray-700">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.name;

                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-2 p-3 rounded-xl font-bold text-white justify-center
                      ${cat.color.split(" ").map(c => `bg-gradient-to-r ${c}`).join(" ")}
                      ${isSelected ? "ring-4 ring-purple-500" : "opacity-80 hover:opacity-100"}
                    `}
                  >
                    <Icon size={20} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ticket Type */}
          <div>
            <label className="block font-bold mb-2 text-gray-700">Ticket Type</label>
            <div className="flex gap-4">
              {["Free", "Paid"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTicketType(type as "Free" | "Paid")}
                  className={`flex-1 py-3 rounded-xl font-bold ${
                    ticketType === type
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-purple-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {ticketType === "Paid" && (
              <div className="mt-4">
                <label className="block font-bold mb-2 text-gray-700">Ticket Price (₦)</label>
                <input
                  type="number"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(parseInt(e.target.value))}
                  placeholder="Enter price"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-purple-600 text-white font-black rounded-xl hover:scale-105 transition shadow-lg"
          >
            Create Event
          </button>
        </form>

        {/* RIGHT: Live Preview */}
        <div className="p-6 bg-white rounded-3xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Event Preview</h2>
          <p className="text-gray-600 mb-2"><strong>Event Name:</strong> {eventName || "Your Event Name"}</p>
          <p className="text-gray-600 mb-2"><strong>Description:</strong> {description || "Your event description..."}</p>
          <p className="text-gray-600 mb-2"><strong>Date:</strong> {date || "YYYY-MM-DD"}</p>
          <p className="text-gray-600 mb-2"><strong>Time:</strong> {time || "HH:MM"}</p>
          <p className="text-gray-600 mb-2">
            <strong>Category:</strong> {category || "Select a category"}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Ticket Type:</strong> {ticketType} {ticketType === "Paid" && `₦${ticketPrice}`}
          </p>
        </div>
      </div>
    </div>
  );
}
