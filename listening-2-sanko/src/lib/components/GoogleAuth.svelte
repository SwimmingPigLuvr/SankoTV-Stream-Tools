<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { goto } from "$app/navigation";

    // Function to sign in using Google OAuth
    async function signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "http://localhost:5173/dashboard",
            },
        });

        if (error) {
            console.error("Error signing in with Google:", error);
            // Handle error (e.g., show error message to user)
        } else {
            // Handle successful sign-in (e.g., redirect to dashboard)
            console.log("Signed in successfully:", data);
            goto("/dashboard");
        }
    }
</script>

<!-- Buttons for user actions -->
<button
    on:click={signInWithGoogle}
    class="bg-white items-center text-left flex justify-start hover:bg-black hover:text-white text-black font-bold font-mono -tracking-wide p-2 px-4 rounded-full"
>
    <img class="h-4" src="/logos/google_g_logo.svg" alt="" />
    <p class="pl-2">Sign in with Google</p>
</button>
