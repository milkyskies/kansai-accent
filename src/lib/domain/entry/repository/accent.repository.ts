import type { AppSupabaseClient } from '$lib/app/supabase/supabase';
import { Accent } from '../model/accent';
import type { InsertDto, UpdateDto } from '$lib/app/supabase/supabase-dto.helper';

export interface IAccentRepository {
  findByEntryId: (args: { entryId: number }) => Promise<Accent[]>;
  upsert: (args: {
    id?: number;
    accent: string;
    usage: string;
    authorId?: string;
    entryId: number;
    order: number;
  }) => Promise<Accent>;
  upsertMany: (args: { accents: InsertDto<'accents'>[] }) => Promise<Accent[]>;
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

  async findByEntryId(args: { entryId: number }): Promise<Accent[]> {
    const { data, error } = await this.supabase
      .from('accents')
      .select()
      .eq('entry_id', args.entryId);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Failed to find accents');
    }

    const accents = data.map((accent) => Accent.fromSupabase({ supabaseAccent: accent }));

    return accents;
  }

  async upsert(args: {
    id?: number;
    accent: string;
    usage: string;
    authorId?: string;
    entryId: number;
    order: number;
  }): Promise<Accent> {
    const { data, error } = await this.supabase
      .from('accents')
      .upsert<InsertDto<'accents'>>({
        id: args.id,
        accent: args.accent,
        usage: args.usage,
        author_id: args.authorId,
        entry_id: args.entryId,
        order: args.order,
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

  async upsertMany(args: { accents: InsertDto<'accents'>[] }): Promise<Accent[]> {
    const { data, error } = await this.supabase
      .from('accents')
      .upsert<InsertDto<'accents'>>(args.accents, { defaultToNull: false })
      .select();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Failed to upsert accents');
    }

    const accents = data.map((supabaseAccent) => {
      const accent = Accent.fromSupabase({ supabaseAccent });

      return accent;
    });

    return accents;
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
