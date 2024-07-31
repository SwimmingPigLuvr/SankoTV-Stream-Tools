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
<Nav isMobile={$isMobile} />
	{#if browser}
		<div
			class={centered
				? "mx-auto w-1/2"
				: $isMobile
					? "w-full"
					: "fixed w-1/4"}
		>
			<Directory isMobile={$isMobile} />
		</div>
		{#if !centered && !$isMobile}
			<div class="ml-auto w-full md:w-3/4">
				<slot />
			</div>
		{/if}
	{/if}
</main>

<style>
	.mx-auto {
		margin-left: auto;
		margin-right: auto;
	}
</style>
