<script lang="ts">
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let zynVideo: HTMLVideoElement;
    let audio: HTMLAudioElement;
    let responseText = "";

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
                const data = JSON.parse(event.data);
                console.log("parsed animation data:", data);

                if (
                    data.event === "GIFT" &&
                    data.data.event.attributes.giftName === "Zyn"
                ) {
                    const { attributes } = data.data.event;
                    const sender = attributes.name;
                    const quantity = parseInt(attributes.quantity, 10);
                    const response = data.response || `${sender} gifted ${quantity} ${'zyns'}`

                    responseText = response;
                    playAnimation(zynVideo);
                    await playTextToSpeech(responseText);
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

    async function playTextToSpeech(text: string) {
        try {
            const response = await fetch("api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error("text to speech api response was not ok");
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            audio.src = audioUrl;
            await audio.play();
        } catch (error) {
            console.error("error playing text to speech:", error);
        }
    }

    function playAnimation(videoElement: HTMLVideoElement) {
        if (videoElement) {
            videoElement.style.display = "block";
            videoElement.currentTime = 0;
            videoElement
                .play()
                .catch((error) => console.error("Error playing video:", error));
        }
    }
</script>

<div class="w-full flex space-x-2 items-center justify-center">
    <video
        bind:this={zynVideo}
        src="/videos/zyn.mp4"
        style="left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1000; display: none;"
        on:ended={() => (zynVideo.style.display = "none")}
    >
    </video>
    <audio bind:this={audio} style="display: none;"></audio>
    {#if responseText}
        <div
            class="-tracking-widest font-serif italic text-blue-700 absolute top-0 left-0 w-full text-center p-4 bg-black bg-opacity-50 text-5xl"
        >
            {responseText}
        </div>
    {/if}

    {#if dev}
        <button
            on:click={testAnimation}
            class="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Test Zyn Animation
        </button>
    {/if}
</div>
