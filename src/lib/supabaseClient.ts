import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidUrl(url: string | undefined) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

let supabase: ReturnType<typeof createClient> | undefined = undefined;
if (isValidUrl(supabaseUrl) && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Supabase environment variables are missing or invalid. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export { supabase };
