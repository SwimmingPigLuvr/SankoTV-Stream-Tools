<script lang="ts">
	import WalletAddress from "$lib/components/WalletAddress.svelte";
	import { isDarkMode } from "$lib/stores";
	import { fly } from "svelte/transition";

	const mainSections = [
		"Donation Alerts",
		"Chat Box",
		"Chat Plays",
		"Theme Library",
	];

	const widgets = [
		"AI + Text to Speech",
		"Donation Goals",
		"Donation Lists",
		"Emotes",
		"Giveaway Wheel",
		"Pin Chat",
		"Top Donations",
	];

</script>

<main
	class="p-8 min-h-screen font-mono {$isDarkMode
		? 'bg-slate-900 text-white'
		: 'bg-yellow-100 text-slate-800'}"
>
	<div class="fixed top-2 right-2">
		<WalletAddress />
	</div>

	<h1
		class="fixed top-2 left-1/2 -translate-x-1/2 font-serif italic -tracking-widest -translate-y-1 items-center flex space-x-2"
	>
		⭐️
		<span class="text-[2rem] p-2">StarLabs</span>
		🧪
	</h1>

	<div class="mt-20 max-w-xl m-auto font-mono -tracking-widest">
		<!-- Main Sections -->
		<div class="flex flex-col space-y-4">
			<div class="flex flex-col w-full">
				{#each mainSections as section}
					<a
						href="/dashboard/{section
							.toLowerCase()
							.replace(' ', '-')}"
						class="rounded-full px-4 p-2 text-left items-center justify-center hover:bg-amber-200 hover:bg-opacity-15 hover:border-amber-200 border-transparent border-2"
					>
						<span class="text-2xl">{section}</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Widgets -->
		<div class="space-y-4 mt-10">
			<h2 class="text-2xl text-left mb-4">Widgets</h2>
			<div class="flex flex-wrap w-full">
				{#each widgets as widget}
					<a
						href="/dashboard/{widget
							.toLowerCase()
							.replace(' ', '-')}"
						class="retro-button widget-button p-2 text-center flex flex-col items-center justify-center"
					>
						<span class="text-sm">{widget}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</main>
