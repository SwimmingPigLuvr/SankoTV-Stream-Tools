<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { supabase } from "$lib/supabaseClient";
    import { user } from "$lib/stores/authStore";
    import { alertConfig } from "$lib/stores/alertConfigStore";

    const dispatch = createEventDispatcher();

    let alertName = "";
    let error = "";

    async function handleSubmit() {
        if (!alertName.trim()) {
            error = "Please enter a name for your alert.";
            return;
        }

        try {
            const { data, error: insertError } = await supabase
                .from("user_alerts")
                .insert({
                    user_id: $user?.id,
                    name: alertName,
                    config: $alertConfig,
                })
                .single();

            if (insertError) throw insertError;

            dispatch("alertCreated", data);
        } catch (err) {
            console.error("Error creating alert:", err);
            error = "Failed to create alert. Please try again.";
        }
    }
</script>

<div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
>
    <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 class="text-2xl mb-4">Name Your Alert</h2>
        <input
            bind:value={alertName}
            type="text"
            placeholder="Enter alert name"
            class="w-full p-2 border rounded mb-4"
        />
        {#if error}
            <p class="text-red-500 mb-4">{error}</p>
        {/if}
        <button
            on:click={handleSubmit}
            class="bg-blue-500 text-white px-4 py-2 rounded"
        >
            Create Alert
        </button>
    </div>
</div>
