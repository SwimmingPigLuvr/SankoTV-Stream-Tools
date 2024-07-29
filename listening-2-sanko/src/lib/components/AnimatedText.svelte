<script lang="ts">
    import { tweened, type Tweened } from "svelte/motion";
    import { backOut, cubicInOut, elasticIn, elasticOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    export let text: string = "";
    export let duration: number = 500;
    export let x: number = -10;
    export let y: number = 10;
    export let initialDelay: number = 500;

    let positionStore: Tweened<number>;
    let position: number = 0;
    let cleanup: (() => void) | undefined;

    $: {
        if (cleanup) cleanup();
        positionStore = tweened(0, {
            easing: elasticOut,
            delay: initialDelay,
            duration,
        });
        cleanup = positionStore.subscribe(
            (val) => (position = Math.round(val)),
        );
        positionStore.set(text.length);
    }

    $: letters = text.split("");
</script>

<div class="text-container min-w-[19rem] text-center flex -space-x-1">
    {#each letters as letter, i}
        {#if i < position}
            <span
                class="letter title-glow"
                in:fly={{
                    easing: backOut,
                    delay: (i / text.length) * duration,
                    duration: (duration / text.length) * 5,
                    x: x + i,
                    y: y + i,
                }}
            >
                {letter === " " ? "\u00A0" : letter}
            </span>
        {:else}
            <span class="letter invisible"
                >{letter === " " ? "\u00A0" : letter}</span
            >
        {/if}
    {/each}
</div>

<style>
    .title-glow {
        text-shadow:
            0 0 5px rgba(255, 255, 0, 0.5),
            0 0 10px rgba(255, 255, 0, 0.5),
            0 0 15px rgba(255, 255, 0, 0.5),
            0 0 20px rgba(255, 255, 0, 0.5),
            /* Add a hint of color */ 0 0 30px rgba(255, 255, 0, 0.5),
            0 0 40px rgba(255, 255, 0, 0.5),
            0 0 50px rgba(255, 255, 255, 0.5),
            0 0 75px rgba(255, 255, 255, 0.5); /* More intense glow further out */
    }

    .text-container {
        display: inline-block;
        position: relative;
    }
    .letter {
        display: inline-block;
    }
    .invisible {
        opacity: 0;
    }
</style>
