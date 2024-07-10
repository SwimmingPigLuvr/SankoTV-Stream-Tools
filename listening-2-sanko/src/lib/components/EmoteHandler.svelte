<script lang="ts">
    import { onMount } from "svelte";

    let shredcatVideo: HTMLVideoElement;
    let sleepVideo: HTMLVideoElement;

    onMount(() => {
        const eventSource = new EventSource("/api/trigger-animation");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.animation === "shredcat") {
                playAnimation(shredcatVideo);
            } else if (data.animation === "sleep") {
                playAnimation(sleepVideo);
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
        bind:this={shredcatVideo}
        src="/videos/shredcat.mp4"
        style="left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1000; display: none;"
        on:ended={() => (shredcatVideo.style.display = "none")}
    >
    </video>

    <video
        bind:this={sleepVideo}
        src="/videos/sleep.mp4"
        style="left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1000; display: none;"
        on:ended={() => (sleepVideo.style.display = "none")}
    >
    </video>
</div>
