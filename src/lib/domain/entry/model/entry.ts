import type { Tables as SupabaseTables } from '$lib/.generated/supabase/database';
import type { Accent } from './accent';

export type SupabaseEntry = SupabaseTables<'entries'>;

export type EntryValues = {
  word: string;
  authorId?: string;
  createdAt?: string;
  id: number;
  lastUpdated?: string;
  reading?: string;
  reference?: string;
  accents: Accent[];
};

export class Entry {
  private readonly _word: string;
  private readonly _authorId?: string;
  private readonly _createdAt?: string;
  private readonly _id: number;
  private readonly _lastUpdated?: string;
  private readonly _reading?: string;
  private readonly _reference?: string;
  private readonly _accents: Accent[];

  private constructor(args: EntryValues) {
    this._word = args.word;
    this._authorId = args.authorId;
    this._createdAt = args.createdAt;
    this._id = args.id;
    this._lastUpdated = args.lastUpdated;
    this._reading = args.reading;
    this._reference = args.reference;
    this._accents = args.accents;
  }

  public static fromValues(args: EntryValues): Entry {
    const entry = new Entry({
      word: args.word,
      authorId: args.authorId,
      createdAt: args.createdAt,
      id: args.id,
      lastUpdated: args.lastUpdated,
      reading: args.reading,
      reference: args.reference,
      accents: args.accents,
    });

    return entry;
  }

  static fromSupabase(args: { supabaseEntry: SupabaseEntry }): Entry {
    const entry = new Entry({
      word: args.supabaseEntry.word,
      authorId: args.supabaseEntry.author_id ?? '',
      createdAt: args.supabaseEntry.created_at ?? '',
      id: args.supabaseEntry.id,
      lastUpdated: args.supabaseEntry.last_updated ?? '',
      reading: args.supabaseEntry.reading ?? '',
      reference: args.supabaseEntry.reference ?? '',
      accents: [],
    });

    return entry;
  }

  setAccents(args: { accents: Accent[] }): Entry {
    const entry = new Entry({
      word: this._word,
      authorId: this._authorId,
      createdAt: this._createdAt,
      id: this._id,
      lastUpdated: this._lastUpdated,
      reading: this._reading,
      reference: this._reference,
      accents: args.accents,
    });

    return entry;
  }

  get id(): number {
    return this._id;
  }

  get word(): string {
    return this._word;
  }

  get reading(): string | undefined {
    return this._reading;
  }

  get reference(): string | undefined {
    return this._reference;
  }

  get accents(): Accent[] {
    return this._accents;
  }
}
