import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/.generated/supabase/database';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';

const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

export type AppSupabaseClient = typeof supabase;

export function getSupabaseClient() {
  return supabase;
}
