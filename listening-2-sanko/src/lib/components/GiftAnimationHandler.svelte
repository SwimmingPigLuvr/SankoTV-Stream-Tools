<script lang="ts">
    // todo
    // make zyn animation

    // use eleven labs to thank the user?????
    // use ai to thank them and formulate a unique response!

    import { onMount } from "svelte";
    import { XI_API_KEY } from "$env/static/private";

    let zynVideo: HTMLVideoElement;

    onMount(() => {
        const eventSource = new EventSource("/api/trigger-gift-animation");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const sender = data.sender;
            const quanity = data.quanity;
            if (data.animation === "zyn") {
                playAnimation(zynVideo, sender, quanity);
            }
        };

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    });

    async function makeApiCallToElevenLabs(sender: string, quantity: string, giftname = "zyn") {
        const XI_API_KEY = "your_api_key_here"; // Replace with your actual API key
        const apiUrl = "https://api.elevenlabs.io/your-endpoint"; // Replace with the actual endpoint

        const requestBody = {
            sender: sender,
            quantity: quantity,
            giftname: giftname,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${XI_API_KEY}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(
                    "Network response was not ok " + response.statusText,
                );
            }

            const responseData = await response.json();
            console.log(`Thank you ${sender} for ${quantity} ${giftname}s!`);
            return responseData;
        } catch (error) {
            console.error("Error making API call:", error);
        }
    }

    function playAnimation(videoElement: HTMLVideoElement, sender: string, quantity: string) {
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
</div>
