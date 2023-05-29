<script lang="ts">
	export let title = "";
</script>

<div class="w-limit-2 mb-10">
	{#if title != ""}
		<div class="pb-4">{title}</div>
	{/if}
	<div class="smooth-shadow rounded-lg bg-white px-4 py-4">
		<slot />
	</div>
</div>
