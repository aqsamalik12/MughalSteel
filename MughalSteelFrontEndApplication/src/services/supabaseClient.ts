import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://suvnbskrnasyxhjbedfb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dm5ic2tybmFzeXhoamJlZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MzA0MTgsImV4cCI6MjEwMzIwNjQxOH0.zoTNMSSlD0l3AqnYgVgXkheJCFs2tTQ1Iwf4YbsMEPU';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
