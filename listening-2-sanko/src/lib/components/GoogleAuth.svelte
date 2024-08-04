<!-- $lib/components/GoogleAuth.svelte -->
<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { user } from "$lib/stores/authStore";
    import { userData } from "$lib/stores/userDataStore";
    import { blur } from "svelte/transition";
    import { onMount } from "svelte";

    let isLoading = false;
    let error: string | null = null;

    async function handleNewUser(userId: string) {
        try {
            console.log("Attempting to upsert user:", { userId });
            const { data, error: upsertError } = await supabase
                .from("users")
                .upsert({
                    id: userId,
                    data: {},
                })
                .single();

            if (upsertError) {
                console.error("Error upserting user:", upsertError);
                throw upsertError;
            }

            console.log("User record ensured in the database:", data);
            await userData.fetch();
        } catch (err) {
            console.error("Failed to handle new user:", err);
            error = "Failed to create/update user record";
        }
    }

    async function signInWithGoogle() {
        isLoading = true;
        error = null;
        try {
            const { data, error: signInError } =
                await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: "http://localhost:5173/auth/callback",
                    },
                });
            if (signInError) throw signInError;
        } catch (err) {
            console.error("Error signing in with Google:", err);
            error =
                err instanceof Error
                    ? err.message
                    : "An error occurred during sign in";
        } finally {
            isLoading = false;
        }
    }

    async function signOut() {
        isLoading = true;
        error = null;
        try {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;
        } catch (err) {
            console.error("Error signing out:", err);
            error =
                err instanceof Error
                    ? err.message
                    : "An error occurred during sign out";
        } finally {
            isLoading = false;
        }
    }

    onMount(async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
            await handleNewUser(session.user.id);
        }
    });

    // Ensure user data is updated after successful sign-in
    $: if ($user && !$userData) {
        handleNewUser($user.id);
    }
</script>

{#if $user}
    <button
        on:click={signOut}
        class="flex items-center space-x-4 hover:bg-red-900 text-red-500 font-bold font-mono w-40 m-auto border-red-500 border-[1px] hover:text-white py-2 px-4 rounded-full"
        disabled={isLoading}
    >
        <img class="h-4 pr-4" src="logos/google_g_logo.svg" alt="" />
        {isLoading ? "Signing out..." : "Sign out"}
    </button>
{:else}
    <button
        in:blur
        on:click={signInWithGoogle}
        class="bg-white text-black flex items-center hover:bg-blue-700 font-mono font-bold py-2 px-4 rounded-full"
        disabled={isLoading}
    >
        <img class="h-4 pr-4" src="logos/google_g_logo.svg" alt="" />
        {isLoading ? "Signing in..." : "Sign in with Google"}
    </button>
{/if}

{#if error}
    <p class="text-red-500 mt-2">{error}</p>
{/if}
