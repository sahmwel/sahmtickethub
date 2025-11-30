// src/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';


// Replace these with YOUR actual Supabase project values
const supabaseUrl = 'https://mtvwcfozhsjslvrnjcun.supabase.co'  
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dndjZm96aHNqc2x2cm5qY3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDc1NjksImV4cCI6MjA3OTY4MzU2OX0.M58BIFib-K-MBIAWNlulxoYRUPGsHL8Lc9dHRlejR14' 
export const supabaseClient: SupabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)