import type { Database as SupabaseDatabase } from '$lib/.generated/supabase/database';

export type Row<T extends keyof SupabaseDatabase['public']['Tables']> =
  SupabaseDatabase['public']['Tables'][T]['Row'];

export type InsertDto<T extends keyof SupabaseDatabase['public']['Tables']> =
  SupabaseDatabase['public']['Tables'][T]['Insert'];

export type UpdateDto<T extends keyof SupabaseDatabase['public']['Tables']> =
  SupabaseDatabase['public']['Tables'][T]['Update'];
