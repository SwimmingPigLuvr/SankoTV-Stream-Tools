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
                class="letter"
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
