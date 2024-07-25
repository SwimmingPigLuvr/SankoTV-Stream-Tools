<script lang="ts">
	import WalletAddress from "$lib/components/WalletAddress.svelte";
	import { isDarkMode } from "$lib/stores";
	import { fly } from "svelte/transition";

	const mainSections = [
		{ name: "Donation Alerts", icon: "🚨" },
		{ name: "Chat Box", icon: "💬" },
		{ name: "Chat Plays", icon: "🎮" },
		{ name: "Theme Library", icon: "🎨" },
	];

	const widgets = [
		{ name: "AI + Text to Speech", icon: "🤖" },
		{ name: "Donation Goals", icon: "🎯" },
		{ name: "Donation Lists", icon: "📋" },
		{ name: "Emotes", icon: "😀" },
		{ name: "Giveaway Wheel", icon: "🎡" },
		{ name: "Pin Chat", icon: "📌" },
		{ name: "Top Donations", icon: "🏆" },
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
		class="fixed top-2 left-1/2 -translate-x-1/2 font-coolfont-fluid -translate-y-1 items-center flex space-x-2"
	>
		⭐️
		<span class="text-[2rem] p-2">StarLabs</span>
		🧪
	</h1>

	<div class="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
		<!-- Main Sections -->
		<div class="space-y-4">
			<h2 class="text-2xl font-bold mb-4 retro-text">Features</h2>
			<div class="grid grid-cols-2 gap-4">
				{#each mainSections as section}
					<a
						href="/dashboard/{section.name
							.toLowerCase()
							.replace(' ', '-')}"
						class="retro-button main-button p-4 text-center flex flex-col items-center justify-center"
					>
						<span class="text-4xl mb-2">{section.icon}</span>
						<span class="text-lg">{section.name}</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Widgets -->
		<div class="space-y-4">
			<h2 class="text-2xl font-bold mb-4 retro-text">Widgets</h2>
			<div class="grid grid-cols-3 gap-4">
				{#each widgets as widget}
					<a
						href="/dashboard/{widget.name
							.toLowerCase()
							.replace(' ', '-')}"
						class="retro-button widget-button p-2 text-center flex flex-col items-center justify-center"
					>
						<span class="text-2xl mb-1">{widget.icon}</span>
						<span class="text-sm">{widget.name}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
	.retro-text {
		font-family: "Coolfont-Fluid", sans;
		text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
	}

	.retro-button {
		border: 3px solid #000;
		box-shadow: 4px 4px 0px #000;
		transition: all 0.1s ease;
		background-color: #f0f0f0;
		color: #000;
	}

	.retro-button:hover {
		transform: translate(2px, 2px);
		box-shadow: 2px 2px 0px #000;
	}

	.main-button {
		height: 150px;
	}

	.widget-button {
		height: 100px;
	}
</style>
