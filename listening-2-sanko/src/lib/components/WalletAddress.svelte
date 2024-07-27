<script>
    import { walletStore } from "$lib/walletStores";
    import { isDarkMode } from "$lib/stores";
    import { truncateAddress } from "$lib/utils";
    import { fly } from "svelte/transition";
    walletStore;

    let showDisconnect = false;

    function handleClickWalletAddress() {
        showDisconnect = true;
        setTimeout(() => {
            showDisconnect = false;
        }, 4000);
    }

    $: truncatedAddress = $walletStore.address
        ? truncateAddress($walletStore.address)
        : "";
</script>

<button
    in:fly={{ y: -10 }}
    on:click={handleClickWalletAddress}
    class="transform transition-all duration-500 ease-out rounded-full flex justify-between space-x-4 items-center {$isDarkMode
        ? 'bg-blue-700'
        : 'bg-blue-300 text-slate-800'} px-4 p-2 font-mono text-xs -tracking-widest"
>
    <button class="">
        {truncatedAddress}
    </button>
    {#if showDisconnect}
        <button class="font-bold" on:click={() => walletStore.disconnect()}>
            Disconnect
        </button>
    {/if}
</button>
