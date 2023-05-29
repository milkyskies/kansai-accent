import type { LayoutLoad } from "./$types";
import { supabase } from "$lib/supabase";
import { browser } from "$app/environment";

export const load: LayoutLoad = async () => {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	return { session };
};

// const {
//   data: { subscription },
// } = supabase.auth.onAuthStateChange(() => {
//   invalidate("supabase:auth");
// });

// return () => {
//   subscription.unsubscribe();
// };
