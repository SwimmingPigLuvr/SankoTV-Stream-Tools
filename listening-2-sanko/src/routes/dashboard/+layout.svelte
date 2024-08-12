<script lang="ts">
	import Directory from "$lib/components/Directory.svelte";
	import Nav from "$lib/components/Nav.svelte";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	const MOBILE_BREAKPOINT = 768;

	// Create a writable store for windowWidth
	const windowWidth = writable(MOBILE_BREAKPOINT);

	// Create a derived store for isMobile
	export const isMobile = writable(true);

	// Function to update windowWidth and isMobile
	function updateWidth() {
		if (browser) {
			windowWidth.set(window.innerWidth);
			isMobile.set($windowWidth <= MOBILE_BREAKPOINT);
		}
	}

	onMount(() => {
		// Update width immediately on mount
		updateWidth();

		// Set up event listener for resize
		window.addEventListener("resize", updateWidth);

		// Cleanup
		return () => window.removeEventListener("resize", updateWidth);
	});

	$: centered = $page.url.pathname === "/dashboard";
</script>

<main class="flex justify-between w-full">
	<div class="z-40 text-xs">
		<Nav isMobile={$isMobile} />
	</div>
	{#if browser}
		<div
			class={centered
				? "mx-auto w-1/2"
				: $isMobile
					? "w-full z-30"
					: "fixed"}
		>
			<Directory isMobile={$isMobile} />
		</div>
		<div class="m-auto {$isMobile ? 'w-full' : ''} ">
			<slot />
		</div>
	{/if}
</main>

<style>
	.mx-auto {
		margin-left: auto;
		margin-right: auto;
	}
</style>
