import type { AppSupabaseClient } from '$lib/app/supabase/supabase';
import type { InsertDto, UpdateDto } from '$lib/app/supabase/supabase-dto.helper';
import { Entry } from '../model/entry';

export interface IEntryRepository {
  findById: (args: { id: number }) => Promise<Entry | undefined>;
  create: (args: {
    word: string;
    reading: string;
    reference: string;
    authorId?: string;
  }) => Promise<Entry>;
  updateById: (args: {
    id: number;
    data: {
      word?: string;
      reading?: string;
      reference?: string;
    };
  }) => Promise<Entry>;
}

export class EntryRepository implements IEntryRepository {
  private readonly supabase: AppSupabaseClient;

  constructor(args: { supabase: AppSupabaseClient }) {
    this.supabase = args.supabase;
  }

  async findById(args: { id: number }): Promise<Entry | undefined> {
    const { data, error } = await this.supabase
      .from('entries')
      .select()
      .match({ id: args.id })
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return undefined;
    }

    const entry = Entry.fromSupabase({ supabaseEntry: data });

    return entry;
  }

  async create(args: {
    word: string;
    reading: string;
    reference: string;
    authorId?: string;
  }): Promise<Entry> {
    const { data, error } = await this.supabase
      .from('entries')
      .insert<InsertDto<'entries'>>({
        word: args.word,
        reading: args.reading,
        reference: args.reference,
        author_id: args.authorId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Failed to create entry');
    }

    const entry = Entry.fromSupabase({ supabaseEntry: data });

    return entry;
  }

  async updateById(args: {
    id: number;
    data: {
      word?: string;
      reading?: string;
      reference?: string;
    };
  }): Promise<Entry> {
    const { data, error } = await this.supabase
      .from('entries')
      .update<UpdateDto<'entries'>>(args.data)
      .match({ id: args.id })
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Failed to update entry');
    }

    const entry = Entry.fromSupabase({ supabaseEntry: data });

    return entry;
  }
}
