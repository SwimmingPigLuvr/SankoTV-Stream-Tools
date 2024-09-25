<!-- routes/widgets/alerts/[userId]/+page.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        gifts,
        type Gift,
        type Alert,
        type GiftEvent,
    } from "$lib/stores/alertConfigStore";
    import DonationAlerts from "$lib/components/DonationAlerts.svelte";
    import { userData } from "$lib/stores/userDataStore";
    import { page } from "$app/stores";
    import { normalizeGiftName } from "$lib/utils/normalizedGiftName";

    type DonationEvent = GiftEvent;

    let currentAlert: Alert | null = null;
    let donationEvent: DonationEvent | null = null;
    let statusMessage: string = "";
    let intervalId: ReturnType<typeof setInterval>;
    let isAlertActive = false;

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

    function getDonationAmount(
        giftName: Gift,
        quantity: string | number,
    ): number {
        const giftValue = gifts[giftName];
        if (!giftValue) {
            console.warn("unknown gift", giftName);
            return 0;
        }
        const qty =
            typeof quantity === "string" ? parseInt(quantity, 10) : quantity;
        return giftValue * qty;
    }

    async function fetchLatestEvent() {
        if (isAlertActive) return;

        try {
            const response = await fetch(`/widgets/alerts/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch latest event");
            const data: { lastEvent: GiftEvent } = await response.json();
            if (
                data.lastEvent &&
                data.lastEvent.event === "GIFT" &&
                !isAlertActive
            ) {
                handleGiftEvent(data.lastEvent);
            }
        } catch (error) {
            console.error("Error fetching latest event:", error);
            statusMessage = "Error fetching events. Please refresh the page.";
        }
    }

    function handleGiftEvent(event: GiftEvent) {
        if (isAlertActive) return;
        console.log("event", event);

        const attributes = event?.data?.attributes;
        if (!attributes || !attributes.giftName) {
            console.error("missing the giftName in the event attributes");
            return;
        }

        const { giftName, quantity, name } = attributes;

        isAlertActive = true;
        const donationAmount = getDonationAmount(giftName, quantity);
        donationEvent = {
            event: event.event,
            data: {
                ...event.data,
                donationAmount,
            },
        };

        if (event.data.isTest && event.data.alertId) {
            currentAlert =
                userAlerts.find((alert) => alert.id === event.data.alertId) ||
                null;
        } else {
            const normalizedGiftName = normalizeGiftName(attributes.giftName);
            if (!normalizedGiftName) {
                console.warn("invalid giftName", attributes.giftName);
                currentAlert = null;
            } else {
                currentAlert = findMatchingAlert(event, userAlerts);
            }
        }
        // TODO add donationHistory
    }

    function handleChatEvent(chatData: { sender: string; content: string }) {
        statusMessage = `${chatData.sender}: ${chatData.content}`;
    }

    function findMatchingAlert(
        event: GiftEvent,
        userAlerts: Alert[],
    ): Alert | null {
        return (
            userAlerts.find((alert) => {
                if (!alert.isActive) return false;

                const { eventTrigger, specificGift, specificAmount } =
                    alert.config;
                const donationAmount = getDonationAmount(
                    event.data.attributes.giftName,
                    event.data.attributes.quantity,
                );

                switch (eventTrigger) {
                    case "donation":
                        return true;
                    case "specificgift":
                        return (
                            normalizeGiftName(specificGift || "") ===
                            normalizeGiftName(event.data.attributes.giftName)
                        );
                    case "atleast":
                        return (
                            specificAmount !== undefined &&
                            donationAmount >= specificAmount
                        );
                    case "exactamount":
                        return (
                            specificAmount !== undefined &&
                            donationAmount === specificAmount
                        );
                    case "topdonation":
                        // implement topdonation logic right when the donation is received
                        // create store with donation history?
                        // save to user's data
                        // create new data obj for an array of donations
                        let isTop = false;
                        // check against top donations for given time parameter
                        return isTop;
                    default:
                        return false;
                }
            }) || null
        );
    }

    function handleAlertCompleted() {
        currentAlert = null;
        donationEvent = null;
        statusMessage = "Alert completed";
        isAlertActive = false;
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
    {#if currentAlert && donationEvent && isAlertActive}
        <div class="alert-container">
            <DonationAlerts
                alert={currentAlert}
                giftEvent={donationEvent}
                on:alertComplete={handleAlertCompleted}
                on:updateDuration={handleUpdateDuration}
            />
        </div>
    {/if}
    <p class="status-message font-mono">{statusMessage}</p>
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
        top: 0;
        left: 0;
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
