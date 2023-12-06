import { getSupabaseClient } from '$lib/app/supabase/supabase';
import { AccentRepository, type IAccentRepository } from '../repository/accent.repository';

export class DeleteAccentUseCase {
  private readonly accentRepository: IAccentRepository;

  private constructor(args: { accentRepository: IAccentRepository }) {
    this.accentRepository = args.accentRepository;
  }

  static new(): DeleteAccentUseCase {
    const supabase = getSupabaseClient();

    const accentRepository = new AccentRepository({
      supabase,
    });

    const useCase = new DeleteAccentUseCase({ accentRepository });

    return useCase;
  }

  async handle(args: { id: number }): Promise<void> {
    await this.accentRepository.deleteById({
      id: args.id,
    });
  }
}
