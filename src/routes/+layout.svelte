<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import { onMount, setContext } from "svelte";
	import "../app.css";
	import { writable } from "svelte/store";
	import type { Session } from "@supabase/supabase-js";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;
	setContext("session", writable<Session | null>(data.session));
</script>

<svelte:head />

<Navbar />
<main>
	<slot />
</main>
