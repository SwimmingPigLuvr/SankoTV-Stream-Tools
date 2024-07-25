<script lang="ts">
	import { onMount } from "svelte";
	import { walletStore } from "$lib/contracts/walletStores";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";

	let isConnecting = false;
	let error = "";

	let isDarkMode = true;

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
	}

	onMount(() => {
		if (browser) {
			checkConnection();
		}
	});

	async function checkConnection() {
		try {
			const result = await walletStore.connect();
			if (result.success) {
				// redirect to dashboard
				goto("/settings");
			}
		} catch (err) {
			console.error("Failed to check connection:", err);
			error = "failed to check connection. please try again please.";
		}
	}

	async function handleConnect() {
		isConnecting = true;
		error = "";
		try {
			const result = await walletStore.connect();
			if (!result.success) {
				throw new Error(result.error || "Failed to connect wallet");
			}
			// redirect to dashboard
			goto("/settings");
		} catch (err) {
			console.error("Failed to connect wallet:", err);
			error =
				err instanceof Error
					? err.message
					: "Failed to connect wallet. Please make sure you are connected to Sanko Testnet and try again.";
		} finally {
			isConnecting = false;
		}
	}
</script>

<main>
	<button
		on:click={toggleDarkMode}
		class="flex fixed top-2 left-2 p-2 hover:bg-slate-500 rounded-full"
	>
		{#if isDarkMode}
			🌞
		{:else}
			🌚
		{/if}
	</button>

	<div
		class="{isDarkMode
			? 'text-white'
			: 'text-slate-800 bg-white'} items-center p-8 w-full h-screen flex flex-col justify-start"
	>
		<h2 class="text-3xl space-x-1 flex items-baseline font-coolfont-pixel">
			<span class="text-red-500">S</span>
			<span class="text-blue-500">A</span>
			<span class="text-lime-500">N</span>
			<span class="text-yellow-400">K</span>
			<span class={isDarkMode ? "text-white" : "text-slate-800"}>O</span>
			<span class="text-lime-400 text-xl tracking-[0.1rem]">.tv</span>
		</h2>

		<h1
			class="font-coolfont-fluid -translate-y-1 text-2xl items-center flex space-x-2"
		>
			⭐️
			<span class="text-[4rem] p-2">StarLabs</span>
			🧪
		</h1>
		<div class="items-center -translate-y-1 flex flex-col">
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://x.com/SwimmingPigLuvr"
				class="text-xs font-sans px-4 p-2 hover:bg-sky-800 rounded-xl"
			>
				by <span class="text-sky-300 font-black">Swimming</span> 𓃟 ❤️ 'r
			</a>
		</div>

		<!-- Wallet Connection and Authentication -->
		<div class="m-auto flex flex-col items-center">
			{#if $walletStore.address}
				<p>Connected to Sanko Testnet: {$walletStore.address}</p>
				<button
					class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					on:click={() => walletStore.disconnect()}
				>
					Disconnect
				</button>
			{:else}
				<button
					class="w-48 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
					on:click={handleConnect}
					disabled={isConnecting}
				>
					{isConnecting ? "Connecting..." : "Connect Wallet"}
				</button>
			{/if}
			{#if error}
				<p class="text-red-500 mt-2">{error}</p>
			{/if}
		</div>
	</div>
</main>
