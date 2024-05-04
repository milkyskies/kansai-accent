<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { Session } from '@supabase/supabase-js';
  import type { AccentViewDto } from '$lib/domain/entry/model/accent';
  import { CreateEntryUseCase } from '$lib/domain/entry/use-case/create-entry.use-case';
  import { UpdateEntryUseCase } from '$lib/domain/entry/use-case/update-entry.use-case';
  import { UpsertAccentUseCase } from '$lib/domain/entry/use-case/upsert-accent.use-case';
  import { UpdateAccentUseCase } from '$lib/domain/entry/use-case/update-accent.use-case';
  import { DeleteAccentUseCase } from '$lib/domain/entry/use-case/delete-accent.use-case';

  const session = getContext<Writable<Session | null>>('session');

  const dispatch = createEventDispatcher();

  export let close: () => void;

  export let id: number | undefined = undefined;
  export let word: string;
  export let reading: string;
  export let reference: string;
  export let accents: AccentViewDto[];
  export let toast;
  export let newEntry = false;

  const wordOriginal = word;
  const readingOriginal = reading;
  const accentOriginal = accents;
  const referenceOriginal = reference;

  let newAccents: AccentViewDto[] = [
    {
      accent: '',
      usage: '',
      order: accents.length,
    },
  ];

  async function save() {
    const createEntryUseCase = CreateEntryUseCase.new();
    const updateEntryUseCase = UpdateEntryUseCase.new();
    const upsertAccentUseCase = UpsertAccentUseCase.new();
    const updateAccentUseCase = UpdateAccentUseCase.new();

    const mergedAccents = accents.concat(newAccents);
    let finalAccents: AccentViewDto[] = [];

    mergedAccents.forEach((singleAccent) => {
      if (singleAccent.accent && singleAccent.accent != '') {
        finalAccents.push(singleAccent);
      }
    });

    try {
      dispatch('message', {
        loading: true,
      });
      if (newEntry) {
        const entry = await createEntryUseCase.handle({
          reading,
          reference,
          word,
          authorId: $session?.user.id,
        });

        id = entry.id;
      } else {
        if (!id) throw new Error('No ID');

        const entry = await updateEntryUseCase.handle({
          id,
          data: {
            reading,
            reference,
            word,
          },
        });
      }

      const insertDtos = finalAccents.map((finalAccent) => {
        if (!id) throw new Error('No entry ID');

        return {
          id: finalAccent.id,
          accent: finalAccent.accent,
          usage: finalAccent.usage,
          entryId: id,
          order: finalAccent.order,
          authorId: $session?.user.id,
        };
      });

      await upsertAccentUseCase.handleMany({
        accents: insertDtos,
      });

      toast.push(`「${word}」が更新されました。`);

      dispatch('message', {
        refresh: true,
        loading: false,
      });

      close();
    } catch (error) {
      console.error(error);
    }

    const deleteAccentsPromises = accents.map(async (accent) => {
      if (!accent.accent) {
        if (!accent.id) throw new Error('No ID');

        await DeleteAccentUseCase.new().handle({ id: accent.id });
      }
    });

    await Promise.all(deleteAccentsPromises);
  }

  function onChangeHandler(singleAccent: { accent: string; usage: null | string }, i: number) {
    if (!singleAccent.accent && !singleAccent.usage) {
      if (newAccents.length > 0) {
        newAccents.splice(i, 1);

        newAccents.forEach((newAccent) => {
          if (newAccent.order > i) {
            newAccent.order -= 1;
          }
        });

        newAccents = newAccents;
      }
    } else if (!!singleAccent.accent) {
      if (!newAccents[i + 1] || newAccents.length < 1) {
        newAccents.push({
          accent: '',
          usage: '',
          order: newAccents.length + accents.length,
        });

        newAccents = newAccents;
      }
    }
  }

  function onBaseInputHandler(singleAccent: { accent: string; usage: null | string }) {
    if (!singleAccent.accent) {
      if (newAccents.length > 0) {
        newAccents.pop();
        newAccents = newAccents;
      }
    } else if (!!singleAccent.accent) {
      if (newAccents.length < 1) {
        newAccents.push({
          accent: '',
          usage: '',
          order: accents.length,
        });

        newAccents = newAccents;
      }
    }
  }
