import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT and get organizer info
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizerId = userData.user.id;

    // Fetch events for this organizer
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("ticket_sold, revenue, status")
      .eq("organizer_id", organizerId);

    if (eventsError) {
      return NextResponse.json({ error: eventsError.message }, { status: 400 });
    }

    // Compute stats
    const totalRevenue = events?.reduce((sum, e) => sum + (e.revenue || 0), 0) || 0;
    const totalTickets = events?.reduce((sum, e) => sum + (e.ticket_sold || 0), 0) || 0;
    const activeEvents = events?.filter((e) => e.status === "Live").length || 0;

    return NextResponse.json({
      totalRevenue,
      totalTickets,
      activeEvents,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch organizer stats" },
      { status: 500 }
    );
  }
}
