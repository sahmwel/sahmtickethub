// File: /app/admin/api/analytics/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Fetch events and organizer info in parallel
    const [eventsResult, organizersResult] = await Promise.all([
      supabase.from("events").select("id, title, revenue, tickets_sold, organizer_id"),
      supabase.from("organizers").select("id, name"),
    ]);

    const events = eventsResult.data ?? [];
    const organizers = organizersResult.data ?? [];

    if (eventsResult.error) throw eventsResult.error;
    if (organizersResult.error) throw organizersResult.error;

    // Total revenue and tickets
    const totalRevenue = events.reduce((sum, e) => sum + (e.revenue ?? 0), 0);
    const totalTickets = events.reduce((sum, e) => sum + (e.tickets_sold ?? 0), 0);
    const totalEvents = events.length;
    const avgRevenue = totalEvents > 0 ? totalRevenue / totalEvents : 0;

    // Revenue per event for chart
    const eventTitles = events.map((e) => e.title);
    const eventsRevenue = events.map((e) => e.revenue ?? 0);

    // Revenue per organizer
    const organizersRevenue = organizers.map((org) => {
      const orgRevenue = events
        .filter((e) => e.organizer_id === org.id)
        .reduce((sum, e) => sum + (e.revenue ?? 0), 0);
      return { name: org.name, revenue: orgRevenue };
    });

    return NextResponse.json({
      totalRevenue,
      totalTickets,
      totalEvents,
      avgRevenue,
      eventTitles,
      eventsRevenue,
      organizersRevenue,
    });
  } catch (err) {
    console.error("Analytics API error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
