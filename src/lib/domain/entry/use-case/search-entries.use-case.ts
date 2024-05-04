import { EntryRepository, type IEntryRepository } from '../repository/entry.repository';
import { AccentRepository, type IAccentRepository } from '../repository/accent.repository';
import { getSupabaseClient, type AppSupabaseClient } from '$lib/app/supabase/supabase';
import { Entry } from '../model/entry';

export class SearchEntriesUseCase {
  private readonly entryRepository: IEntryRepository;
  private readonly accentRepository: IAccentRepository;
  private readonly supabase: AppSupabaseClient;

  private constructor(args: {
    entryRepository: IEntryRepository;
    accentRepository: IAccentRepository;
    supabase: AppSupabaseClient;
  }) {
    this.entryRepository = args.entryRepository;
    this.accentRepository = args.accentRepository;
    this.supabase = args.supabase;
  }

  static new(): SearchEntriesUseCase {
    const supabase = getSupabaseClient();

    const entryRepository = new EntryRepository({
      supabase,
    });

    const accentRepository = new AccentRepository({
      supabase,
    });

    const supabaseClient = getSupabaseClient();

    const useCase = new SearchEntriesUseCase({
      entryRepository,
      accentRepository,
      supabase: supabaseClient,
    });

    return useCase;
  }

  async handle(args: { query: string }): Promise<Entry[]> {
    // TODO: Abstract this more
    const { data, error } = await this.supabase.rpc('get_ordered_entries', {
      search_query: args.query,
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from get_ordered_entries');
    }

    const entries = data.map((supabaseEntry) => {
      const entry = Entry.fromSupabase({
        supabaseEntry,
      });

      return entry;
    });

    const entriesWithAccents = await Promise.all(
      entries.map(async (entry) => {
        const accents = await this.accentRepository.findByEntryId({ entryId: entry.id });

        const entryWithAccents = entry.setAccents({ accents });

        return entryWithAccents;
      }),
    );

    return entriesWithAccents;
  }
}
