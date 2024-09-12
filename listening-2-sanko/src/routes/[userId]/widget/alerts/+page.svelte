<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Alert } from "$lib/stores/alertConfigStore";
    import DonationAlerts from "$lib/components/DonationAlerts.svelte";
    import { page } from "$app/stores";

    export let data:
        | { userAlerts: Alert[]; streamerAddress: string }
        | undefined;

    let error: string | null = null;

    $: {
        if (!data) {
            error = "user not found or an error occurred while loading data";
        } else {
            console.log("received data: ", data);
        }
    }

    interface GiftEvent {
        type: "GIFT";
        attributes: {
            giftName: string;
            quantity: string;
            name: string;
        };
    }

    type DonationEvent = GiftEvent;

    let currentAlert: Alert | null = null;
    let donationEvent: DonationEvent | null = null;
    let statusMessage: string = "";
    let socket: WebSocket;

    $: userId = $page.params.userId;

    $: if (data) {
        console.log("Data received from server:", data);
        console.log("User Alerts:", data.userAlerts);
        console.log("Streamer Address:", data.streamerAddress);
    }

    onMount(() => {
        connectWebSocket();
    });

    onDestroy(() => {
        if (socket) {
            socket.close();
        }
    });

    function connectWebSocket() {
        const uniqueId = crypto.randomUUID();
        socket = new WebSocket(
            `wss://chat.sanko.tv/ws?streamerAddress=${data.streamerAddress}&uniqueId=${uniqueId}`,
        );

        socket.onopen = () => {
            console.log(`Connected to Sanko.tv chat for user ${userId}`);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received:", message);

            if (message.event === "GIFT") {
                handleGiftEvent(message.data.event);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket closed. Attempting to reconnect...");
            setTimeout(connectWebSocket, 5000);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    function handleGiftEvent(event: GiftEvent) {
        donationEvent = event;
        currentAlert =
            data.userAlerts.find((alert) => {
                if (alert.config.eventTrigger === "GIFT" && alert.isActive) {
                    if (alert.config.specificGift) {
                        return (
                            alert.config.specificGift.toLowerCase() ===
                            event.attributes.giftName.toLowerCase()
                        );
                    }
                    return true;
                }
                return false;
            }) || null;

        console.log(
            `${event.attributes.name} SENT ${event.attributes.quantity} ${event.attributes.giftName}${parseInt(event.attributes.quantity) > 1 ? "s!" : "!"}`,
        );
        statusMessage = `Alert triggered: ${event.attributes.name} sent ${event.attributes.quantity} ${event.attributes.giftName}`;
    }

    function handleAlertCompleted() {
        currentAlert = null;
        donationEvent = null;
        statusMessage = "Alert completed";
    }

    function handleUpdateDuration(event: CustomEvent<number>) {
        if (currentAlert) {
            const updatedAlert = {
                ...currentAlert,
                config: {
                    ...currentAlert.config,
                    alertDuration: event.detail,
                },
            };
            // You might want to implement a way to update this on the server
        }
    }
</script>

<main class="text-white font-mono">

    {#if error}
        <p class="text-red-600">{error}</p>
    {:else if data}
        <h1>user {$page.params.userId}</h1>
        <p>address: {data.streamerAddress}</p>
        <p>alert count: {data.userAlerts.length}</p>
    {:else}
        loading...
    {/if}

    {#if currentAlert && donationEvent}
        <div class="text-lime-400 z-50">
            <DonationAlerts
                alert={currentAlert}
                giftEvent={donationEvent}
                on:alertComplete={handleAlertCompleted}
                on:updateDuration={handleUpdateDuration}
            />
        </div>
    {/if}
</main>

<style>
    .test-controls {
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .test-controls label {
        display: block;
    }

    .test-controls input {
        margin-left: 0px;
    }

    .test-controls button {
        margin-top: 0px;
    }

    input {
        background-color: black;
        padding: 0em;
    }
</style>
