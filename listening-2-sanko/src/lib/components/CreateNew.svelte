<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import {
        alertConfig,
        type AlertConfig,
        type Alert,
    } from "$lib/stores/alertConfigStore";
    import { userData } from "$lib/stores/userDataStore";
    import { isDarkMode } from "$lib/stores";
    import { v4 as uuidv4 } from "uuid";

    interface AlertCreatedEvent {
        id: string;
        name: string;
        config: AlertConfig;
        isActive: boolean;
    }

    const dispatch = createEventDispatcher<{
        alertCreated: AlertCreatedEvent;
        close: void;
    }>();

    let alertName = "";
    let error = "";

    const newAlertId = uuidv4();

    function createNewAlert(name: string) {
        const newAlert: Alert = {
            id: newAlertId,
            name: name,
            config: $alertConfig,
        }
    }

    function handleSubmit() {
        if (!alertName.trim()) {
            error = "Please enter a name for your alert.";
            return;
        }

        const newAlertId = uuidv4();

        // Create a new alert with the default config
        const newAlert: AlertCreatedEvent = {
            id: newAlertId,
            name: alertName,
            config: $alertConfig,
        };

        // Update user data
        userData.updateDataField("donationAlerts", [
            ...($userData?.data.donationAlerts || []),
            newAlert,
        ]);

        dispatch("alertCreated", newAlert);
    }

    function handleClose() {
        dispatch("close");
    }
</script>

<div
    class="z-40 fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
>
    <div
        class="z-50 {$isDarkMode
            ? 'bg-slate-800 text-slate-200'
            : 'bg-blue-200 text-blue-800'} p-6 rounded-none border-[1px] max-w-md w-full"
    >
        <h2 class="text-2xl">Name Your Alert</h2>
        <h3
            class="text-xs {$isDarkMode
                ? 'text-slate-400'
                : 'text-blue-600'} mb-4"
        >
            (you can change this later)
        </h3>
        <input
            bind:value={alertName}
            type="text"
            placeholder="Enter alert name"
            class="w-full px-4 p-2 border text-black rounded-full mb-4"
        />
        {#if error}
            <p class="text-red-500 mb-4">{error}</p>
        {/if}
        <div class="flex justify-end space-x-2 text-xs">
            <button
                on:click={handleSubmit}
                class="bg-blue-500 text-white px-4 py-2 rounded-none"
            >
                Create Alert
            </button>
            <button
                on:click={handleClose}
                class="bg-gray-300 text-black px-4 py-2 rounded-none"
            >
                Cancel
            </button>
        </div>
    </div>
</div>
