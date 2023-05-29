<script lang="ts">
	import slash from "slash";

	// @ts-ignore
	import _logo from "$lib/assets/icon.png?format=webp&w=100";
	const logo = slash(_logo);
</script>

<nav class="flex w-full justify-center">
	<div class="w-limit flex h-[5rem] w-full items-center justify-between">
		<a href="/" class="flex items-center gap-4">
			<img src={logo} class="h-full max-h-[2rem]" alt="Web Sculptors logo" />
			<h1 class="text-2xl font-bold">京阪アクセント辞典</h1>
		</a>
		<ul class="hidden list-none items-center gap-x-4 gap-y-2 sm:flex">
			<li>
				<a href="/">検索</a>
			</li>
			<li>
				<a href="/login">ログイン</a>
			</li>
		</ul>
	</div>
</nav>
