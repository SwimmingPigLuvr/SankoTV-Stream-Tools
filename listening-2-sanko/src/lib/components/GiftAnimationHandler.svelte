<script lang="ts">
    // todo
    // make zyn animation

    // use eleven labs to thank the user?????
    // use ai to thank them and formulate a unique response!

    import { onMount } from "svelte";
    import { XI_API_KEY } from "$env/static/private";

    let zynVideo: HTMLVideoElement;
    let audio: HTMLAudioElement;
    let responseText = "";

    onMount(() => {
        const eventSource = new EventSource("/api/trigger-gift-animation");
        eventSource.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            const { sender, quanity, response, animation } = data;
            if (animation === "zyn") {
                playAnimation(zynVideo);
                await playTextToSpeech(response);
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

    async function playTextToSpeech(text: string) {
        const apiUrl = "https://api.elevenlabs.io/v1/text-to-speech/your-voice-id"; // Replace with the actual endpoint
        const requestBody = {
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5
            }
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": XI_API_KEY,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error("xi api response was NOT OKAY");
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            audio.src = audioUrl;
            await audio.play();
        } catch (error) {
            console.error("Error playing text to speech:", error);
        }
    }

    function playAnimation(videoElement: HTMLVideoElement,) {
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
        <div class="-tracking-widest font-serif italic text-blue-700 absolute top-0 left-0 w-full text-center p-4 bg-black bg-opacity-50  text-5xl">
            {responseText}
        </div>
    {/if}
</div>
