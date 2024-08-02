<!-- $lib/components/GoogleSignIn.svelte -->
<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { user } from "$lib/stores/authStore";
    import { blur } from "svelte/transition";
    import { onMount } from "svelte";

    let isLoading = false;
    let error: string | null = null;

    async function handleNewUser(userId: string, userEmail: string) {
        try {
            const { data, error: checkError } = await supabase
                .from("users")
                .select("id")
                .eq("id", userId)
                .single();

            if (checkError && checkError.code !== "PGRST116") {
                console.error("error checking for existing user:", checkError);
                throw checkError;
            }

            if (!data) {
                const { error: insertError } = await supabase
                    .from("users")
                    .insert({ id: userId, email: userEmail });

                if (insertError) {
                    console.error("error inserting new user:", insertError);
                    throw insertError;
                }
            }

            console.log("user record ensured in the database");
        } catch (err) {
            console.error("failed to ahndle new user:", err);
            error = "failed to create user record";
        }
    }

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

    onMount(async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
            await handleNewUser(session.user.id, session.user.email || "");
        }
    });
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
