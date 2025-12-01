// src/app/admin/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    // Example: read a query parameter from the request
    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get('organizerId');

    // Total Revenue (optionally filter by organizer)
    let eventsQuery = supabase.from('events').select('revenue');
    if (organizerId) {
      eventsQuery = eventsQuery.eq('organizer_id', organizerId);
    }
    const { data: events, error: eventsError } = await eventsQuery;

    if (eventsError) throw eventsError;

    const totalRevenue = events?.reduce((acc, e) => acc + Number(e.revenue), 0) || 0;

    // Total Organizers
    const { data: organizers, error: orgError } = await supabase
      .from('organizers')
      .select('id');

    if (orgError) throw orgError;

    // Total Events
    const totalEvents = events?.length || 0;

    return NextResponse.json({
      totalRevenue,
      totalOrganizers: organizers?.length || 0,
      totalEvents,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: err },
      { status: 500 }
    );
  }
}
