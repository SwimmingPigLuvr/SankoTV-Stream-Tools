<!-- src/lib/components/VideoComponent.svelte -->
<script lang="ts">
    import { currentGift } from "../eventHandler";

    let videoElement: HTMLVideoElement;

    $: if ($currentGift) {
        playAnimation($currentGift);
    }

    function playAnimation(gift: string): void {
        if (videoElement && gift) {
            videoElement.src = `/videos/${gift}.mp4`;
            videoElement.style.display = "block";
            videoElement.currentTime = 0;
            videoElement
                .play()
                .catch((error) =>
                    console.error(`Error playing ${gift} video: `, error),
                );
            videoElement.onended = () => {
                videoElement.style.display = "none";
                currentGift.set("");
            };
        }
    }
</script>

<video
    bind:this={videoElement}
    class="h-[420px]"
    style="position: fixed; top:0; left: 0; object-fit: scale-down; z-index: 1000; display: none;"
>
</video>
