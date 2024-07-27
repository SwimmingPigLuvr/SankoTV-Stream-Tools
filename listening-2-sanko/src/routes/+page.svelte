<script lang="ts">
	import { onMount } from "svelte";
	import { walletStore } from "$lib/walletStores";
	import { browser } from "$app/environment";
	import { truncateAddress } from "$lib/utils";
	import { fly, slide } from "svelte/transition";
	import { isDarkMode } from "$lib/stores";
	import DarkMode from "$lib/components/DarkMode.svelte";
	import { backOut } from "svelte/easing";

	$: truncatedAddress = $walletStore.address
		? truncateAddress($walletStore.address)
		: "";

	let isConnecting = false;
	let error = "";
	let showTitle = false;

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

	onMount(() => {
		setTimeout(() => {
			showTitle = true;
		}, 500);
	});
</script>

<main>
	<div class="fixed top-2 left-2">
		<DarkMode />
	</div>

	<div
		class="{$isDarkMode
			? 'text-white'
			: 'text-slate-800 bg-yellow-100'} items-center p-8 w-full h-screen flex flex-col justify-start"
	>
		{#if showTitle}
			<div
				class="fixed top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center"
			>
				<h2
					in:fly={{
						y: -50,
						delay: 0,
						duration: 1500,
						easing: backOut,
					}}
					class="translate-y-0 text-5xl space-x-2 flex items-baseline text-right font-coolfont-pixel"
				>
					<span class="text-red-500">S</span>
					<span class="text-blue-500">A</span>
					<span class="text-lime-500">N</span>
					<span class="text-yellow-400">K</span>
					<span class={$isDarkMode ? "text-white" : "text-slate-800"}
						>O</span
					>
					<span class="text-lime-400 tracking-[0.1rem]">.tv</span>
				</h2>

				<h1
					class="font-coolfont-pix-outlined {$isDarkMode ? 'text-yellow-100' : 'text-blue-700'} text-4xl items-center flex space-x-1"
				>
					<p
						in:fly={{
							y: 20,
							x: -20,
							duration: 500,
							delay: 1000,
							easing: backOut,
						}}
					>
						✨
					</p>
					<span
						in:fly={{
							delay: 50,
							y: 40,
							duration: 1500,
							easing: backOut,
						}}
						class="text-[6rem]">StarLabs</span
					>
					<p
						in:fly={{
							delay: 1150,
							y: 10,
							x: 10,
							duration: 1000,
							easing: backOut,
						}}
					>
						✨
					</p>
				</h1>
			</div>
		{/if}

		<!-- Wallet Connection and Authentication -->
		<div class="m-auto flex flex-col space-y-8 items-center">
			{#if $walletStore.address}
				<a
					class="px-4 p-2 {$isDarkMode
						? 'border-white'
						: 'border-slate-800'} border-[1px] hover:text-lime-400 hover:bg-slate-950 rounded-full font-coolfont text-xl"
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
				<!-- connect wallet -->
				<button
					class="bg-green-500 hover:bg-green-700 font-serif italic text-white text-xs p-2 px-6  rounded-full"
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
	<div
		in:slide={{ delay: 1500 }}
		class=" text-white font-coolfont-pixel fixed bottom-2 left-1/2 -translate-x-1/2 items-center -translate-y-1 flex-col"
	>
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://x.com/SwimmingPigLuvr"
			class="text-xl px-4 p-2 hover:bg-sky-800 rounded-xl"
		>
			<span class="font-mono text-xs">by</span> <span class="text-sky-300 font-black">Swimming</span>
			𓃟 ❤️ r
		</a>
	</div>
</main>
