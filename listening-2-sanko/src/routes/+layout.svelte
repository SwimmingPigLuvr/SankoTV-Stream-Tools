<script lang="ts">
	import { walletStore } from "$lib/contracts/walletStores";
	import { isDarkMode } from "$lib/stores";
	import { onMount } from "svelte";
	import "../app.css";
	import { browser } from "$app/environment";

	function toggleDarkMode() {
		isDarkMode.set(!$isDarkMode);
	}

	let isConnecting = false;
	let error = "";

	async function checkConnection() {
		try {
			const result = await walletStore.connect();
			if (result.success) {
				// redirect to dashboard
				// goto("/settings");
			}
		} catch (err) {
			console.error("Failed to check connection:", err);
			error = "failed to check connection. please try again please.";
		}
	}

	onMount(() => {
		if (browser) {
			checkConnection();
		}
	});
</script>

<body class="bg-slate-900">
	<button
		on:click={toggleDarkMode}
		class="flex fixed top-2 left-2 w-6 h-6 justify-center items-center p-2 hover:bg-slate-500 rounded-full"
	>
		{#if $isDarkMode}
			<p class="text-amber-300 text-xl">☼</p>
		{:else}
			<p class="text-black">☾</p>
		{/if}
	</button>

	<slot />

	<footer>
		<!-- Your footer content -->
	</footer>
</body>
