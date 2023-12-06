import { getSupabaseClient } from '$lib/app/supabase/supabase';
import type { Entry } from '../model/entry';
import { type IEntryRepository, EntryRepository } from '../repository/entry.repository';

export class UpdateEntryUseCase {
  private readonly entryRepository: IEntryRepository;

  private constructor(args: { entryRepository: IEntryRepository }) {
    this.entryRepository = args.entryRepository;
  }

  static new(): UpdateEntryUseCase {
    const entryRepository = new EntryRepository({
      supabase: getSupabaseClient(),
    });

    const useCase = new UpdateEntryUseCase({
      entryRepository,
    });

    return useCase;
  }

  async handle(args: {
    id: number;
    data: {
      word?: string;
      reading?: string;
      reference?: string;
    };
  }): Promise<Entry> {
    const entry = await this.entryRepository.updateById({
      id: args.id,
      data: args.data,
    });

    return entry;
  }
}
