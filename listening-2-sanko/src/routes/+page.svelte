<script lang="ts">
	import { onMount } from "svelte";
	import { walletStore } from "$lib/contracts/walletStores";
	import { browser } from "$app/environment";
	import { truncateAddress } from "$lib/utils";
	import { fly } from "svelte/transition";
	import { isDarkMode } from "$lib/stores";

	$: truncatedAddress = $walletStore.address
		? truncateAddress($walletStore.address)
		: "";

	let isConnecting = false;
	let error = "";

	async function handleConnect() {
		isConnecting = true;
		error = "";
		try {
			const result = await walletStore.connect();
			if (!result.success) {
				throw new Error(result.error || "Failed to connect wallet");
			}
			// redirect to dashboard
			// goto("/settings");
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
	<div
		class="{$isDarkMode
			? 'text-white'
			: 'text-slate-800 bg-yellow-100'} items-center p-8 w-full h-screen flex flex-col justify-start"
	>
		<h2 class="text-3xl space-x-1 flex items-baseline font-coolfont-pixel">
			<span class="text-red-500">S</span>
			<span class="text-blue-500">A</span>
			<span class="text-lime-500">N</span>
			<span class="text-yellow-400">K</span>
			<span class={$isDarkMode ? "text-white" : "text-slate-800"}>O</span>
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
		<div class="m-auto flex flex-col space-y-8 items-center">
			{#if $walletStore.address}
				<a
					class="px-8 p-4 {$isDarkMode
						? 'border-white'
						: 'border-slate-800'} border-[1px] hover:text-lime-400 hover:bg-slate-950 rounded-full font-coolfont text-5xl"
					href="/dashboard">Dashboard</a
				>
				<div
					in:fly={{ y: -10 }}
					class="rounded-full w-48 flex justify-between space-x-4 items-center {$isDarkMode
						? 'bg-blue-700'
						: 'bg-blue-300 text-slate-800'} px-4 p-2 font-mono text-xs -tracking-widest"
				>
					<button class="">
						{truncatedAddress}
					</button>
					<button
						class="font-bold"
						on:click={() => walletStore.disconnect()}
					>
						Disconnect
					</button>
				</div>
			{:else}
				<button
					class="bg-green-500 hover:bg-green-700 text-white font-bold p-2 px-4 rounded-full"
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
