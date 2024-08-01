<!-- src/lib/components/Nav.svelte -->
<script lang="ts">
    import { isDarkMode, showDirectory } from "$lib/stores";
    import { user } from "$lib/stores/authStore";
    import { supabase } from "$lib/supabaseClient";
    import { backOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import AnimatedText from "./AnimatedText.svelte";
    import WalletAddress from "$lib/components/WalletAddress.svelte";
    import { page } from "$app/stores";

    export let isMobile: boolean;

    let isUrlDashboard: boolean;
    $: isUrlDashboard = $page.url.pathname === "/dashboard";

    let isLoading = false;
    let error: string | null = null;

    let showMoreAuth = false;

    async function handleAuth() {
        if ($user) {
            // Log out
            isLoading = true;
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) {
                console.error("Error signing out:", signOutError);
                error = signOutError.message;
            }
            isLoading = false;
        } else {
            // Log in with Google
            isLoading = true;
            const { error: signInError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: "http://localhost:5173/auth/callback",
                },
            });
            if (signInError) {
                console.error("Error signing in with Google:", signInError);
                error = signInError.message;
            }
            isLoading = false;
        }
    }

    function toggleDir() {
        showDirectory.set(!$showDirectory);
    }
</script>

<nav class="text-white z-20">
    <div class="w-full mx-auto flex justify-between items-center">
        {#if !isUrlDashboard}
            <button
                on:click={toggleDir}
                class="{isMobile ? '' : 'hidden'} fixed top-2 left-2"
            >
                {#if $showDirectory}
                    close
                {:else}
                    menu
                {/if}
            </button>
        {/if}
        <a
            href="/"
            class="fixed top-2 {isMobile
                ? 'left-1/2 -translate-x-1/2'
                : 'left-4'} font-coolfont-pix-outlined {$isDarkMode
                ? 'text-yellow-100 title-glow-hover '
                : 'text-white title-glow-blue-hover'} text-xl items-center flex space-x-0"
        >
            <p class="text-[1.5rem]">
                StarLabs <span class="text-[1rem]">⭐️🧪</span>
            </p>
        </a>

        <div>
            <div class="absolute top-2 right-2"><WalletAddress /></div>
            {#if showMoreAuth}
                <button
                    on:click={handleAuth}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isLoading}
                >
                    {#if isLoading}
                        Processing...
                    {:else if $user}
                        Log Out
                    {:else}
                        Log In
                    {/if}
                </button>
            {/if}
        </div>
    </div>
</nav>

{#if error}
    <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
    >
        <span class="block sm:inline">{error}</span>
    </div>
{/if}
