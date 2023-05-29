/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Database } from "$lib/types/supabase";

type EntryRow = Database["public"]["Tables"]["entries"]["Row"];
type AccentRow = Database["public"]["Tables"]["accents"]["Row"];

interface Entry extends EntryRow {
	accents: Accent[];
}

interface Accent extends AccentRow {}

export type { Entry, Accent };
