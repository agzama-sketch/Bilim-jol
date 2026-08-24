import { createClient } from "@supabase/supabase-js";

// Single shared Supabase client for the whole app. Both App.jsx and
// AdminPanel.jsx import `supabase` from here instead of each calling
// createClient() themselves — creating multiple clients against the same
// project causes a "Multiple GoTrueClient instances" warning and can lead
// to inconsistent auth state between parts of the app.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
