<!-- lib/components/WalletAuth.svelte -->
<script lang="ts">
    import { ethers } from "ethers";
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabaseClient";
    import { walletStore } from "$lib/walletStores";
    import { truncateAddress } from "$lib/utils";
    import { browser } from "$app/environment";
    import { user } from "$lib/stores/authStore";
    import { isDarkMode } from "$lib/stores";
    import { fly, slide } from "svelte/transition";
    import { backOut } from "svelte/easing";

    export let isNav: boolean = false;

    let isConnected = false;
    let address: string | null = null;
    let error: string | null = null;
    let isConnecting = false;

    let showDisconnect = false;

    $: truncatedAddress = $walletStore.address
        ? truncateAddress($walletStore.address)
        : "";

    async function handleConnect() {
        isConnecting = true;
        error = "";
        try {
            const result = await walletStore.connect();
            if (!result.success) {
                throw new Error(result.error || "Failed to connect wallet");
            }
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            error =
                err instanceof Error
                    ? err.message
                    : "Failed to connect wallet. Please make sure you are connected to Sanko Testnet and try again.";
        } finally {
            isConnecting = false;
        }
    }

    function handleClickAddress() {

    }
</script>

<div class="m-auto">
    {#if $walletStore.address}
        <!-- wallet address + disconnect button -->
        <button
            on:click={() => showDisconnect = true}
            in:fly={{ y: -10 }}
            class="rounded-full flex justify-between space-x-4 items-center {$isDarkMode
                ? 'bg-blue-700'
                : 'bg-blue-300 text-slate-800'} px-4 p-2 font-mono text-xs -tracking-widest"
        >
            <button class="">
                {truncatedAddress}
            </button>
            {#if showDisconnect}
                <button
                    class="font-bold"
                    on:click={() => walletStore.disconnect()}
                >
                    Disconnect
                </button>
            {/if}
        </button>
    {:else}
        <!-- connect wallet -->
        <button
            in:slide={{
                easing: backOut,
                delay: 1000,
                duration: 1000,
            }}
            class="transform transition-all duration-100 ease-[backOut] border-blue-700 border-[1px] {$isDarkMode
                ? 'text-white hover:bg-blue-900'
                : 'text-blue-700 bg-white hover:bg-blue-700 hover:text-white'} {isNav ? 'text-xs' : 'text-md'} font-serif italic p-2 -tracking-wider px-4 rounded-full"
            on:click={handleConnect}
            disabled={isConnecting}
        >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
    {/if}
</div>
