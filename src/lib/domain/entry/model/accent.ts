import type { Tables as SupabaseTables } from '$lib/.generated/supabase/database';

export type SupabaseAccent = SupabaseTables<'accents'>;

export type AccentValues = {
  accent: string;
  authorId?: string;
  id: number;
  order: number;
  usage: string;
  entryId: number;
};

export type AccentViewDto = {
  id?: number;
  accent: string;
  usage: string;
  order: number;
};

export class Accent {
  private readonly _accent: string;
  private readonly _authorId?: string;
  private readonly _id: number;
  private readonly _order: number;
  private readonly _usage: string;
  private readonly _entryId: number;

  private constructor(args: AccentValues) {
    this._accent = args.accent;
    this._authorId = args.authorId;
    this._id = args.id;
    this._order = args.order;
    this._usage = args.usage;
    this._entryId = args.entryId;
  }

  public static fromValues(args: AccentValues): Accent {
    const accent = new Accent({
      accent: args.accent,
      authorId: args.authorId,
      id: args.id,
      order: args.order,
      usage: args.usage,
      entryId: args.entryId,
    });

    return accent;
  }

  static fromSupabase(args: { supabaseAccent: SupabaseAccent }): Accent {
    const accent = new Accent({
      accent: args.supabaseAccent.accent,
      authorId: args.supabaseAccent.author_id ?? '',
      id: args.supabaseAccent.id,
      order: args.supabaseAccent.order ?? undefined,
      usage: args.supabaseAccent.usage ?? undefined,
      entryId: args.supabaseAccent.entry_id,
    });

    return accent;
  }

  toViewDto(): AccentViewDto {
    const dto = {
      id: this._id,
      accent: this._accent,
      usage: this._usage ?? '',
      order: this._order,
    };

    return dto;
  }

  get id(): number {
    return this._id;
  }

  get accent(): string {
    return this._accent;
  }

  get usage(): string {
    return this._usage;
  }

  get authorId(): string | undefined {
    return this._authorId;
  }

  get entryId(): number {
    return this._entryId;
  }

  get order(): number {
    return this._order;
  }
}
