// src/app/admin/api/organizer/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

type SupabaseError = {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
};

// GET
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('organizers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: 'Organizer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const error = err as SupabaseError;
    return NextResponse.json(
      { error: 'Failed to fetch organizer', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('organizers')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: 'Organizer not found after update' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const error = err as SupabaseError;
    return NextResponse.json(
      { error: 'Failed to update organizer', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { error } = await supabase
      .from('organizers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as SupabaseError;
    return NextResponse.json(
      { error: 'Failed to delete organizer', details: error.message },
      { status: 500 }
    );
  }
}