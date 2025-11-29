"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import DynamicMap, { KADUNA_DEFAULT } from "@/components/DynamicMap";
import {
  Calendar, MapPin, Flame, MapPinned, List, Ticket,
  Music, Headphones, Users, Waves, GraduationCap, Gift, Moon, Palette,
  Star, BadgeCheck, Sparkles, Clock, ChevronLeft, ChevronRight
} from "lucide-react";

import { events as realEvents } from "@/components/data/events";

// SLUG GENERATOR
const generateSlug = (title: string) =>
  title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// CATEGORIES
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

// BADGES
const badgeConfig = {
  featured: { gradient: "from-purple-500 to-pink-600", icon: Star, text: "FEATURED" },
  trending: { gradient: "from-orange-500 to-red-600", icon: Flame, text: "TRENDING" },
  new: { gradient: "from-emerald-500 to-teal-600", icon: Sparkles, text: "NEW" },
  sponsored: { gradient: "from-blue-500 to-cyan-600", icon: BadgeCheck, text: "SPONSORED" },
} as const;



// ✅ Add this line — it fixes the error
type BadgeVariant = keyof typeof badgeConfig;

const Badge = ({ variant }: { variant: BadgeVariant }) => {
  const { gradient, icon: Icon, text } = badgeConfig[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black text-white bg-gradient-to-r ${gradient} shadow-lg`}>
      <Icon className="w-4 h-4" />
      {text}
    </span>
  );
};


interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time?: string;
  price: string;
  image: string;
  badge?: string;
  category: string;
  venue: string;
  city: string;
  coords: [number, number];
}

// EVENT CARD — GLASSY & PREMIUM
const EventCard = ({ event, highlightToday }: { event: EventItem; highlightToday?: boolean }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ scale: 1.03, y: -6 }}
    whileTap={{ scale: 0.97 }}
    className={`group relative bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl flex flex-col h-full transition-all duration-300 ${
      highlightToday ? "ring-4 ring-purple-500/40 shadow-purple-500/30" : ""
    }`}
  >
    <Link href={`/event/${event.slug}`} prefetch className="flex flex-col h-full">
      <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-[26rem] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {event.badge && <Badge variant={event.badge.toLowerCase() as BadgeVariant} />}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <h3 className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight line-clamp-2">
          {event.title}
        </h3>

        <div className="text-xs md:text-sm text-gray-700 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" />
            <span className="font-medium">{new Date(event.date).toDateString()}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-600" />
              <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-purple-600" />
            <span>{event.venue}, {event.city}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-600/50 transition"
        >
          <Ticket size={22} />
          Get Ticket • {event.price}
        </motion.button>
      </div>
    </Link>
  </motion.article>
);

// HAVERSINE DISTANCE
const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

interface CarouselProps {
  title: string;
  events: EventItem[];
  highlightTodayEvents?: boolean;
  subtitle?: string;
  fullWidth?: boolean;
}

// FINAL CAROUSEL — FEATURED HAS "GET TICKET" GRADIENT BACKGROUND
const CarouselSection = ({
  title,
  events,
  highlightTodayEvents,
  subtitle,
  fullWidth
}: CarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);
  if (!events.length) return null;
  const isTodayOrTomorrow = title === "Today" || title === "Tomorrow";
  const isFeatured = title === "Featured Event";

  return (
    <section className={`mb-20 px-4 md:px-6 ${isTodayOrTomorrow ? "pt-8 -mt-8" : ""}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`font-black text-gray-900 ${isTodayOrTomorrow ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`mt-2 ${isTodayOrTomorrow ? "text-2xl font-bold text-purple-600" : "text-gray-600"}`}>
              {subtitle}
            </p>
          )}
        </div>

        {events.length > 1 && (
          <div className="hidden md:flex items-center gap-3 z-10">
            <button
              onClick={() => ref.current?.scrollBy({ left: -500, behavior: "smooth" })}
              className="p-3 bg-white/90 backdrop-blur rounded-full shadow-xl hover:scale-110 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => ref.current?.scrollBy({ left: 500, behavior: "smooth" })}
              className="p-3 bg-white/90 backdrop-blur rounded-full shadow-xl hover:scale-110 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* FEATURED CAROUSEL — GET TICKET GRADIENT BACKGROUND */}
      {isFeatured ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 p-1 shadow-2xl">
          <div className="bg-gradient-to-br from-purple-50/95 via-pink-50/95 to-rose-50/95 backdrop-blur-xl rounded-3xl">
            <div
              ref={ref}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-6 pt-6 pb-8"
            >
              {events.map((event: EventItem) => (
                <div key={event.id} className="flex-shrink-0 snap-start w-full">
                  <EventCard event={event} highlightToday={highlightTodayEvents} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* NORMAL CAROUSELS */
        <div
          ref={ref}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-6"
        >
          {events.map((event: EventItem) => (
            <div
              key={event.id}
              className={`flex-shrink-0 snap-start ${
                fullWidth ? "w-full" : "w-full sm:w-80 md:w-96 lg:w-[28rem]"
              }`}
            >
              <EventCard event={event} highlightToday={highlightTodayEvents} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// MAIN PAGE — FULLY UPGRADED
export default function EventsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // Fail silently — the default is already set
      }
    );
  }
}, []);

 const eventsWithSlug: EventItem[] = useMemo(
  () =>
    realEvents.map((e) => ({
      id: e.id,
      title: e.title,
      slug: generateSlug(e.title),
      date: e.date,
      time: e.time,
      price: e.price ?? "Free",  // ✅ default to "Free" if undefined
      image: e.image,
      badge: e.featured
        ? "featured"
        : e.trending
        ? "trending"
        : e.isNew
        ? "new"
        : e.sponsored
        ? "sponsored"
        : undefined,
      category: e.category,
      venue: e.venue || e.location || "Unknown Venue",
      city: e.state || "Lagos",
      coords: [e.lat || KADUNA_DEFAULT[0], e.lng || KADUNA_DEFAULT[1]],
    })),
  []
);


  const filteredEvents = useMemo(
    () =>
      selectedCategory === "All"
        ? eventsWithSlug
        : eventsWithSlug.filter((e) => e.category === selectedCategory),
    [selectedCategory, eventsWithSlug]
  );

  const featuredEvents = filteredEvents.filter((e) => e.badge === "featured");
  const trendingEvents = filteredEvents.filter((e) => e.badge === "trending");
  const newEvents = filteredEvents.filter((e) => e.badge === "new");
  const sponsoredEvents = filteredEvents.filter((e) => e.badge === "sponsored");

  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

  const todayEvents = filteredEvents.filter(
    (e) => new Date(e.date).toDateString() === today.toDateString()
  );
  const tomorrowEvents = filteredEvents.filter(
    (e) => new Date(e.date).toDateString() === tomorrow.toDateString()
  );
  const dayAfterEvents = filteredEvents.filter(
    (e) => new Date(e.date).toDateString() === dayAfter.toDateString()
  );

  const nearYouEvents = useMemo(() => {
    if (!userLocation) return [];
    return filteredEvents.filter(
      (e) =>
        getDistanceKm(userLocation[0], userLocation[1], e.coords[0], e.coords[1]) <= 50
    );
  }, [filteredEvents, userLocation]);

  const goToEvent = (slug: string) => router.push(`/event/${slug}`);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
            Discover Events<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Around You
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mt-4">Hottest vibes in Nigeria</p>
        </motion.div>

        {featuredEvents.length > 0 && (
          <CarouselSection title="Featured Event" events={featuredEvents} fullWidth subtitle="This one’s special" />
        )}

        <div className="flex justify-center gap-6 mb-12">
          <button onClick={() => setViewMode("list")} className={`px-8 py-4 rounded-3xl font-black text-lg shadow-2xl transition-all ${viewMode === "list" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white"}`}>
            <List className="inline w-7 h-7 mr-3" /> List
          </button>
          <button onClick={() => setViewMode("map")} className={`px-8 py-4 rounded-3xl font-black text-lg shadow-2xl transition-all ${viewMode === "map" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white"}`}>
            <MapPinned className="inline w-7 h-7 mr-3" /> Map
          </button>
        </div>

        <div className="mb-12 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4">
            <button onClick={() => setSelectedCategory("All")} className={`px-8 py-4 rounded-3xl font-black text-lg whitespace-nowrap transition-all ${selectedCategory === "All" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl" : "bg-white shadow-lg"}`}>
              All Events
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button key={cat.name} onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black text-lg whitespace-nowrap transition-all ${selectedCategory === cat.name ? `bg-gradient-to-r ${cat.color} text-white shadow-2xl` : "bg-white shadow-lg"}`}
                >
                  <Icon className="w-7 h-7" /> {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <CarouselSection title="Today" events={todayEvents} subtitle="Live right now" highlightTodayEvents />
        <CarouselSection title="Tomorrow" events={tomorrowEvents} subtitle="Lock it in" />
        <CarouselSection title="This Weekend" events={dayAfterEvents} subtitle="Weekend turn up" />

        <CarouselSection title="Trending Now" events={trendingEvents} subtitle="Everyone’s talking" />
        <CarouselSection title="Fresh Drops" events={newEvents} subtitle="Just added" />
        <CarouselSection title="Sponsored" events={sponsoredEvents} subtitle="Promoted events" />
        <CarouselSection title="Near You" events={nearYouEvents} subtitle="Within 50km" />

        {viewMode === "map" && userLocation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-96 md:h-[70vh] rounded-3xl overflow-hidden shadow-2xl mt-16">
            <DynamicMap center={userLocation} events={filteredEvents} goToEvent={goToEvent} />
          </motion.div>
        )}
      </div>
    </main>
  );
}