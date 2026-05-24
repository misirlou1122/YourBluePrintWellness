import { createClient } from "@supabase/supabase-js";

const publicSupabaseUrl = "https://buaabmvgujosydvzkawn.supabase.co";
const publicSupabaseAnonKey = "sb_publishable_YDNmOh-erL3oTUvgZBuf9g_HRb5c5ot";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || publicSupabaseUrl;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || publicSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
      }
    })
  : null;
