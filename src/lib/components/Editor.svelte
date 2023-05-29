<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Database } from "$lib/types/supabase";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import type { Session } from "@supabase/supabase-js";
	import { supabase } from "$lib/supabase";
	import type { Accent, Entry } from "$lib/types";

	const session = getContext<Writable<Session | null>>("session");

	const dispatch = createEventDispatcher();

	export let close: () => void;

	export let id: number;
	export let word: string;
	export let reading: string | null;
	export let reference: string | null;
	export let accents: Accent[];
	export let toast;
	export let newEntry = false;

	const wordOriginal = word;
	const readingOriginal = reading;
	const accentOriginal = accents;
	const referenceOriginal = reference;

	let newAccents: Accent[] = [
		{
			accent: "",
			usage: null,
			author_id: $session ? $session.user.id : null,
			id: -1,
			word_id: id,
			order: null,
		},
	];

	async function save() {
		const mergedAccents = accents.concat(newAccents);
		let finalAccent: Accent[] = [];

		mergedAccents.forEach((singleAccent) => {
			if (singleAccent.accent && singleAccent.accent != "") {
				finalAccent.push(singleAccent);
			}
		});

		let entry: Entry = {
			id: id,
			word: word,
			created_at: null,
			last_updated: null,
			reading: reading,
			reference: reference,
			author_id: $session ? $session?.user.id : null,
			accents: [],
		};

		// UGH.. this is so gross...
		let entryDoc: Record<string, unknown> = {
			item: entry.word,
			accent: finalAccent,

			author_id: $session?.user.id,
		};

		if (reading) {
			entryDoc.reading = reading;
		}

		if (reference) {
			entryDoc.reference = reference;
		}

		try {
			dispatch("message", {
				loading: true,
			});
			if (newEntry) {
				const res = await supabase
					.from("entries")
					.insert({
						word: word,
						reading: reading,
						reference: reference,
						author_id: $session?.user.id ? $session.user.id : null,
					})
					.select();
				if (!res.data) throw new Error(res.error.message);
				id = res.data[0].id;
				toast.push("「" + entryDoc.item + "」" + "が追加されました。");
			} else {
				const res = await supabase
					.from("entries")
					.update({
						word: word,
						reading: reading,
						reference: reference,
					})
					.eq("id", id);
				toast.push("「" + entryDoc.item + "」" + "が更新されました。");
			}

			let i = 0;
			for (const accent of finalAccent) {
				if (accent.id < 0) {
					const res = await supabase.from("accents").insert({
						accent: accent.accent,
						usage: accent.usage,
						word_id: id,
						order: i,
						author_id: $session?.user.id,
					});
				} else {
					const res = await supabase
						.from("accents")
						.update({
							accent: accent.accent,
							usage: accent.usage,
							order: i,
						})
						.eq("id", accent.id);
				}
				i++;
			}
			for (const accent of accents) {
				if (accent.accent == "") {
					const res = await supabase.from("accents").delete().eq("id", accent.id);
				}
			}
			dispatch("message", {
				refresh: true,
				loading: false,
			});
			close();
		} catch (error) {
			console.error(error);
		}
	}

	function onChangeHandler(singleAccent: { accent: string; usage: null | string }, i: number) {
		if (singleAccent.accent == "" && (!singleAccent.usage || singleAccent.usage == "")) {
			if (newAccents.length > 0) {
				newAccents.splice(i, 1);
				newAccents = newAccents;
			}
		} else if (singleAccent.accent != "") {
			if (!newAccents[i + 1] || newAccents.length < 1) {
				newAccents.push({
					accent: "",
					usage: "",
					author_id: null,
					id: 0,
					order: null,
					word_id: id,
				});
				newAccents = newAccents;
			}
		}
	}

	function onBaseInputHandler(singleAccent: { accent: string; usage: null | string }) {
		if (singleAccent.accent == "") {
			if (newAccents.length > 0) {
				newAccents.pop();
				newAccents = newAccents;
			}
		} else if (singleAccent.accent != "") {
			if (newAccents.length < 1) {
				newAccents.push({
					accent: "",
					usage: "",
					author_id: $session ? $session.user.id : null,
					id: 0,
					order: null,
					word_id: 0,
				});
				newAccents = newAccents;
			}
		}
	}
