<script>
	import WalletConnect from "$lib/components/WalletConnect.svelte";
	import "../app.css";
</script>

<nav>
	<WalletConnect />
</nav>
<body class="h-screen bg-black">
	<slot />
</body>
