// lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// This is the proper Supabase Database type structure
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string | null
          location: string | null
          venue: string | null
          tickets: number | null
          lat: number | null
          lng: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title?: string
          description?: string | null
          date?: string | null
          location?: string | null
          venue?: string | null
          tickets?: number | null
          lat?: number | null
          lng?: number | null
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          date?: string | null
          location?: string | null
          venue?: string | null
          tickets?: number | null
          lat?: number | null
          lng?: number | null
          created_at?: string
        }
      }
      // Add other tables here later
    }
    Views: Record<string, never>        // ← fixed
    Functions: Record<string, never>    // ← fixed
    Enums: Record<string, never>        // ← fixed
  }
}