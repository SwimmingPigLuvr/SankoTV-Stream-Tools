<script lang="ts">
    import { isDarkMode } from "$lib/stores";
    import { userData } from "$lib/stores/userDataStore";
    import GoogleAuth from "./GoogleAuth.svelte";
    import WalletAuth from "./WalletAuth.svelte";
</script>

{#if $userData}
    <h1 class="font-mono mb-6 text-xl">
        Welcome, {$userData.username ?? "anon"}!
    </h1>
    <a
        class="px-4 p-2 {$isDarkMode
            ? 'border-white'
            : 'border-slate-800'} border-[1px] hover:text-lime-400 hover:bg-slate-950 rounded-full font-coolfont text-xl"
        href="/dashboard">Dashboard</a
    >
    <WalletAuth />
    <GoogleAuth />
{:else}
    <p>Loading user data...</p>
{/if}
