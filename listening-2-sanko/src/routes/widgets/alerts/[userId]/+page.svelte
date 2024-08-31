<script lang="ts">
    import { onMount } from "svelte";
    import type { AlertConfig } from "$lib/stores/alertConfigStore";
    import DonationAlerts from "$lib/components/DonationAlerts.svelte";

    export let data;

    let currentAlert: AlertConfig | null = null;
    let donationEvent = null;

    let alerts: AlertConfig[] = [];

    let wsUrl: string;

    onMount(() => {
        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const newAlert = JSON.parse(event.data);
            alerts = [...alerts, newAlert];
        };

        return () => {
            socket.close();
        };
    });

    function handelAlertCompleted() {
        currentAlert = null;
        donationEvent = null;
    }
</script>

{#if currentAlert && donationEvent}
    <DonationAlerts
        alert={currentAlert}
        {donationEvent}
        on:alertComplete={handelAlertCompleted}
        on:updateDuration={(event) => {
            currentAlert.config.alertDuration = event.detail;
        }}
    />
{/if}
