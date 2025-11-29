// src/hooks/useUserLocation.ts
import { useState, useEffect } from "react";

export type LatLng = [number, number];
const KADUNA_DEFAULT: LatLng = [10.5105, 7.4165];

export function useUserLocation(): LatLng {
  const [location, setLocation] = useState<LatLng>(KADUNA_DEFAULT);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn("Geolocation denied or unavailable:", err.message)
      );
    }
  }, []);

  return location;
}