</script>

<div class="fixed left-0 top-0 z-10 flex h-screen w-screen justify-center bg-black/40 pt-20">
  <div class="w-limit-2 z-20 mb-40 h-full w-full px-8 md:px-20 md:py-0">
    <div
      class="smooth-shadow flex max-h-[80%] flex-col overflow-auto rounded-lg bg-white px-6 pb-8 pt-4 text-lg md:max-h-[90%]"
    >
      <h2 class="mb-2 font-bold">編集</h2>
      <form class="flex flex-col gap-2" on:submit|preventDefault={save}>
        <div class="flex flex-col gap-2 md:flex-row md:gap-6">
          <div class="w-full">
            <label class="text-base" for="item">語句<span class="text-red-500">*</span></label>
            <input
              type="text"
              id="item"
              class="w-full border bg-slate-50 px-1"
              placeholder={wordOriginal}
              required
              bind:value={word}
            />
          </div>
          <div class="w-full">
            <label class="text-base" for="reading">読み</label>
            <input
              type="text"
              id="reading"
              class="w-full border bg-slate-50 px-1"
              placeholder={readingOriginal}
              bind:value={reading}
            />
          </div>
        </div>
        <div class="mb-4 flex flex-col gap-4">
          {#each accents as accent, i}
            <div class="flex flex-col gap-2 md:flex-row md:gap-6">
              <div class="w-full">
                <label class="text-base" for="accent"
                  >アクセント{#if i == 0}<span class="text-red-500">*</span>{/if}</label
                >
                {accent.order}
                <input
                  type="text"
                  id="accent"
                  class="w-full border bg-slate-50 px-1"
                  placeholder={accentOriginal[i].accent ? accentOriginal[i].accent : ''}
                  required={i == 0 ? true : false}
                  bind:value={accent.accent}
                  on:input={() => {
                    if (i === 0 && newAccents) onBaseInputHandler(accent);
                  }}
                />
              </div>
              <div class="w-full">
                <label class="text-base" for="usage">使い方</label>
                <input
                  type="text"
                  id="usage"
                  class="w-full border bg-slate-50 px-1"
                  placeholder={accentOriginal[i].usage ? accentOriginal[i].usage : ''}
                  bind:value={accent.usage}
                />
              </div>
            </div>
          {/each}
          {#each newAccents as newAccent, i}
            <div class="flex flex-col gap-2 md:flex-row md:gap-6">
              <div class="w-full">
                {newAccent.order}
                <label class="text-base" for="accent"
                  >アクセント{#if newAccent.usage}<span class="text-red-500">*</span>{/if}</label
                >
                <input
                  type="text"
                  id="accent"
                  class="w-full border bg-slate-50 px-1"
                  required={newAccent.usage ? true : false}
                  bind:value={newAccent.accent}
                  on:input={() => onChangeHandler(newAccent, i)}
                />
              </div>
              <div class="w-full">
                <label class="text-base" for="usage">使い方</label>
                <input
                  type="text"
                  id="usage"
                  class="w-full border bg-slate-50 px-1"
                  bind:value={newAccent.usage}
                  on:input={() => onChangeHandler(newAccent, i)}
                />
              </div>
            </div>
          {/each}
        </div>
        <label class="text-base" for="reference">参考</label>
        <textarea
          id="reference"
          name="reference"
          rows="3"
          class="w-full border bg-slate-50 px-1"
          bind:value={reference}
          placeholder={referenceOriginal}
        />
        <div class="mt-8 flex w-full justify-end gap-3 text-sm font-bold">
          <button
            type="button"
            class="w-24 rounded-md border px-3 py-2 text-[#7D69AC]"
            on:click={close}>キャンセル</button
          >
          <button type="submit" class="w-24 rounded-md bg-[#7D69AC] px-3 py-2 text-white"
            >保存</button
          >
        </div>
      </form>
    </div>
  </div>
</div>
