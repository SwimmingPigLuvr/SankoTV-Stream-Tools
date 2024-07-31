<script lang="ts">
	import WalletAddress from "$lib/components/WalletAddress.svelte";
	import { walletStore } from "$lib/walletStores";
	import { isDarkMode, isMobile } from "$lib/stores";
	import { fly, slide } from "svelte/transition";



	let userData: any;
	walletStore.subscribe((store) => {
		userData = store.userData;
	});
</script>

<main
	class="p-4 min-h-screen font-mono {$isDarkMode
		? 'bg-slate-900 text-white'
		: 'bg-yellow-100 text-slate-800'}"
>
	<div class="fixed top-2 right-2">
		<WalletAddress />
	</div>

</main>
