<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { getSupabaseClient } from '$lib/app/supabase/supabase';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { Session } from '@supabase/supabase-js';
  import { invalidate } from '$app/navigation';
  import { PUBLIC_ADMIN_EMAIL } from '$env/static/public';

  const session = getContext<Writable<Session | null>>('session');

  let email = '';
  let password = '';
  let message = '';

  const supabase = getSupabaseClient();

  async function login() {
    let error, sbSession;
    try {
      if (!supabase) throw new Error('supabaseClient is not defined');
      ({
        error,
        data: { session: sbSession },
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
      if (error) {
        toast.push(error.message);
        throw error;
      }
      if (!sbSession) {
        throw new Error('No session');
      }
      $session = sbSession;
    } catch (error) {
      // ... handle error
    } finally {
      if (error) {
        // ... handle error
      } else {
        // *** this is the key to avoid having to reload after login
        await invalidate('/');
      }
    }
  }

  async function logout() {
    let error;
    ({ error } = await supabase.auth.signOut());
    if (error) {
      toast.push(error.message);
      throw error;
    }
    $session = null;
  }

  async function register() {
    let error, sbSession;
    if (!supabase) throw new Error('supabaseClient is not defined');
    ({
      error,
      data: { session: sbSession },
    } = await supabase.auth.signUp({
      email,
      password,
    }));
    if (error) {
      toast.push(error.message);
      throw error;
    }
    if (!sbSession) {
      throw new Error('No session');
    }
    $session = sbSession;
  }
</script>

<SvelteToast />
<div class="w-limit">
  <Card title="">
    <form class="flex flex-col gap-2">
      {#if $session}
        <div>Logged in as: {$session.user.id}</div>
      {/if}
      <input
        type="email"
        placeholder="メールアドレス"
        class="border bg-slate-50 px-1"
        bind:value={email}
      />
      <input
        type="password"
        placeholder="パスワード"
        class="border bg-slate-50 px-1"
        bind:value={password}
      />
      <div>{message}</div>
      <button type="button" on:click={login} class="rounded-md bg-slate-200 p-1"> Sign In </button>
      <button type="button" on:click={logout} class="rounded-md bg-slate-200 p-1">
        Sign Out
      </button>
      {#if $session?.user.email === PUBLIC_ADMIN_EMAIL}
        <button type="button" on:click={register} class="rounded-md bg-slate-200 p-1">
          Register
        </button>
      {/if}
    </form>
  </Card>
</div>
