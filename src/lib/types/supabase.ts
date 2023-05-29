export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			accents: {
				Row: {
					accent: string;
					author_id: string | null;
					id: number;
					order: number | null;
					usage: string | null;
					word_id: number;
				};
				Insert: {
					accent: string;
					author_id?: string | null;
					id?: number;
					order?: number | null;
					usage?: string | null;
					word_id: number;
				};
				Update: {
					accent?: string;
					author_id?: string | null;
					id?: number;
					order?: number | null;
					usage?: string | null;
					word_id?: number;
				};
			};
			entries: {
				Row: {
					author_id: string | null;
					created_at: string | null;
					id: number;
					last_updated: string | null;
					reading: string | null;
					reference: string | null;
					word: string;
				};
				Insert: {
					author_id?: string | null;
					created_at?: string | null;
					id?: number;
					last_updated?: string | null;
					reading?: string | null;
					reference?: string | null;
					word: string;
				};
				Update: {
					author_id?: string | null;
					created_at?: string | null;
					id?: number;
					last_updated?: string | null;
					reading?: string | null;
					reference?: string | null;
					word?: string;
				};
			};
			profiles: {
				Row: {
					created_at: string | null;
					id: string;
					username: string | null;
				};
				Insert: {
					created_at?: string | null;
					id: string;
					username?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					username?: string | null;
				};
			};
			roles: {
				Row: {
					id: number;
					role: string;
					users: string[] | null;
				};
				Insert: {
					id?: number;
					role: string;
					users?: string[] | null;
				};
				Update: {
					id?: number;
					role?: string;
					users?: string[] | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_ordered_entries: {
				Args: { search_query: string };
				Returns: unknown;
			};
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
