<!-- lib/components/Notifications.svelte -->
<script lang>
    import { backOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";

    import {
        sender,
        giftName,
        quantity,
        showNotification,
    } from "../eventHandler";

    $: if ($showNotification) {
        console.log("notification should be shown");
    }
</script>

{#if $showNotification}
    <div
        in:fade
        out:fade
        class="text- text-black font-sans font-black -tracking-widest lowercase text-center p-2 max-w-xl flex space-x-1 text-5xl"
    >
        <h1 class="" in:fly={{ y: 10, duration: 500, easing: backOut }}>
            {$sender}
        </h1>
        <p in:fly={{ y: 20, duration: 500, easing: backOut, delay: 250 }}>
            donated {$quantity}
            {$quantity > 1 && $giftName !== "addys"
                ? `${$giftName}s`
                : $giftName}
        </p>
    </div>
{/if}
