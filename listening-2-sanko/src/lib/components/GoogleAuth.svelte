<script lang="ts">
    import { supabase } from "$lib/supabaseClient";

    async function signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) console.error("Error signing in with Google:", error);
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Error signing out:", error);
    }
</script>

<button on:click={signInWithGoogle}>Sign in with Google</button>
<button on:click={signOut}>Sign Out</button>
