import { getSupabaseClient } from '$lib/app/supabase/supabase';
import type { LayoutLoad } from './$types';

const supabase = getSupabaseClient();

export const load: LayoutLoad = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session };
};
