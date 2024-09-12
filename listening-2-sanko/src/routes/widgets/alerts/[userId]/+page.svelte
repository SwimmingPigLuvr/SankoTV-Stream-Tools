<!-- routes/widgets/alerts/[userId]/+page.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Alert } from "$lib/stores/alertConfigStore";
    import DonationAlerts from "$lib/components/DonationAlerts.svelte";
    import { userData } from "$lib/stores/userDataStore";
    import { page } from "$app/stores";

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
    let intervalId: ReturnType<typeof setInterval>;

    $: userId = $page.params.userId;
    $: userAlerts = $userData?.data?.donationAlerts || [];

    onMount(() => {
        if (userId) {
            intervalId = setInterval(fetchLatestEvent, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (userId) {
                fetch(`/widgets/alerts/${userId}`, { method: "DELETE" })
                    .then(() => console.log("WebSocket connection closed"))
                    .catch((error) =>
                        console.error(
                            "Error closing WebSocket connection:",
                            error,
                        ),
                    );
            }
        };
    });

    async function fetchLatestEvent() {
        try {
            const response = await fetch(`/widgets/alerts/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch latest event");
            const data = await response.json();
            if (data.lastEvent) {
                if (data.lastEvent.event === "GIFT") {
                    handleGiftEvent(data.lastEvent.data.event);
                } else if (data.lastEvent.event === "CHAT") {
                    handleChatEvent(data.lastEvent.data);
                }
            }
        } catch (error) {
            console.error("Error fetching latest event:", error);
            statusMessage = "Error fetching events. Please refresh the page.";
        }
    }

    function handleGiftEvent(event: GiftEvent) {
        donationEvent = event;
        currentAlert = findMatchingAlert(event);
        logAndUpdateStatus(event);
    }

    function handleChatEvent(chatData: { sender: string; content: string }) {
        statusMessage = `${chatData.sender}: ${chatData.content}`;
    }

    function findMatchingAlert(event: GiftEvent): Alert | null {
        return (
            userAlerts.find((alert) => {
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
            }) || null
        );
    }

    function logAndUpdateStatus(event: GiftEvent) {
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
            userData.updateDonationAlert(updatedAlert);
        }
    }
</script>

<main>
    {#if currentAlert && donationEvent}
        <div class="alert-container">
            <DonationAlerts
                alert={currentAlert}
                giftEvent={donationEvent}
                on:alertComplete={handleAlertCompleted}
                on:updateDuration={handleUpdateDuration}
            />
        </div>
    {/if}
    <p class="status-message">{statusMessage}</p>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        background-color: transparent;
        overflow: hidden;
    }

    .alert-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    .status-message {
        position: absolute;
        bottom: 10px;
        left: 10px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
    }
</style>
