import { getSupabaseClient } from '$lib/app/supabase/supabase';
import type { Entry } from '../model/entry';
import { EntryRepository, type IEntryRepository } from '../repository/entry.repository';

export class CreateEntryUseCase {
  private readonly entryRepository: IEntryRepository;

  private constructor(args: { entryRepository: IEntryRepository }) {
    this.entryRepository = args.entryRepository;
  }

  static new(): CreateEntryUseCase {
    const supabase = getSupabaseClient();

    const entryRepository = new EntryRepository({
      supabase,
    });

    const useCase = new CreateEntryUseCase({ entryRepository });

    return useCase;
  }

  async handle(args: {
    word: string;
    reading: string;
    reference: string;
    authorId?: string;
  }): Promise<Entry> {
    const entry = await this.entryRepository.create({
      word: args.word,
      reading: args.reading,
      reference: args.reference,
      authorId: args.authorId,
    });

    return entry;
  }
}
