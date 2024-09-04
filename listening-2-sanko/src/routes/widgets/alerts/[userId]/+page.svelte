<script lang="ts">
    import { onMount } from "svelte";
    import type {
        AlertConfig,
        Alert,
        DonationEvent,
    } from "$lib/stores/alertConfigStore";
    import DonationAlerts from "$lib/components/DonationAlerts.svelte";

    export let data: { user: { alerts: Alert[] } };

    let currentAlert: Alert | null;
    let donationEvent: DonationEvent | null = null;

    let alerts: AlertConfig[] = [];

    let wsUrl: string;

    onMount(() => {
        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.event === "GIFT") {
                donationEvent = message.data.event as DonationEvent;
                currentAlert =
                    data.user.alerts.find(
                        (alert) => alert.config.eventTrigger === "GIFT",
                    ) || null;
            }
        };

        return () => {
            socket.close();
        };
    });

    function handelAlertCompleted() {
        currentAlert = null;
        donationEvent = null;
    }

    function handleUpdateDuration(event: CustomEvent<number>) {
        if (currentAlert) {
            currentAlert.config.alertDuration = event.detail;
        }
    }
</script>

<div>hello you have reached starlabs.com/widgets/alerts/{user.id}</div>

{#if currentAlert && donationEvent}
    <DonationAlerts
        alert={currentAlert}
        giftEvent={donationEvent}
        on:alertComplete={handelAlertCompleted}
        on:updateDuration={handleUpdateDuration}
    />
{/if}
