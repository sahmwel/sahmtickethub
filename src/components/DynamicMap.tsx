'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import Image from "next/image";


// Types
export interface EventItem {
   id: string;
  title: string;
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

interface DynamicMapProps {
  center: [number, number];
  events: EventItem[];
  goToEvent: (id: string) => void;
}

// Placeholder while Leaflet loads
function MapPlaceholder() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 rounded-3xl flex items-center justify-center">
      <p className="text-2xl font-black text-purple-700 animate-pulse">Loading map...</p>
    </div>
  );
}

// Dynamic imports for Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <MapPlaceholder /> }
);
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Kaduna default
export const KADUNA_DEFAULT: [number, number] = [10.5105, 7.4165];

export default function DynamicMap({ center, events, goToEvent }: DynamicMapProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("leaflet").then((L) => {
      const iconProto = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string };
      delete iconProto._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setReady(true);
    });
  }, []);

  if (!ready) return <MapPlaceholder />;

  return (
    <MapContainer center={center as LatLngExpression} zoom={11} className="h-full w-full rounded-3xl" scrollWheelZoom>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={center as LatLngExpression}>
        <Popup>You are here</Popup>
      </Marker>
      {events.map((e) => (
  <Marker key={e.id} position={e.coords as LatLngExpression}>
    <Popup>
      <div onClick={() => goToEvent(e.id)} className="cursor-pointer select-none text-center p-2">
        <div className="relative w-64 h-40 mb-2 rounded-2xl overflow-hidden border-2 border-purple-300">
          <Image
            src={e.image}          // <-- changed from 'event.image'
            alt={e.title}          // <-- changed from 'event.title'
            fill
            className="object-cover"
            unoptimized={false}
          />
        </div>
        <h3 className="font-black text-xl text-purple-700">{e.title}</h3>
        <p className="text-sm text-gray-600 font-medium">{e.venue}</p>
        <p className="text-lg font-black text-purple-600">{e.price}</p>
      </div>
    </Popup>
  </Marker>
))}

    </MapContainer>
  );
}
