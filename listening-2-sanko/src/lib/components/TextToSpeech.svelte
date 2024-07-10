<script lang="ts">
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let audio: HTMLAudioElement;
    let responseText = "";
    let animatedWords: { chars: { char: string; visible: boolean }[] }[] = [];
    let animationInterval: ReturnType<typeof setInterval>;
    let textVisible = false;

    function setupEventSource() {
        const eventSource = new EventSource("/api/trigger-gift-animation");

        eventSource.onmessage = async (event) => {
            console.log("raw event data", event.data);
            try {
                const cleanedData = event.data.replace(/}[^}]*$/, "}");
                const data = JSON.parse(cleanedData);
                console.log("parsed animation data:", data);

                if (
                    data.event === "GIFT" &&
                    data.data.event.attributes.giftName === "Zyn"
                ) {
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

                    // Reset text visibility
                    textVisible = false;

                    await playTextToSpeech(responseText);
                    await new Promise((resolve) => setTimeout(resolve, 200));

                    // Make text visible
                    textVisible = true;

                    // Start animation
                    startCharacterAnimation();

                    // Set a timeout to fade out the text
                    setTimeout(() => {
                        textVisible = false;
                    }, 10000); // Adjust this value to change how long the text stays visible
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
        let w = 0;
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
        }, 50);
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
</script>

<div class="w-full">
    <audio bind:this={audio} style="display: none;"></audio>

    {#if animatedWords.length > 0}
        <div
            class="-tracking-wide font-cinema text-dreamy font-black p-4 leading-[2rem] text-white w-full text-center text-[2rem] transition-opacity duration-1000"
            style="opacity: {textVisible ? 1 : 0};"
        >
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
</div>

<style>
    .animated-text {
        transition: all 1s cubic-bezier(0.25, 0.1, 0.25, 1);
    }
</style>
