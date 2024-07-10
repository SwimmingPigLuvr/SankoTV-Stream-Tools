<script lang="ts">
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let zynVideo: HTMLVideoElement;
    let mode = "notification";
    let showNotification = true;

    let sender: string;
    let gift: string;
    let quantity: number;

    async function testAnimation() {
        try {
            const response = await fetch("/api/test-gift-animation", {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error("Failed to trigger test animation");
            }
            console.log("Test animation triggered");
        } catch (error) {
            console.error("Error triggering test animation:", error);
        }
    }

    function setupEventSource() {
        const eventSource = new EventSource("/api/trigger-gift-animation");

        eventSource.onmessage = async (event) => {
            console.log("raw event data", event.data);
            try {
                const cleanedData = event.data.replace(/}[^}]*$/, "}");
                const data = JSON.parse(cleanedData);
                console.log("parsed animation data:", data);

                // data
                const attributes = data.data.event.attributes;
                sender = attributes.name;
                gift = attributes.giftName;
                quantity = parseInt(attributes.quantity, 10);

                if (mode === "notification") {
                    showNotification = true;
                }
                if (
                    mode === "animation" &&
                    data.event === "GIFT" &&
                    data.data.event.attributes.giftName === "Zyn"
                ) {
                    // Play video
                    await playAnimation(zynVideo);
                }
            } catch (error) {
                console.error("error parsing event data:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            eventSource.close();
            setTimeout(() => {
                console.log("attempting to reconnect...");
                setupEventSource();
            }, 5000);
        };

        return eventSource;
    }

    onMount(() => {
        const eventSource = setupEventSource();
        return () => {
            eventSource.close();
        };
    });

    function playAnimation(videoElement: HTMLVideoElement): Promise<void> {
        return new Promise((resolve) => {
            if (videoElement) {
                videoElement.style.display = "none";
                videoElement.currentTime = 0;
                videoElement
                    .play()
                    .catch((error) =>
                        console.error("Error playing video:", error),
                    );
                videoElement.onended = () => {
                    videoElement.style.display = "none";
                    resolve();
                };
            } else {
                resolve();
            }
        });
    }
</script>

<div class="w-full">
    {#if showNotification}
        <div>
            <h1>{sender}</h1>
            <!-- make exception for addys being plural already -->
            donated {quantity}
            {quantity > 1 ? `{gift} + 's'` : ""}
        </div>
        {sender} gifted {quantity}
        {gift}
    {/if}

    <video
        bind:this={zynVideo}
        src="/videos/zyn.mp4"
        class="h-[420px]"
        style="position: fixed; top:0; left: 0; object-fit: scale-down; z-index: 1000; display: none;"
    >
    </video>

    {#if dev}
        <button
            on:click={testAnimation}
            class="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Test Donation
        </button>
    {/if}
</div>
