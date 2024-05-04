import { getSupabaseClient } from '$lib/app/supabase/supabase';
import type { InsertDto } from '$lib/app/supabase/supabase-dto.helper';
import type { Accent } from '../model/accent';
import { AccentRepository, type IAccentRepository } from '../repository/accent.repository';

export class UpsertAccentUseCase {
  private readonly accentRepository: IAccentRepository;

  private constructor(args: { accentRepository: IAccentRepository }) {
    this.accentRepository = args.accentRepository;
  }

  static new(): UpsertAccentUseCase {
    const supabase = getSupabaseClient();

    const accentRepository = new AccentRepository({
      supabase,
    });

    const useCase = new UpsertAccentUseCase({ accentRepository });

    return useCase;
  }

  async handle(args: {
    id?: number;
    accent: string;
    usage: string;
    authorId?: string;
    entryId: number;
    order: number;
  }): Promise<Accent> {
    const accent = await this.accentRepository.upsert({
      id: args.id,
      accent: args.accent,
      usage: args.usage,
      authorId: args.authorId,
      entryId: args.entryId,
      order: args.order,
    });

    return accent;
  }

  async handleMany(args: {
    accents: {
      id?: number;
      accent: string;
      usage: string;
      authorId?: string;
      entryId: number;
      order: number;
    }[];
  }): Promise<Accent[]> {
    const insertDtos: InsertDto<'accents'>[] = args.accents.map((accent) => {
      return {
        id: accent.id,
        accent: accent.accent,
        usage: accent.usage,
        author_id: accent.authorId,
        entry_id: accent.entryId,
        order: accent.order,
      };
    });

    const accents = await this.accentRepository.upsertMany({
      accents: insertDtos,
    });

    return accents;
  }
}