</script>

<div class="fixed top-0 left-0 z-10 flex h-screen w-screen justify-center bg-black/40 pt-20">
	<div class="w-limit-2 z-20 mb-40 h-full w-full px-8 md:py-0 md:px-20">
		<div
			class="smooth-shadow flex max-h-[80%] flex-col overflow-auto rounded-lg bg-white px-6 pt-4 pb-8 text-lg md:max-h-[90%]">
			<h2 class="mb-2 font-bold">編集</h2>
			<form class="flex flex-col gap-2" on:submit|preventDefault={save}>
				<div class="flex flex-col gap-2 md:flex-row md:gap-6">
					<div class="w-full">
						<label class="text-base" for="item">語句<span class="text-red-500">*</span></label>
						<input
							type="text"
							id="item"
							class="w-full border bg-slate-50 px-1 "
							placeholder={wordOriginal}
							required
							bind:value={word} />
					</div>
					<div class="w-full">
						<label class="text-base" for="reading">読み</label>
						<input
							type="text"
							id="reading"
							class="w-full border bg-slate-50 px-1"
							placeholder={readingOriginal}
							bind:value={reading} />
					</div>
				</div>
				<div class="mb-4 flex flex-col gap-4">
					{#each accents as singleAccent, i}
						<div class="flex flex-col gap-2 md:flex-row md:gap-6">
							<div class="w-full">
								<label class="text-base" for="accent"
									>アクセント{#if i == 0}<span class="text-red-500">*</span>{/if}</label>
								<input
									type="text"
									id="accent"
									class="w-full border bg-slate-50 px-1"
									placeholder={accentOriginal[i].accent ? accentOriginal[i].accent : ""}
									required={i == 0 ? true : false}
									bind:value={singleAccent.accent}
									on:input={() => {
										if (i == 0 && newAccents) onBaseInputHandler(singleAccent);
									}} />
							</div>
							<div class="w-full">
								<label class="text-base" for="usage">使い方</label>
								<input
									type="text"
									id="usage"
									class="w-full border bg-slate-50 px-1"
									placeholder={accentOriginal[i].usage ? accentOriginal[i].usage : ""}
									bind:value={singleAccent.usage} />
							</div>
						</div>
					{/each}
					{#each newAccents as singleAccent, i}
						<div class="flex flex-col gap-2 md:flex-row md:gap-6">
							<div class="w-full">
								<label class="text-base" for="accent"
									>アクセント{#if singleAccent.usage}<span class="text-red-500">*</span>{/if}</label>
								<input
									type="text"
									id="accent"
									class="w-full border bg-slate-50 px-1"
									required={singleAccent.usage ? true : false}
									bind:value={singleAccent.accent}
									on:input={() => onChangeHandler(singleAccent, i)} />
							</div>
							<div class="w-full">
								<label class="text-base" for="usage">使い方</label>
								<input
									type="text"
									id="usage"
									class="w-full border bg-slate-50 px-1"
									bind:value={singleAccent.usage}
									on:input={() => onChangeHandler(singleAccent, i)} />
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
					placeholder={referenceOriginal} />
				<div class="mt-8 flex w-full justify-end gap-3 text-sm font-bold">
					<button type="button" class="w-24 rounded-md border py-2 px-3 text-[#7D69AC]" on:click={close}
						>キャンセル</button>
					<button type="submit" class="w-24 rounded-md bg-[#7D69AC] py-2 px-3 text-white">保存</button>
				</div>
			</form>
		</div>
	</div>
</div>
