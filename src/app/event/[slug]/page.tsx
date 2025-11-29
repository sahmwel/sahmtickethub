'use client';

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { events as realEvents } from "@/components/data/events";
import {
  ArrowLeft, Calendar, MapPin, Ticket, Navigation, Share2, Car, Loader2, Clock
} from "lucide-react";

// Dynamic import of map to avoid SSR issues
const EventMap = dynamic(() => import("@/components/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 md:h-80 bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
      <p className="text-gray-600 font-bold">Loading map...</p>
    </div>
  ),
});

export default function EventDetails() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [buyingTier, setBuyingTier] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const normalizeSlug = (str: string = "") =>
    decodeURIComponent(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const event = realEvents.find((e) => {
    const urlSlug = normalizeSlug(slug);
    const eventSlug = normalizeSlug(e.slug || e.title);
    return eventSlug === urlSlug;
  });

  // Initialize quantities for each tier
  useEffect(() => {
    if (event?.ticketTiers) {
      const initialQuantities: { [key: string]: number } = {};
      event.ticketTiers.forEach(tier => {
        initialQuantities[tier.name] = 1;
      });
      setTimeout(() => setQuantities(initialQuantities), 0);
    }
  }, [event]);


  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900">404</h1>
          <p className="text-xl md:text-2xl text-gray-600">Event not found</p>
          <Link href="/events" className="inline-flex items-center gap-4 px-5 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-full hover:scale-105 transition shadow-lg">
            <ArrowLeft className="w-5 h-5" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const generateOrderId = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  interface TicketTier {
    name: string;
    description?: string;
    price: string;
    available?: boolean;
  }

  const handleBuyTicket = (tier: TicketTier, quantity: number) => {
    setBuyingTier(tier.name); // mark the tier as being purchased

    const orderId = generateOrderId();

    router.push(
      `/checkout/${orderId}?event=${event.id}&type=${encodeURIComponent(tier.name)}&price=${encodeURIComponent(tier.price)}&qty=${quantity}`
    );
  };



  const similarEvents = realEvents
    .filter((e) => normalizeSlug(e.slug || e.title) !== normalizeSlug(slug) && e.location.includes(event.location.split(",")[0]))
    .slice(0, 6);

  return (
    <>
      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 text-sm sm:text-base text-gray-700 font-semibold flex flex-wrap items-center gap-2">
        <Link href="/events" className="hover:text-purple-600 transition flex items-center gap-1">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back to Events
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-black truncate">{event.title}</span>
      </div>

      {/* HERO */}
      <section className="relative h-64 sm:h-80 md:h-[520px] lg:h-[600px] overflow-hidden mt-4">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover object-center"
          priority
          quality={85}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-8 sm:pb-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
              <h1 className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-3 sm:gap-5 mt-4 sm:mt-6 text-white text-xs sm:text-sm md:text-base font-bold">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {new Date(event.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                {event.time && (
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    {event.time}
                  </div>
                )}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {event.location}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pt-10 sm:pt-12 pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-12">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-10">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/90 backdrop-blur-2xl rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/30">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-5">About This Event</h2>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                  {event.description || "Get ready for an unforgettable night packed with electrifying performances, premium vibes, and memories that last forever."}
                </p>
              </motion.div>

              {/* Ticket tiers */}
              {event.ticketTiers?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-8 text-white">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Secure Your Spot</h2>
                    <p className="text-sm sm:text-lg mt-1 sm:mt-2 opacity-90">Limited tickets — don’t wait</p>
                  </div>

                  <div className="p-4 sm:p-8 space-y-4 sm:space-y-8">
                    {event.ticketTiers.map((tier) => (
                      <div
                        key={tier.name}
                        className={`rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 sm:border-4 transition-all ${tier.available === false ? "border-gray-300 opacity-60" : "border-purple-500/50 hover:border-purple-600 shadow-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/50"}`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-5">
                          <div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black">{tier.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">{tier.description}</p>
                          </div>
                          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-600">{tier.price}</div>
                        </div>

                        {/* Quantity selector */}
                        {tier.available !== false && (
                          <div className="mt-4 flex items-center gap-3">
                            <label className="font-bold">Quantity:</label>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setQuantities({
                                    ...quantities,
                                    [tier.name]: Math.max(1, (quantities[tier.name] || 1) - 1),
                                  })
                                }
                                className="px-3 py-1 bg-gray-200 rounded-xl text-lg font-bold hover:bg-gray-300 transition"
                              >
                                -
                              </button>
                              <span className="w-10 text-center text-lg font-bold">{quantities[tier.name] || 1}</span>
                              <button
                                onClick={() =>
                                  setQuantities({
                                    ...quantities,
                                    [tier.name]: Math.min(10, (quantities[tier.name] || 1) + 1),
                                  })
                                }
                                className="px-3 py-1 bg-gray-200 rounded-xl text-lg font-bold hover:bg-gray-300 transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Buy button */}
                        {tier.available !== false && (
                          <button
                            onClick={() => handleBuyTicket(tier, quantities[tier.name] || 1)}
                            disabled={buyingTier === tier.name}
                            className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg sm:text-xl py-3 sm:py-6 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-3 sm:gap-4 shadow-2xl hover:scale-105 transition-all disabled:opacity-70"
                          >
                            {buyingTier === tier.name ? (
                              <> <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" /> Reserving...</>
                            ) : (
                              <> <Ticket className="w-6 h-6 sm:w-8 sm:h-8" /> Get Ticket • {tier.price}</>
                            )}
                          </button>
                        )}

                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>


            {/* RIGHT SIDEBAR */}
            <div className="space-y-6 sm:space-y-8">
              {(event.venue || (event.lat && event.lng)) && (
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 sm:p-7 text-white">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-2 sm:gap-3">
                      <MapPin className="w-5 h-5 sm:w-7 sm:h-7" /> Venue
                    </h3>
                  </div>
                  <div className="p-4 sm:p-7">
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-black">{event.venue || "Venue TBC"}</h4>
                    <p className="text-sm sm:text-gray-600 mt-1 sm:mt-2">{event.address || event.location}</p>
                  </div>

                  {/* Show map & Uber/Google links only if lat/lng exist */}
                  {event.lat && event.lng && (
                    <div className="px-4 sm:px-7 pb-4 sm:pb-7 flex flex-col gap-3 sm:gap-4">
                      <EventMap lat={event.lat} lng={event.lng} venue={event.venue || event.title} address={event.address} />
                      <a
                        href={`https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${event.lat}&dropoff[longitude]=${event.lng}&dropoff[nickname]=${encodeURIComponent(event.venue || "Event")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-black text-white text-center font-black text-base sm:text-lg py-2 sm:py-4 rounded-2xl sm:rounded-3xl hover:bg-gray-900 transition shadow-lg"
                      >
                        <Car className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2" /> Ride with Uber
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-black text-base sm:text-lg py-2 sm:py-4 rounded-2xl sm:rounded-3xl hover:scale-105 transition shadow-lg"
                      >
                        <Navigation className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2" /> Get Directions
                      </a>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-10 text-center border border-white/20">
                <Share2 className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-purple-600 mb-3 sm:mb-5" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black">Share This Event</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">Let your people know!</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMILAR EVENTS */}
      {similarEvents.length > 0 && (
        <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl md:text-6xl font-black text-center mb-12 sm:mb-16 text-gray-900">
              More Events You’ll Love
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {similarEvents.map((ev, i) => (
                <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="group">
                  <Link href={`/event/${normalizeSlug(ev.slug || ev.title)}`} className="block">
                    <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:-translate-y-2 sm:hover:-translate-y-4 transition-all duration-500 border border-white/20">
                      <div className="relative h-48 sm:h-64">
                        <Image src={ev.image} alt={ev.title} fill className="object-cover group-hover:scale-110 transition duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-black line-clamp-2">{ev.title}</h3>
                          <p className="text-xs sm:text-sm mt-1 opacity-90">{ev.location}</p>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6 flex justify-between items-center">
                        <span className="text-xl sm:text-2xl md:text-3xl font-black text-purple-600">{ev.ticketTiers?.[0]?.price || ev.price}</span>
                        <span className="text-gray-600 flex items-center gap-1 sm:gap-2">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                          {new Date(ev.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
