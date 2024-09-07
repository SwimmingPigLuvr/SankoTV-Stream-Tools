<!-- routes/widgets/alerts/[userId]/+page.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Alert } from "$lib/stores/alertConfigStore";
    import DonationAlerts from "$lib/components/DonationAlerts.svelte";
    import { userData } from "$lib/stores/userDataStore";

    interface GiftEvent {
        type: "GIFT";
        attributes: {
            giftName: string;
            quantity: string;
            name: string;
        };
    }

    type DonationEvent = GiftEvent; // Add other event types here when implemented

    let currentAlert: Alert | null = null;
    let donationEvent: DonationEvent | null = null;

    let testGiftName: string = "Zyn";
    let testQuantity: string = "1";
    let testSenderName: string = "TestUser";

    let statusMessage: string = "";

    // Subscribe to userData store
    $: userAlerts = $userData?.data?.donationAlerts || [];
    $: userId = $userData?.id;

    let intervalId: ReturnType<typeof setInterval>;

    onMount(() => {
        if (userId) {
            intervalId = setInterval(fetchLatestEvent, 1000);
        }

        currentAlert =
            userAlerts.find((alert) => alert.name === "cofeeeeeee") || null;
        if (currentAlert) {
            donationEvent = {
                type: "GIFT",
                attributes: {
                    giftName: testGiftName,
                    quantity: testQuantity,
                    name: testSenderName,
                },
            };
        }
    });

    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        // Close the WebSocket connection when the component is destroyed
        if (userId) {
            fetch(`/widgets/alerts/${userId}`, { method: "DELETE" })
                .then(() => console.log("WebSocket connection closed"))
                .catch((error) =>
                    console.error("Error closing WebSocket connection:", error),
                );
        }
    });

    async function fetchLatestEvent() {
        try {
            const response = await fetch(`/widgets/alerts/${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch latest event");
            }
            const data = await response.json();
            if (data.lastEvent && data.lastEvent.event === "GIFT") {
                handleGiftEvent(data.lastEvent.data.event);
            }
        } catch (error) {
            console.error("Error fetching latest event:", error);
            statusMessage = "Error fetching events. Please refresh the page.";
        }
    }

    function handleGiftEvent(event: GiftEvent) {
        donationEvent = event;
        currentAlert =
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
            userData.updateDonationAlert(updatedAlert);
        }
    }

    async function sendTestAlert() {
        const testEvent: GiftEvent = {
            type: "GIFT",
            attributes: {
                giftName: testGiftName,
                quantity: testQuantity,
                name: testSenderName,
            },
        };

        try {
            const response = await fetch(`/widgets/alerts/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(testEvent),
            });

            if (!response.ok) {
                throw new Error("Failed to send test event");
            }

            console.log("Test event sent successfully");
            statusMessage =
                "Test event sent successfully. Waiting for alert...";
        } catch (error) {
            console.error("Error sending test event:", error);
            statusMessage = "Error sending test event. Please try again.";
        }
    }
</script>

<main class="text-white font-mono">
    {#if currentAlert && donationEvent}
        <div class="text-lime-400 z-50">
            a
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

    .status-message {
        margin-top: 0px;
        padding: 0px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }
</style>
