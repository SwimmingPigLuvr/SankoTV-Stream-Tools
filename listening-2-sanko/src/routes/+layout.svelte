<script lang="ts">
	import { walletStore } from "$lib/walletStores";
	import { isDarkMode } from "$lib/stores";
	import { onMount } from "svelte";
	import "../app.css";
	import { browser } from "$app/environment";
	import DarkMode from "$lib/components/DarkMode.svelte";

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

	<slot />

	<footer>
		<!-- Your footer content -->
	</footer>
</body>
