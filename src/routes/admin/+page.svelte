<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { goto } from '$app/navigation';
  import { getContext, onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { Session } from '@supabase/supabase-js';
  import { PUBLIC_ADMIN_EMAIL } from '$env/static/public';
  import { getSupabaseClient } from '$lib/app/supabase/supabase';

  const session = getContext<Writable<Session | null>>('session');

  const supabase = getSupabaseClient();

  onMount(() => {
    if ($session?.user.email !== PUBLIC_ADMIN_EMAIL) {
      goto('/login');
    }
  });

  let files: FileList;

  async function addEntriesFromFile() {
    const entries = JSON.parse(await files[0].text());
    try {
      for (const entry of entries) {
        const entryRes = await supabase
          .from('entries')
          .insert([
            {
              word: entry.item,
              reading: entry.reading ? entry.reading : null,
              reference: entry.reference ? entry.reference : null,
              author_id: $session?.user.email === PUBLIC_ADMIN_EMAIL ? $session?.user.id : null,
            },
          ])
          .select();
        console.log(entryRes);
        if (!entryRes.data) {
          toast.push('ID not reachable');
          throw new Error('ID not reachable.');
        }
        const entryId = entryRes.data[0].id;

        let i = 0;
        for (const accent of entry.accentData) {
          await supabase.from('accents').insert([
            {
              word_id: entryId,
              accent: accent.accent,
              usage: accent.usage ? accent.usage : null,
              order: i,
              author_id: $session?.user.email === PUBLIC_ADMIN_EMAIL ? $session?.user.id : null,
            },
          ]);

          i++;
        }

        console.log('Added ' + entry.item);
      }
    } catch (error) {
      console.error(error);
    }
    console.log('Done adding items.');
    toast.push('Added entries from file.');
  }
</script>

<SvelteToast />

<div class="pt-10">
  <Card title="Admin">
    <div class="flex flex-col gap-2">
      <input type="file" bind:files />
      <button type="button" on:click={addEntriesFromFile} class="rounded-md bg-slate-200 p-1"
        >Add entries from file</button
      >
    </div>
  </Card>
</div>
