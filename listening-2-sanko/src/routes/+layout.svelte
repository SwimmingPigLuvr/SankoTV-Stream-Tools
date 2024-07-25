<script lang="ts">
	import { walletStore } from "$lib/contracts/walletStores";
	import { isDarkMode } from "$lib/stores";
	import "../app.css";

	function toggleDarkMode() {
		isDarkMode.set(!$isDarkMode);
	}
</script>

<body class="bg-slate-900">
	<button
		on:click={toggleDarkMode}
		class="flex fixed top-2 left-2 w-10 h-10 justify-center items-center p-2 hover:bg-slate-500 rounded-full"
	>
		{#if $isDarkMode}
			<p class="text-amber-300 text-3xl">☼</p>
		{:else}
			<p class="text-black">☾</p>
		{/if}
	</button>

	<slot />

	<footer>
		<!-- Your footer content -->
	</footer>
</body>
