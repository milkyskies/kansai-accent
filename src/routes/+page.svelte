<script lang="ts">
  import SearchResult from '$lib/components/SearchResult.svelte';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import Editor from '$lib/components/Editor.svelte';
  import type { Session } from '@supabase/supabase-js';
  import type { Entry } from '$lib/domain/entry/model/entry';
  import { SearchEntriesUseCase } from '$lib/domain/entry/use-case/search-entries.use-case';

  const session = getContext<Writable<Session | null>>('session');

  let state: 'loading' | 'idle' | 'editing' = 'idle';

  let searchQuery = '';
  let results: Entry[] = [];
  let editingEntry: Entry | undefined;

  async function performSearch() {
    results = [];

    state = 'loading';

    if (/^( |　)*$/.test(searchQuery)) {
      results = [];

      state = 'idle';

      return;
    }

    const entries = await SearchEntriesUseCase.new().handle({ query: searchQuery });

    results = entries;

    state = 'idle';
  }

  function handleMessage(event: any) {
    if (event.detail.refresh) {
      performSearch();
    }
    if (event.detail.loading) {
      state = 'loading';
    }
    if (!event.detail.refresh) {
      state = 'idle';
    }
  }

  function edit(result?: Entry) {
    state = 'editing';

    if (result) {
      editingEntry = result;
    } else {
      editingEntry = undefined;
    }
  }
</script>

<svelte:head>
  <title>検索 - 関西弁アクセント辞典</title>
</svelte:head>

<SvelteToast />
<div class="w-limit">
  <form class="flex items-center" on:submit|preventDefault={performSearch}>
    <label for="search" class="sr-only">検索</label>
    <div class="relative w-full">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          aria-hidden="true"
          class="h-5 w-5 text-gray-500 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          /></svg
        >
      </div>
      <input
        type="text"
        id="search"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900"
        placeholder="検索"
        bind:value={searchQuery}
      />
    </div>
    <button
      class="ml-2 rounded-lg bg-ws p-3 font-medium text-white focus:outline-none focus:ring-4"
    >
      <svg
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        /></svg
      >
      <span class="sr-only">検索</span>
    </button>
    {#if $session}
      <button
        type="button"
        on:click={() => edit()}
        class="ml-2 rounded-lg border p-3 font-medium text-ws focus:outline-none focus:ring-4"
      >
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          ><path fill="rgb(125 105 172)" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" /></svg
        >
        <span class="sr-only">追加</span>
      </button>
    {/if}
  </form>
  <div class="mt-4 w-full">
    {#if state === 'loading'}
      <div class="flex w-full items-center justify-center pt-10">
        <span class="loader" />
      </div>
    {/if}
    {#if results && results.length > 0}
      <h2 class="mb-4 text-3xl font-bold">
        結果 <span class="text-xl font-normal text-black/60">&#8212; {results.length}件</span>
      </h2>
      {#each results as result}
        <SearchResult
          word={result.word}
          reading={result.reading}
          reference={result.reference}
          accents={result.accents}
          on:message={handleMessage}
          editable={$session ? true : false}
          edit={() => edit(result)}
        />
      {/each}
    {/if}
  </div>
</div>
{#if state === 'editing'}
  {#if editingEntry}
    {#key editingEntry}
      <Editor
        id={editingEntry.id}
        word={editingEntry.word}
        accents={editingEntry.accents.map((accent) => {
          return accent.toViewDto();
        })}
        {toast}
        reading={editingEntry.reading ?? ''}
        reference={editingEntry.reference ?? ''}
        close={() => {
          state = 'idle';
        }}
        newEntry={editingEntry.accents[0] && editingEntry.accents[0].accent !== '' ? false : true}
        on:message={handleMessage}
      />
    {/key}
  {:else}
    <Editor
      word=""
      accents={[]}
      {toast}
      reading=""
      reference=""
      close={() => {
        state = 'idle';
      }}
      newEntry={true}
      on:message={handleMessage}
    />
  {/if}
{/if}
