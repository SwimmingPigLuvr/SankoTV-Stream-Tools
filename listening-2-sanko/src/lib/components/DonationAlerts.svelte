<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { fade, fly, blur, scale, slide } from "svelte/transition";
    import { linear, cubicIn, cubicOut, cubicInOut } from "svelte/easing";
    import type { Alert } from "$lib/stores/alertConfigStore";

    export let alert: Alert;
    export let donationEvent: {
        sender: string;
        amount: number;
        gift: string;
    };

    const dispatch = createEventDispatcher();

    let isVisible = false;
    let audioElement: HTMLAudioElement;
    let videoElement: HTMLVideoElement;

    const easings = { linear, cubicIn, cubicOut, cubicInOut };

    onMount(() => {
        isVisible = true;
        if (alert.config.notificationSound) {
            playAudio();
        }
        setTimeout(() => {
            isVisible = false;
            dispatch("alertComplete");
        }, alert.config.alertDuration * 1000);
    });

    function playAudio() {
        if (audioElement) {
            audioElement.volume = alert.config.alertVolume / 100;
            audioElement
                .play()
                .catch((error) => console.error("Error playing audio:", error));
        }
    }

    function handleVideoDisplay() {
        if (videoElement && alert.config.media?.type === "video") {
            switch (alert.config.videoDuration) {
                case "once":
                    videoElement.loop = false;
                    break;
                case "match":
                    videoElement.loop = false;
                    if (videoElement.duration) {
                        dispatch(
                            "updateDuration",
                            Math.ceil(videoElement.duration),
                        );
                    }
                    break;
                case "loop":
                    videoElement.loop = true;
                    break;
            }
        }
    }

    function applyAnimation(node, props) {
        if (!props) return {};
        const { type, easing: easingName, ...params } = props;
        const easing = easings[easingName] || easings.linear;

        switch (type) {
            case "blur":
                return blur(node, { ...params, easing });
            case "fade":
                return fade(node, { ...params, easing });
            case "fly":
                return fly(node, { ...params, easing });
            case "scale":
                return scale(node, { ...params, easing });
            case "slide":
                return slide(node, { ...params, easing });
            default:
                return {};
        }
    }

    function formatPluralities(amount: number, gift: string): string {
        const specialPlurals: Record<string, string> = {
            Glizzy: "Glizzies",
            "Head Phones": "pairs of Head Phones",
            // ... (rest of the special plurals)
        };

        if (amount === 1) {
            return gift === "Head Phones" ? "1 pair of Head Phones" : gift;
        }

        if (specialPlurals[gift]) {
            return specialPlurals[gift];
        }

        if (
            gift.endsWith("y") &&
            !["ay", "ey", "oy", "uy"].some((ending) => gift.endsWith(ending))
        ) {
            return `${gift.slice(0, -1)}ies`;
        }

        return `${gift}s`;
    }

    function generateMessage() {
        const template = alert.config.messageTemplate;
        const { sender, amount, gift } = donationEvent;
        const formattedGift = formatPluralities(amount, gift);

        const placeholders: Record<string, string> = {
            "{sender}": sender,
            "{amount}": amount.toString(),
            "{gift}": formattedGift,
        };

        return template.split(/({\w+})/g).map((part) => ({
            text: placeholders[part] || part,
            highlight: part in placeholders,
        }));
    }
</script>

{#if isVisible}
    <div
        in:applyAnimation={alert.config.animation.in}
        out:applyAnimation={alert.config.animation.out}
        class="alert-container"
        style="
      border-radius: {alert.config.borderRadius};
      font-family: {alert.config.fontFamily};
      font-size: {alert.config.fontSize};
      font-weight: {alert.config.fontWeight};
      color: {alert.config.textColor};
      text-transform: {alert.config.textTransform};
      letter-spacing: {alert.config.letterSpacing}em;
      text-shadow: {alert.config.textShadow};
    "
    >
        {#if alert.config.media}
            {#if alert.config.media.type === "video"}
                <video
                    bind:this={videoElement}
                    src={alert.config.media.src}
                    autoplay
                    on:loadedmetadata={handleVideoDisplay}
                >
                    <track kind="captions" src="" label="English" />
                </video>
            {:else}
                <img src={alert.config.media.src} alt="Alert media" />
            {/if}
        {/if}

        <div class="message">
            {#each generateMessage() as part}
                <span
                    style="color: {part.highlight
                        ? alert.config.highlightColor
                        : alert.config.textColor};"
                >
                    {part.text}
                </span>
            {/each}
        </div>
    </div>
{/if}

{#if alert.config.notificationSound}
    <audio bind:this={audioElement} src={alert.config.notificationSound.src}
    ></audio>
{/if}

<style>
    .alert-container {
        /* Add any additional styles here */
    }

    .message {
        /* Add any additional styles here */
    }
</style>
