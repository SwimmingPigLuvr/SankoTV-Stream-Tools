<script lang="ts">
    import { browser } from "$app/environment";
    import { walletStore } from "$lib/contracts/walletStores";
    import { onMount } from "svelte";

    let isConnecting = false;
    let isAuthenticating = false;
    let error = "";

    onMount(() => {
        if (browser) {
            checkConnection();
        }
    });

    async function checkConnection() {
        try {
            await walletStore.checkConnection();
        } catch (err) {
            console.error("Failed to check connection:", err);
            error = "Failed to check wallet connection. Please try again.";
        }
    }

    async function connectWallet() {
        isConnecting = true;
        error = "";
        try {
            await walletStore.connect();
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            error =
                "Failed to connect wallet. Please make sure you have MetaMask installed and try again.";
        } finally {
            isConnecting = false;
        }
    }

    async function authenticateWallet() {
        isAuthenticating = true;
        error = "";
        try {
            await walletStore.authenticate();
        } catch (err) {
            console.error("Failed to authenticate wallet:", err);
            error = "Failed to authenticate. Please try again.";
        } finally {
            isAuthenticating = false;
        }
    }
</script>

{#if browser}
    {#if $walletStore.address}
        <p>Connected: {$walletStore.address}</p>
        {#if $walletStore.isAuthenticated}
            <p>Authenticated</p>
        {:else}
            <button on:click={authenticateWallet} disabled={isAuthenticating}>
                {isAuthenticating ? "Authenticating..." : "Authenticate"}
            </button>
        {/if}
    {:else}
        <button on:click={connectWallet} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
    {/if}

    {#if error}
        <p class="error">{error}</p>
    {/if}
{/if}

<style>
    button {
        padding: 10px 20px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
    .error {
        color: red;
    }
</style>
