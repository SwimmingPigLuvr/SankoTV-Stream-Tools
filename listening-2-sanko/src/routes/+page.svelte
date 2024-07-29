<script lang="ts">
	import { onMount } from "svelte";
	import { walletStore } from "$lib/walletStores";
	import type { RequestHandler } from "@sveltejs/kit";
	import { browser } from "$app/environment";
	import { truncateAddress } from "$lib/utils";
	import { blur, fade, fly, slide } from "svelte/transition";
	import { isDarkMode } from "$lib/stores";
	import DarkMode from "$lib/components/DarkMode.svelte";
	import {
		backIn,
		backInOut,
		backOut,
		cubicInOut,
		cubicOut,
	} from "svelte/easing";
	import AnimatedText from "$lib/components/AnimatedText.svelte";

	$: truncatedAddress = $walletStore.address
		? truncateAddress($walletStore.address)
		: "";

	let isConnecting = false;
	let error = "";
	let showTitle = false;
	let showConnect = false;

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

		setTimeout(() => {
			showConnect = true;
		}, 1500);
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
				class="fixed top-20 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center"
			>
				<h2
					in:slide={{
						delay: 0,
						duration: 300,
						easing: cubicOut,
					}}
					class="translate-y-0 text-3xl space-x-0 flex items-baseline text-right font-badger"
				>
					<span class="text-red-500">S</span>
					<span class="text-blue-500">A</span>
					<span class="text-lime-500">N</span>
					<span class="text-yellow-400">K</span>
					<span class={$isDarkMode ? "text-white" : "text-slate-800"}
						>O</span
					>
					<span class="text-lime-400 tracking-[0.1rem]">.TV</span>
				</h2>

				<h1
					class=" font-coolfont-pix-outlined {$isDarkMode
						? 'text-yellow-100  '
						: 'text-white title-glow-blue'} text-4xl items-center flex space-x-0"
				>
					<p
						in:fly={{
							y: 10,
							x: 500,
							duration: 1000,
							delay: 0,
							easing: backOut,
						}}
					>
						⭐️
					</p>
					<p class="text-[6rem]">
						<AnimatedText text="StarLabs" />
					</p>
					<p
						in:fly={{
							delay: 250,
							y: 10,
							x: -500,
							duration: 1000,
							easing: backOut,
						}}
					>
						⭐️
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
				{#if showConnect}
					<button
						in:slide={{
							easing: backOut,
							delay: 1000,
							duration: 1000,
						}}
						class="transform transition-all duration-100 ease-[backOut] border-blue-700 border-[1px] {$isDarkMode
							? 'text-white hover:bg-blue-900'
							: 'text-blue-700 bg-white hover:bg-blue-700 hover:text-white'} font-serif italic p-2 -tracking-wider px-4 rounded-full"
						on:click={handleConnect}
						disabled={isConnecting}
					>
						{isConnecting ? "Connecting..." : "Connect"}
					</button>
				{/if}
			{/if}
			{#if error}
				<p
					class="p-1 px-3 border-red-600 rounded border-b-8 border-[1px] text-red-600 font-coolfont-pixel mt-2"
				>
					error: {error}
				</p>
			{/if}
		</div>
	</div>
	<div
		in:slide={{ delay: 1500 }}
		class=" text-white font-amsterdam-display fixed bottom-2 left-2 items-center -translate-y-1 flex-col"
	>
		<a
			target="_blank"
			rel="noopener noreferrer"
			href="https://x.com/SwimmingPigLuvr"
			class="text-xl flex-col text-center text-sky-300 flex p-2 hover:border-blue-700 border-[1px] border-transparent leading-5 rounded-xl"
		>
			<span class="">Swimming</span>
			<span class="font-botch">𓃟🩵r</span>
		</a>
	</div>
</main>

<style>
	.title-glow {
		text-shadow:
			0 0 5px rgba(255, 255, 0, 0.5),
			0 0 10px rgba(255, 255, 0, 0.5),
			0 0 15px rgba(255, 255, 0, 0.5),
			0 0 20px rgba(255, 255, 0, 0.5),
			/* Add a hint of color */ 0 0 30px rgba(255, 255, 0, 0.5),
			0 0 40px rgba(255, 255, 0, 0.5),
			0 0 50px rgba(255, 255, 255, 0.5),
			0 0 75px rgba(255, 255, 255, 0.5); /* More intense glow further out */
	}

	.title-glow-blue {
		text-shadow:
			0 0 5px rgba(255, 0, 255, 0.5),
			0 0 10px rgba(255, 0, 255, 0.5),
			0 0 15px rgba(255, 0, 255, 0.5),
			0 0 20px rgba(255, 0, 255, 0.5),
			0 0 30px rgba(255, 0, 255, 0.5),
			0 0 40px rgba(255, 0, 255, 0.5),
			0 0 50px rgba(255, 0, 255, 0.5),
			0 0 75px rgba(255, 0, 255, 0.5);
	}
</style>
