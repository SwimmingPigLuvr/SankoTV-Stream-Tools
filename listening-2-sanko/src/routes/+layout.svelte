<script lang="ts">
	import { walletStore } from "$lib/contracts/walletStores";
	import "../app.css";
</script>

<body class="bg-slate-900">
	<nav>
		<!-- Your navigation items -->
		{#if $walletStore.isAuthenticated}
			<a href="/dashboard">Dashboard</a>
			<!-- Other authenticated-only nav items -->
		{/if}
	</nav>

	<slot />

	<footer>
		<!-- Your footer content -->
	</footer>
</body>
