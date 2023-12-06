import type { AppSupabaseClient } from '$lib/app/supabase/supabase';
import { Accent } from '../model/accent';
import type { InsertDto, UpdateDto } from '$lib/app/supabase/supabase-dto.helper';

export interface IAccentRepository {
  findByWordId: (args: { wordId: number }) => Promise<Accent[]>;
  create: (args: {
    accent: string;
    usage?: string;
    authorId?: string;
    wordId: number;
    order?: number;
  }) => Promise<Accent>;
  updateById: (args: {
    id: number;
    data: {
      accent?: string;
      usage?: string;
      order?: number;
    };
  }) => Promise<Accent>;
  deleteById: (args: { id: number }) => Promise<void>;
}

export class AccentRepository implements IAccentRepository {
  private readonly supabase: AppSupabaseClient;

  constructor(args: { supabase: AppSupabaseClient }) {
    this.supabase = args.supabase;
  }

  async findByWordId(args: { wordId: number }): Promise<Accent[]> {
    const { data, error } = await this.supabase.from('accents').select().eq('word_id', args.wordId);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Failed to find accents');
    }

    const accents = data.map((accent) => Accent.fromSupabase({ supabaseAccent: accent }));

    return accents;
  }

  async create(args: {
    accent: string;
    usage?: string;
    authorId?: string;
    wordId: number;
    order?: number;
  }): Promise<Accent> {
    const { data, error } = await this.supabase
      .from('accents')
      .insert<InsertDto<'accents'>>({
        accent: args.accent,
        usage: args.usage,
        author_id: args.authorId,
        word_id: args.wordId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Failed to create accent');
    }

    const accent = Accent.fromSupabase({ supabaseAccent: data });

    return accent;
  }

  async updateById(args: {
    id: number;
    data: {
      accent?: string;
      usage?: string;
      order?: number;
    };
  }): Promise<Accent> {
    const { data, error } = await this.supabase
      .from('accents')
      .update<UpdateDto<'accents'>>(args.data)
      .eq('id', args.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Failed to update accent');
    }

    const accent = Accent.fromSupabase({ supabaseAccent: data });

    return accent;
  }

  async deleteById(args: { id: number }): Promise<void> {
    const { error } = await this.supabase.from('accents').delete().eq('id', args.id);

    if (error) {
      throw error;
    }
  }
}
