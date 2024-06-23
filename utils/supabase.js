import { SupabaseClient } from "@supabase/supabase-js";

export const supabase = new SupabaseClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
