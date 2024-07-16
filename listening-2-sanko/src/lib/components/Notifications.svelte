<!-- lib/components/Notifications.svelte -->
<script lang="ts">
    import { backOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";
    import { currentDonations } from "../eventHandler";
    import { browser } from "$app/environment";

    let notificationSound: HTMLAudioElement;
    if (browser) {
        notificationSound = new Audio("/sounds/notification.mp3");
    }

    let prevLength = 0;

    function playNotificationSound() {
        if (browser && notificationSound) {
            notificationSound
                .play()
                .catch((error) =>
                    console.error("error playing audio: ", error),
                );
        }
    }

    $: if ($currentDonations.length > prevLength) {
        playNotificationSound();
        prevLength = $currentDonations.length;
    }
</script>

<div class="fixed top-4 left-4 flex flex-col gap-4">
    {#each $currentDonations as donation (donation.id)}
        <div
            in:fade
            out:fade
            class="donation-alert"
            style="
                --font-family: var(--alert-font-family, sans-serif);
                --font-size: var(--alert-font-size, 3rem);
                --font-weight: var(--alert-font-weight, 900);
                --text-color: var(--alert-text-color, #32CD32);
                --text-transform: var(--alert-text-transform, lowercase);
                --letter-spacing: var(--alert-letter-spacing, -0.05em);
                --text-shadow: var(--alert-text-shadow, none);
            "
        >
            <h1 in:fly={{ y: 100, duration: 500, easing: backOut }}>
                {donation.sender}
            </h1>
            <p in:fly={{ y: 200, duration: 500, easing: backOut, delay: 250 }}>
                donated
            </p>
            <p in:fly={{ y: 100, duration: 500, easing: backOut, delay: 500 }}>
                {donation.quantity}
            </p>

            <p in:fly={{ y: 200, duration: 500, easing: backOut, delay: 750 }}>
                {donation.quantity > 1 && donation.giftName !== "addys"
                    ? `${donation.giftName}s`
                    : donation.giftName}
            </p>
        </div>
    {/each}
</div>

<style>
    .donation-alert {
        font-family: var(--font-family);
        font-size: var(--font-size);
        font-weight: var(--font-weight);
        color: var(--text-color);
        text-transform: var(--text-transform);
        letter-spacing: var(--letter-spacing);
        text-shadow: var(--text-shadow);
        background-color: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 0.5rem;
        max-width: 36rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
    }
</style>
