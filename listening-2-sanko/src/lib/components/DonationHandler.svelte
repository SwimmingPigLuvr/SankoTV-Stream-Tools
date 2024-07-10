<script lang="ts">
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { text } from "@sveltejs/kit";
    import { fade } from "svelte/transition";

    let zynVideo: HTMLVideoElement;
    let audio: HTMLAudioElement;
    let responseText = "";
    let animatedWords: { chars: { char: string; visible: boolean }[] }[] = [];
    let animationInterval: ReturnType<typeof setInterval>;
    let textVisible = false;

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
                // clean data
                const cleanedData = event.data.replace(/}[^}]*$/, "}");
                const data = JSON.parse(cleanedData);
                console.log("parsed animation data:", data);

                if (
                    data.event === "GIFT" &&
                    data.data.event.attributes.giftName === "Zyn"
                ) {
                    textVisible = false;

                    const attributes = data.data.event.attributes;
                    const sender = attributes.name;
                    const gift = attributes.giftName;
                    const quantity = parseInt(attributes.quantity, 10);
                    const response =
                        data.response || `${sender} gifted ${quantity} ${gift}`;

                    responseText = response;

                    animatedWords = responseText.split(" ").map((word) => ({
                        chars: word
                            .split("")
                            .map((char) => ({ char, visible: false })),
                    }));

                    // video first
                    await playAnimation(zynVideo);

                    await playTextToSpeech(responseText);
                    await new Promise((resolve) => setTimeout(resolve, 200));

                    // start animation + tts
                    textVisible = true;
                    startCharacterAnimation();

                    setTimeout(() => {
                        textVisible = false;
                    }, 10000);
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

    function startCharacterAnimation() {
        // wordIndex
        let w = 0;
        // charIndex
        let c = 0;
        clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            if (w < animatedWords.length) {
                if (c < animatedWords[w].chars.length) {
                    animatedWords[w].chars[c].visible = true;
                    animatedWords = animatedWords;
                    c++;
                } else {
                    w++;
                    c = 0;
                }
            } else {
                clearInterval(animationInterval);
            }
        }, 50); // Adjust this value to change the speed of animation
    }

    onMount(() => {
        const eventSource = setupEventSource();
        return () => {
            eventSource.close();
            clearInterval(animationInterval);
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

    function playAnimation(videoElement: HTMLVideoElement): Promise<void> {
        return new Promise((resolve) => {
            if (videoElement) {
                videoElement.style.display = "block";
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
    <video
        bind:this={zynVideo}
        src="/videos/zyn.mp4"
        class="h-[420px]"
        style="position: fixed; top:0; left: 0; object-fit: scale-down; z-index: 1000; display: block;"
    >
    </video>
    <audio bind:this={audio} style="display: none;"></audio>

    {#if animatedWords.length > 0 && textVisible}
        <div 
            out:fade
            class="-tracking-wide font-cinema text-dreamy font-black p-4 leading-[3rem] text-white w-full text-center text-[1rem]">
            {#each animatedWords as word, w}
                <span class="inline-block mr-2">
                    {#each word.chars as { char, visible }, c}
                        <span
                            class="inline-block transition-all duration-1000 ease-out"
                            style="
                                transform: translate({visible
                                ? '0'
                                : '10px'}, {visible ? '0' : '20px'});
                                opacity: {visible ? '1' : '0'};
                            "
                        >
                            {char}
                        </span>
                    {/each}
                </span>
            {/each}
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

<style>
    /* Add some basic styling */
    .animated-text {
        transition: all 1s cubic-bezier(0.25, 0.1, 0.25, 1);
    }
</style>
