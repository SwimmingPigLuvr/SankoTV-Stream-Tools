<!-- src/routes/auth/callback/+page.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabaseClient";

    onMount(async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("Error getting session:", error);

        // Redirect to home page after successful sign-in
        goto("/");
    });
</script>

<p>Completing sign-in, please wait...</p>
