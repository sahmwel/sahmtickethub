'use client';

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Calendar, MapPin, Ticket, Sparkles, Flame, Star, Plus, Car, Navigation, BadgeCheck, Clock, ChevronLeft, ChevronRight } from "lucide-react";

import { events as realEvents, Event as RealEvent } from "../components/data/events";

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

type EventWithSlug = RealEvent & { slug?: string };
type FinalEvent = EventWithSlug & { 
  slug: string; 
  venue: string; 
  city: string;  // add this
};


const sampleEvents: FinalEvent[] = realEvents.map((e) => ({ 
  ...e, 
  slug: e.slug || generateSlug(e.title),
  venue: e.venue || e.location || "Venue TBA",
  city: e.state || "Lagos"
}));

const badgeConfig = {
  featured: { gradient: "from-purple-500 to-pink-600", icon: Star, text: "FEATURED" },
  trending: { gradient: "from-orange-500 to-red-600", icon: Flame, text: "TRENDING" },
  new: { gradient: "from-emerald-500 to-teal-600", icon: Sparkles, text: "NEW" },
  sponsored: { gradient: "from-blue-500 to-cyan-600", icon: BadgeCheck, text: "SPONSORED" },
} as const;

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

// SAME PREMIUM CARD FROM /events PAGE
const EventCard = ({ event }: { event: FinalEvent }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -20, scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="group"
  >
    <Link href={`/event/${event.slug}`} prefetch className="block">
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700">
        <div className="relative h-80 md:h-96 lg:h-[30rem] overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
            {event.featured && <Badge variant="featured" />}
            {event.trending && <Badge variant="trending" />}
            {event.isNew && <Badge variant="new" />}
            {event.sponsored && <Badge variant="sponsored" />}
          </div>

          {new Date(event.date).toDateString() === new Date().toDateString() && (
            <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-black text-sm shadow-2xl animate-pulse">
              TODAY ONLY
            </div>
          )}
        </div>

        <div className="p-7 bg-gradient-to-b from-transparent via-white/70 to-white">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 line-clamp-2 group-hover:text-purple-600 transition">
            {event.title}
          </h3>

          <div className="mt-6 space-y-4 text-gray-700">
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="font-bold">
                {new Date(event.date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>

            {event.time && (
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-purple-600" />
                <span className="font-semibold">{event.time}</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-purple-600" />
              <span className="font-medium">{event.venue}, {event.city}</span>
            </div>
          </div>

          <button className="mt-8 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 text-lg shadow-xl hover:shadow-purple-600/60 transition-all">
            <Ticket className="w-8 h-8" />
            Get Ticket • {event.price}
          </button>
        </div>
      </div>
    </Link>
  </motion.article>
);

// NEW: CAROUSEL SECTION (SAME AS /events PAGE)
const CarouselSection = ({ title, events, subtitle }: { title: string; events: FinalEvent[]; subtitle?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!events.length) return null;

  return (
    <section className="mb-24 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">{title}</h2>
          {subtitle && <p className="text-xl text-gray-600 mt-2">{subtitle}</p>}
        </div>

        {events.length > 1 && (
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -600, behavior: "smooth" })}
              className="p-3 bg-white/90 backdrop-blur rounded-full shadow-xl hover:scale-110 transition"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 600, behavior: "smooth" })}
              className="p-3 bg-white/90 backdrop-blur rounded-full shadow-xl hover:scale-110 transition"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-6"
      >
        {events.map((event) => (
          <div key={event.id} className="flex-shrink-0 snap-start w-full sm:w-96 md:w-[28rem] lg:w-[32rem]">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
};

// TODAY’S SCHEDULE — NOW ALSO A CAROUSEL
const TodaysSchedule = ({ events }: { events: FinalEvent[] }) => {
  const todaysEvents = events.filter(e => new Date(e.date).toDateString() === new Date().toDateString());
  if (!todaysEvents.length) return null;

  return (
    <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-6xl md:text-8xl font-black text-gray-900">Today’s Schedule</h2>
          <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-4">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </motion.div>

        <div className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-6">
          {todaysEvents.map((event) => (
            <div key={event.id} className="flex-shrink-0 snap-start w-full sm:w-96 md:w-[28rem] lg:w-[32rem]">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  

 const filteredEvents = useMemo(() => {
  const term = searchTerm.toLowerCase();

  return sampleEvents.filter((event) =>
    [event.title, event.venue, event.city].some((field) =>
      field.toLowerCase().includes(term)
    )
  );
}, [searchTerm]);


  const trendingEvents = filteredEvents.filter((e) => e.trending);
  const featuredEvents = filteredEvents.filter((e) => e.featured);
  const newEvents = filteredEvents.filter((e) => e.isNew);
  const sponsoredEvents = filteredEvents.filter((e) => e.sponsored);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* HERO - UNTOUCHED */}
      <section className="pt-28 pb-16 text-center px-5">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight text-gray-900"
        >
          Discover Events
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Across Nigeria
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Concerts • Comedy • Festivals • Parties • Art & More
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/create-event" className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition">
            <Plus className="w-6 h-6" /> Create Event
          </Link>
          <Link href="/events" className="bg-black text-white font-bold px-10 py-4 rounded-full shadow-xl hover:scale-105 transition">
            Explore Events
          </Link>
          <Link href="/about" className="bg-transparent border-2 border-gray-800 text-gray-800 font-bold px-10 py-4 rounded-full hover:bg-gray-900 hover:text-white transition">
            Learn More
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm md:text-base text-gray-700 font-medium"
        >
          <span className="flex items-center gap-2"><Car className="w-5 h-5 text-purple-600" /> Uber Rides</span>
          <span className="flex items-center gap-2"><Navigation className="w-5 h-5 text-pink-600" /> Live Map</span>
          <span className="flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-emerald-600" /> Verified Only</span>
        </motion.div>
      </section>

      {/* TODAY'S SCHEDULE - NOW CAROUSEL */}
      <TodaysSchedule events={sampleEvents} />

      {/* SEARCH - UNTOUCHED */}
      <div className="max-w-2xl mx-auto px-5 my-16">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
          <input
            type="text"
            placeholder="Search events, artists, venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-gray-200 focus:border-purple-500 focus:outline-none shadow-lg text-base transition"
          />
        </div>
      </div>

      {/* ALL SECTIONS NOW CAROUSELS — SAME AS /events */}
      <div className="pb-32">
        <CarouselSection title="Trending Now" events={trendingEvents} subtitle="Everyone’s going" />
        <CarouselSection title="Featured Events" events={featuredEvents} subtitle="Handpicked for you" />
        <CarouselSection title="Fresh Drops" events={newEvents} subtitle="Just landed" />
        <CarouselSection title="Sponsored" events={sponsoredEvents} subtitle="Promoted events" />
      </div>
    </div>
  );
}