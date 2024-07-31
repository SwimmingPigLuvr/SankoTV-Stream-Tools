<script>
	import Directory from "$lib/components/Directory.svelte";
	import Nav from "$lib/components/Nav.svelte";
	import { page } from "$app/stores";
	

	// Reactive statement to determine layout based on URL
	$: centered = $page.url.pathname === "/dashboard";
</script>

<Nav />

<main class="flex justify-between w-full">
	<!-- Conditional classes based on URL -->
	<div class={centered ? "mx-auto w-1/2" : "fixed w-1/4"}>
		<Directory />
	</div>
	<!-- Slot visibility based on URL -->
	{#if !centered}
		<div class="ml-auto w-full md:w-3/4">
			<slot />
		</div>
	{/if}
</main>

<style>
	/* Centering styles in case additional customization is needed */
	.mx-auto {
		margin-left: auto;
		margin-right: auto;
	}
</style>

