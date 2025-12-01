import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Run all queries in parallel
    const [revenueResult, organizersResult, eventsResult] = await Promise.all([
      // Sum total_price directly in Supabase
      supabase
        .from('tickets')
        .select('total_price', { count: 'exact' }), // Supabase doesn't currently support sum aggregation in JS client, so we'll still sum JS-side
      supabase
        .from('organizers')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('events')
        .select('id', { count: 'exact', head: true }),
    ]);

    const { data: ticketsData, error: ticketsError } = revenueResult;
    const { count: totalOrganizers, error: orgError } = organizersResult;
    const { count: totalEvents, error: eventsError } = eventsResult;

    if (ticketsError) throw ticketsError;
    if (orgError) throw orgError;
    if (eventsError) throw eventsError;

    // Compute total revenue JS-side
    const totalRevenue = ticketsData?.reduce(
      (sum: number, t: { total_price: number | string }) => sum + Number(t.total_price),
      0
    ) || 0;

    return NextResponse.json({
      totalRevenue,
      activeOrganizers: totalOrganizers,
      totalEvents,
    });
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
