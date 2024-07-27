<script lang="ts">
	import WalletAddress from "$lib/components/WalletAddress.svelte";
	import { walletStore } from "$lib/walletStores";
	import { isDarkMode } from "$lib/stores";
	import { fly, slide } from "svelte/transition";

	let userData: any;
	walletStore.subscribe((store) => {
		userData = store.userData;
	});
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

	{#if userData}
		<p class="text-lime-400">welcome {userData.wallet_address}</p>
	{/if}
</main>
