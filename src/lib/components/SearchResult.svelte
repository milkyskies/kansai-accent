<script lang="ts">
	import { SvelteToast, toast } from "@zerodevx/svelte-toast";
	import Editor from "./Editor.svelte";
	import { createEventDispatcher } from "svelte";
	import { supabase } from "$lib/supabase";
	import type { Database } from "$lib/types/supabase";

	const dispatch = createEventDispatcher();

	export let id: number;
	export let word = " ";
	export let reading: string | null = " ";
	export let reference: string | null = " ";
	export let accents: any[];
	export let edit: () => void;

	export let editable = false;
</script>

<SvelteToast />
<div class="group mt-4 w-full py-2">
	<div class="flex">
		<div class="mr-3 w-full md:w-52">
			<div class="w-fit">
				<div class="w-full text-center">
					{#if reading && reading != " "}
						{reading}
					{:else}
						&nbsp;
					{/if}
				</div>
				<div class="text-3xl font-medium leading-none">{word}</div>
			</div>
		</div>
		<div class="flex w-full justify-between">
			<div class="w-full">
				<div class="">
					<h3 class="text-sm font-bold text-black/70">アクセント</h3>
					<ol class="ml-4">
						{#each accents as accent}
							<li class="mt-[6px] h-full list-decimal text-black/50">
								<div class="flex">
									<span class="text-2xl text-black">{accent.accent}</span>
									{#if accent.usage}
										<span class="ml-3 pt-[6px] text-black/75">{accent.usage}</span>
									{/if}
								</div>
							</li>
						{/each}
					</ol>
				</div>
				{#if reference && reference != ""}
					<div class="mt-5">
						<h3 class="text-sm font-bold text-black/70">参考</h3>
						<div class="mt-[6px] text-xl">{reference}</div>
					</div>
				{/if}
			</div>
			{#if editable}
				<div class="invisible flex items-start group-hover:visible">
					<button
						on:click={() => {
							edit();
						}}
						><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
							><path
								fill="#a8a8a8"
								d="M5 23.7q-.825 0-1.413-.588Q3 22.525 3 21.7v-14q0-.825.587-1.413Q4.175 5.7 5 5.7h8.925l-2 2H5v14h14v-6.95l2-2v8.95q0 .825-.587 1.412q-.588.588-1.413.588Zm7-9Zm4.175-8.425l1.425 1.4l-6.6 6.6V15.7h1.4l6.625-6.625l1.425 1.4l-7.2 7.225H9v-4.25Zm4.275 4.2l-4.275-4.2l2.5-2.5q.6-.6 1.438-.6q.837 0 1.412.6l1.4 1.425q.575.575.575 1.4T22.925 8Z" /></svg
						></button>
				</div>
			{/if}
		</div>
	</div>
	<div class="mt-8 h-[1px] w-full bg-black/20" />
</div>
