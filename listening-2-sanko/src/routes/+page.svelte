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
	import GoogleAuth from "$lib/components/GoogleAuth.svelte";
	import { user } from "$lib/stores/authStore";
	import WalletAuth from "$lib/components/WalletAuth.svelte";
	import UserProfile from "$lib/components/UserProfile.svelte";
	import Trope from "$lib/components/Trope.svelte";

	let error = "";
	let showTitle = false;

	let showUx = false;

	onMount(() => {
		setTimeout(() => {
			showTitle = true;
		}, 500);

		setTimeout(() => {
			showUx = true;
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
						: 'text-white'} text-4xl items-center flex space-x-0"
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
					<p class="text-[5rem] sm:text-[6rem]">
						<AnimatedText text="starlabs" />
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

		{#if showUx}
			<div
				class="fixed top-1/2 -translate-y-1/2 scale-100 flex flex-col space-y-2 justify-start"
			>
				<!-- Wallet Connection and Authentication -->
				<div class="flex flex-col space-y-2 items-center">
					{#if $user}
						<UserProfile />
					{:else}
						<div in:blur>
							<GoogleAuth />
						</div>
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
		{/if}
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
</style>
