import { EntryRepository, type IEntryRepository } from '../repository/entry.repository';
import { AccentRepository, type IAccentRepository } from '../repository/accent.repository';
import { getSupabaseClient } from '$lib/app/supabase/supabase';
import type { Entry } from '../model/entry';

export class FindEntryUseCase {
  private readonly entryRepository: IEntryRepository;
  private readonly accentRepository: IAccentRepository;

  private constructor(args: {
    entryRepository: IEntryRepository;
    accentRepository: IAccentRepository;
  }) {
    this.entryRepository = args.entryRepository;
    this.accentRepository = args.accentRepository;
  }

  static new(): FindEntryUseCase {
    const supabase = getSupabaseClient();

    const entryRepository = new EntryRepository({
      supabase,
    });

    const accentRepository = new AccentRepository({
      supabase,
    });

    const useCase = new FindEntryUseCase({ entryRepository, accentRepository });

    return useCase;
  }

  async handle(args: { entryId: number }): Promise<Entry> {
    const entry = await this.entryRepository.findById({ id: args.entryId });

    if (!entry) {
      throw new Error(`Entry not found: ${args.entryId}`);
    }

    const accents = await this.accentRepository.findByWordId({ wordId: entry.id });

    const entryWithAccents = entry.setAccents({ accents });

    return entryWithAccents;
  }
}
