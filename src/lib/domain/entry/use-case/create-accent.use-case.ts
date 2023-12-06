import { getSupabaseClient } from '$lib/app/supabase/supabase';
import type { Accent } from '../model/accent';
import { AccentRepository, type IAccentRepository } from '../repository/accent.repository';

export class CreateAccentUseCase {
  private readonly accentRepository: IAccentRepository;

  private constructor(args: { accentRepository: IAccentRepository }) {
    this.accentRepository = args.accentRepository;
  }

  static new(): CreateAccentUseCase {
    const supabase = getSupabaseClient();

    const accentRepository = new AccentRepository({
      supabase,
    });

    const useCase = new CreateAccentUseCase({ accentRepository });

    return useCase;
  }

  async handle(args: {
    accent: string;
    usage?: string;
    authorId?: string;
    wordId: number;
    order?: number;
  }): Promise<Accent> {
    const accent = await this.accentRepository.create({
      accent: args.accent,
      usage: args.usage,
      authorId: args.authorId,
      wordId: args.wordId,
      order: args.order,
    });

    return accent;
  }
}
