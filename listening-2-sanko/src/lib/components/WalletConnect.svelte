<script lang="ts">
    import { walletStore } from "$lib/contracts/walletStores";

    async function connectWallet() {
        await walletStore.connect();
    }

    async function authenticateWallet() {
        await walletStore.authenticate();
    }
</script>

{#if $walletStore.address}
    <p>connected: {$walletStore.address}</p>
    {#if $walletStore.isAuthenticated}
        <p>Authenticated</p>
    {:else}
        <button on:click={authenticateWallet}>Authenticate</button>
    {/if}
{:else}
    <button on:click={connectWallet}>Connect Wallet</button>
{/if}
