<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { fade, fly, blur, scale, slide } from "svelte/transition";
    import * as easings from "svelte/easing";
    import type {
        Alert,
        DonationEvent,
        AlertConfig,
        AnimationSettings,
    } from "$lib/stores/alertConfigStore";

    export let alert: Alert;
    export let giftEvent: DonationEvent;

    const dispatch = createEventDispatcher<{
        alertComplete: void;
        updateDuration: number;
    }>();

    let isVisible = false;
    let audioElement: HTMLAudioElement;
    let videoElement: HTMLVideoElement;
    let alertContainer: HTMLDivElement;
    let audioLoaded = false;
    let lastLoadedAudioSrc: string | null = null;

    $: volume = alert.config.alertVolume ? alert.config.alertVolume / 100 : 0.5;

    onMount(() => {
        console.log("Alert config:", alert.config);
        console.log("Gift event:", giftEvent);
        if (alert.config.notificationSound) {
            loadAudioIfNeeded(alert.config.notificationSound.src);
        }
        // Delay the alert display to ensure DOM is ready
        isVisible = true;
        handleAlertDisplay();
    });

    function handleAlertDisplay() {
        if (videoElement) {
            handleVideoDisplay();
        }
        playAudio();
        // acount for animation out duration in the total total duration time
        const outDuration = alert.config.animation?.out?.duration || 0;
        const totalDuration = alert.config.alertDuration * 1000 + outDuration;

        setTimeout(() => {
            isVisible = false;
            dispatch("alertComplete");
        }, totalDuration);
    }

    function handleVideoDisplay() {
        if (videoElement && alert.config.media?.type === "video") {
            videoElement.muted = true; // Ensure video is not muted
            videoElement.volume = 0;
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
            videoElement
                .play()
                .then(() => {
                    videoElement.muted = false;
                    videoElement.volume = volume;
                })
                .catch((error) => console.error("Error playing video:", error));
        }
    }

    async function loadAudioIfNeeded(src: string) {
        if (src !== lastLoadedAudioSrc) {
            lastLoadedAudioSrc = src;
            try {
                await preloadAudio(src);
                console.log("Audio preloaded successfully");
            } catch (error) {
                console.error("Failed to preload audio:", error);
                lastLoadedAudioSrc = null;
            }
        }
    }

    function preloadAudio(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (audioElement) {
                audioElement.pause();
                audioElement.src = "";
                audioElement.load();
            }
            audioElement = new Audio();
            audioElement.volume = 0;

            audioElement.addEventListener(
                "canplaythrough",
                () => {
                    audioLoaded = true;
                    resolve();
                },
                { once: true },
            );

            audioElement.addEventListener(
                "error",
                (e) => {
                    console.error("Error with audio:", e);
                    audioLoaded = false;
                    reject(e);
                },
                { once: true },
            );

            audioElement.src = src;
            audioElement.load();
        });
    }

    function playAudio() {
        if (audioElement && audioLoaded) {
            audioElement.currentTime = 0;
            audioElement
                .play()
                .then(() => {
                    audioElement.volume = volume;
                })
                .catch((error) => console.error("Error playing audio:", error));
        }
    }

    function startAlertTimer() {
        setTimeout(() => {
            isVisible = false;
            dispatch("alertComplete");
        }, alert.config.alertDuration * 1000);
    }

    function applyAnimation(node: HTMLElement, props: AnimationSettings) {
        console.log("Applying animation:", props);
        if (!props || !props.type) return {};
        const { type, easing: easingName, ...params } = props;
        const easing =
            easings[easingName as keyof typeof easings] || easings.cubicInOut;

        const numericParams = Object.entries(params).reduce(
            (acc, [key, value]) => {
                acc[key] =
                    typeof value === "string" ? parseFloat(value) : value;
                return acc;
            },
            {} as Record<string, number>,
        );

        switch (type) {
            case "blur":
                return blur(node, { ...numericParams, easing });
            case "fade":
                return fade(node, { ...numericParams, easing });
            case "fly":
                return fly(node, { ...numericParams, easing });
            case "scale":
                return scale(node, { ...numericParams, easing });
            case "slide":
                return slide(node, {
                    ...numericParams,
                    easing,
                    axis: params.axis || "y",
                });
            default:
                console.warn("Unknown animation type:", type);
                return {};
        }
    }

    function generateMessage() {
        const template = alert.config.messageTemplate;
        const { giftName, name, quantity } = giftEvent.attributes;

        const placeholders: Record<string, string> = {
            "{sender}": name,
            "{amount}": quantity,
            "{gift}": giftName,
        };

        return template.split(/({\w+})/g).map((part) => ({
            text: placeholders[part] || part,
            highlight: part in placeholders,
        }));
    }
</script>

<main>
    {#if isVisible}
        <div class="bounds">
            <div
                bind:this={alertContainer}
                in:applyAnimation={{
                    ...(alert?.config?.animation?.in || {}),
                    duration: alert.config.animation?.in?.duration || 500,
                }}
                out:applyAnimation={{
                    ...(alert?.config?.animation?.out || {}),
                    duration: alert.config.animation?.out?.duration || 500,
                }}
                class="alert-container {alert.config.composition}"
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
                    <div class="media-container">
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
                            <img
                                src={alert.config.media.src}
                                alt="Alert media"
                            />
                        {/if}
                    </div>
                {/if}

                <div class="text">
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
        </div>
    {/if}
</main>

<style>
    main {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .alert-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .image-above-text {
        flex-direction: column;
    }

    .text-over-image {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .text-over-image .media-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .text-over-image .text {
        position: relative;
        z-index: 2;
        text-align: center;
    }

    .image-left {
        flex-direction: row;
    }

    .image-right {
        flex-direction: row-reverse;
    }

    .media-container {
        max-height: 100%;
        max-width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .media-container img,
    .media-container video {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
    }

    .text {
        white-space: nowrap;
        padding: 0.1rem;
        text-align: center;
        overflow: hidden;
        max-width: 90%;
    }

    .bounds {
        height: 300px;
        width: 800px;
        max-height: 300px;
        max-width: 800px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
