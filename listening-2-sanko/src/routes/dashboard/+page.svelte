<script lang="ts">
	import WalletAddress from "$lib/components/WalletAddress.svelte";
	import { isDarkMode } from "$lib/stores";
	import { fly, slide } from "svelte/transition";

	let sectionData = [{ name: "zyn" }, { name: "top donation" }];

	const widgets = [
		"AI + Text to Speech",
		"Donation Goals",
		"Donation Lists",
		"Emotes",
		"Giveaway Wheel",
		"Pin Chat",
		"Top Donations",
	];

	// mainSections array
	const mainSections = [
		"Donation Alerts",
		"Chat Box",
		"Chat Plays",
		"Theme Library",
	];

	let activeSection: string | null = null;

	function showCurrentSection(section: string) {
		activeSection = activeSection === section ? null : section;
	}
</script>

<main
	class="p-4 min-h-screen font-mono {$isDarkMode
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

	<div
		class="max-w-[1080px] w-full mt-32 flex flex-col sm:space-x-8 space-x-0 space-y-8 sm:space-y-0 sm:flex-row items-start justify-center m-auto font-mono"
	>
		<!-- Main Sections -->
		<div class="w-full sm:w-1/2">
			<div class="flex flex-col items-start w-full">
				{#each mainSections as section}
					<button
						on:click={() => showCurrentSection(section)}
						class="rounded-none w-full px-4 p-2 text-left items-center justify-center hover:bg-amber-400 hover:bg-opacity-10 hover:border-amber-300 border-transparent border-2"
					>
						<span class="text-xl">{section}</span>
					</button>
					{#if activeSection === section}
						<div
							in:slide
							class="px-8 flex flex-col items-start justify-start"
						>
							<button class="p-2 px-4 bg-lime-400"
								>－create new</button
							>
							{#each sectionData as data}
								<button class="p-2 px-4 bg-lime-400"
									>－{data.name}</button
								>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Widgets -->
		<div class="w-full sm:w-1/2">
			<h2 class="text-2xl px-4 p-2 text-left">Widgets</h2>
			<div class="flex flex-wrap">
				{#each widgets as widget}
					<a
						href="/dashboard/{widget
							.toLowerCase()
							.replace(' ', '-')}"
						class="rounded-none w-1/2 px-4 hover:bg-amber-400 hover:bg-opacity-10 hover:border-amber-300 border-transparent border-2 p-2 text-left"
					>
						<span class="text-">{widget}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</main>
