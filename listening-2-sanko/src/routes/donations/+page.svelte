<!-- routes/donations/+page.svelte -->
<script>
	import Donations from "$lib/components/Donations.svelte";
	import Notifications from "$lib/components/Notifications.svelte";
	import { onMount } from "svelte";
	import { dev } from "$app/environment";
	import { setupEventSource, testDonation } from "$lib/eventHandler";

	onMount(() => {
		const eventSource = setupEventSource();
		return () => {
			eventSource.close();
		};
	});
</script>

<div class="bg-blue-600 p-4 min-h-screen">
	<Notifications />

	{#if dev}
		<button
			on:click={testDonation}
			class="fixed top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold"
		>
			simulate donation
		</button>
	{/if}
</div>
