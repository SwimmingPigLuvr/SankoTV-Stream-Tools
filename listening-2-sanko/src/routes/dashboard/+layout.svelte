<script lang="ts">
	import Directory from "$lib/components/Directory.svelte";
	import Nav from "$lib/components/Nav.svelte";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

	const MOBILE_BREAKPOINT = 768;
	const windowWidth = writable(MOBILE_BREAKPOINT);
	export const isMobile = writable(true);

	function updateWidth() {
		if (browser) {
			windowWidth.set(window.innerWidth);
			isMobile.set($windowWidth <= MOBILE_BREAKPOINT);
		}
	}

	onMount(() => {
		updateWidth();
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	});

	$: centered = $page.url.pathname === "/dashboard";
</script>

<main class="flex flex-col md:flex-row justify-between w-full">
	<div class="z-40 text-xs w-full md:w-auto">
		<Nav isMobile={$isMobile} />
	</div>

	<div class="flex flex-col md:flex-row w-full">
		{#if browser}
			<div
				class={`
                ${centered ? "w-full md:w-1/2" : "w-full md:w-1/5"}
                ${$isMobile ? "z-30" : "fixed"}
            `}
			>
				<Directory isMobile={$isMobile} />
			</div>
		{/if}

		<div
			class={`
            w-full 
            ${$isMobile ? "m-auto" : "md:ml-auto md:w-4/5"}
            ${centered && !$isMobile ? "md:w-1/2" : ""}
        `}
		>
			<slot />
		</div>
	</div>
</main>
