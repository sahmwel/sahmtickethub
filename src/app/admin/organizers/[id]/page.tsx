'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Organizer {
  id: string;
  name: string;
  email: string;
  // add other fields if necessary
}

export default function OrganizerDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // extract the ID from URL
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (!id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("organizers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setOrganizer(data);
      setLoading(false);
    };

    fetchOrganizer();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!organizer) return <p>Organizer not found.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{organizer.name}</h1>
      <p>Email: {organizer.email}</p>
      <p>ID: {organizer.id}</p>
    </div>
  );
}
