import { supabase } from "$lib/supabase";

type EntryResponse = Awaited<ReturnType<typeof addEntry>>;
export type EntryResponseSuccess = EntryResponse["data"];

async function addEntry() {
	return await supabase.from("entries").insert([]);
}
