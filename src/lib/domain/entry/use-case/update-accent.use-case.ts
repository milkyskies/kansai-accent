import { getSupabaseClient } from '$lib/app/supabase/supabase';
import type { Accent } from '../model/accent';
import { AccentRepository, type IAccentRepository } from '../repository/accent.repository';

export class UpdateAccentUseCase {
  private readonly accentRepository: IAccentRepository;

  private constructor(args: { accentRepository: IAccentRepository }) {
    this.accentRepository = args.accentRepository;
  }

  static new(): UpdateAccentUseCase {
    const supabase = getSupabaseClient();

    const accentRepository = new AccentRepository({
      supabase,
    });

    const useCase = new UpdateAccentUseCase({ accentRepository });

    return useCase;
  }

  async handle(args: {
    id: number;
    data: {
      accent?: string;
      usage?: string;
      order?: number;
    };
  }): Promise<Accent> {
    const accent = await this.accentRepository.updateById({
      id: args.id,
      data: args.data,
    });

    return accent;
  }
}
