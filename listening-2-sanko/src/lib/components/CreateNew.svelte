<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { alertConfig, type AlertConfig } from "$lib/stores/alertConfig";
    import { userData } from "$lib/stores/userDataStore";

    const dispatch = createEventDispatcher<{
        close: void;
        alertCreated: { name: string; config: AlertConfig };
    }>();

    let alertName = "";
    let error = "";

    function handleSubmit() {
        if (!alertName.trim()) {
            error = "Please enter a name for your alert.";
            return;
        }

        // Create a new alert with the default config
        const newAlert = {
            name: alertName,
            config: $alertConfig,
        };

        // Update user data
        userData.updateDataField("donationAlerts", [
            ...($userData?.data.donationAlerts || []),
            newAlert,
        ]);

        dispatch("alertCreated", newAlert);
        dispatch("close");
    }

    function handleClose() {
        dispatch("close");
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
        <div class="flex justify-between">
            <button
                on:click={handleSubmit}
                class="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Create Alert
            </button>
            <button
                on:click={handleClose}
                class="bg-gray-300 text-black px-4 py-2 rounded"
            >
                Cancel
            </button>
        </div>
    </div>
</div>
