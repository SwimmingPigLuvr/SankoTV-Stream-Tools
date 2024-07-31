<!-- $lib/components/GoogleSignIn.svelte -->
<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { user } from "$lib/stores/authStore";

    let isLoading = false;
    let error: string | null = null;

    async function signInWithGoogle() {
        isLoading = true;
        error = null;
        const { data, error: signInError } =
            await supabase.auth.signInWithOAuth({
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

    async function signOut() {
        isLoading = true;
        error = null;
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
            console.error("Error signing out:", signOutError);
            error = signOutError.message;
        }
        isLoading = false;
    }
</script>

{#if $user}
    <button
        on:click={signOut}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
    >
        {isLoading ? "Signing out..." : "Sign out"}
    </button>
{:else}
    <button
        on:click={signInWithGoogle}
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
    >
        {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
{/if}

{#if error}
    <p class="text-red-500 mt-2">{error}</p>
{/if}
