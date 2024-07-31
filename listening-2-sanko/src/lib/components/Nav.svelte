<!-- src/lib/components/Nav.svelte -->
<script lang="ts">
    import { user } from "$lib/stores/authStore";
    import { supabase } from "$lib/supabaseClient";

    let isLoading = false;
    let error: string | null = null;

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
</script>

<nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
        <a href="/" class="text-xl font-bold">StarLabs</a>
        <div>
            {#if $user}
                <a href="/dashboard" class="mr-4">Dashboard</a>
            {/if}
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
