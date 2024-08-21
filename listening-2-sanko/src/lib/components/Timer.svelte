<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { tweened } from "svelte/motion";
    import { linear } from "svelte/easing";

    export let duration: number; // in seconds
    export let onComplete: () => void;

    let progress = tweened(1, {
        duration: duration * 1000,
        easing: linear,
    });

    let timer: ReturnType<typeof setInterval>;

    onMount(() => {
        progress.set(0);
        timer = setInterval(() => {
            if ($progress === 0) {
                clearInterval(timer);
                onComplete();
            }
        }, 100);
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });
</script>

<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div
        class="bg-blue-600 h-2.5 rounded-full"
        style="width: {(1 - $progress) * 100}%"
    ></div>
</div>
<div class="text-sm mt-1 text-center">
    {Math.ceil($progress * duration)}s remaining
</div>
