import { createClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://buaabmvgujosydvzkawn.supabase.co";
const fallbackSupabaseAnonKey = "sb_publishable_YDNmOh-erL3oTUvgZBuf9g_HRb5c5ot";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || fallbackSupabaseUrl;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || fallbackSupabaseAnonKey;

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
