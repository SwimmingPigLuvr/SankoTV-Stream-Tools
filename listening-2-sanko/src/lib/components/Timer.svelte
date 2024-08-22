<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { spring } from "svelte/motion";

    export let duration: number; // in seconds
    export let onComplete: () => void;

    const progress = spring(1, {
        stiffness: 0.1,
        damping: 0.8,
    });

    let remainingTime = duration;
    let timer: ReturnType<typeof setInterval>;

    function tick() {
        remainingTime -= 0.1;
        if (remainingTime <= 0) {
            remainingTime = 0;
            clearInterval(timer);
            onComplete();
        }
        progress.set(remainingTime / duration);
    }

    onMount(() => {
        timer = setInterval(tick, 100);
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });
</script>

<div class="w-full bg-gray-200 rounded-none h-2.5 dark:bg-gray-700">
    <div
        class="bg-lime-400 h-2.5 rounded-none"
        style="width: {(1 - $progress) * 100}%"
    ></div>
</div>
<div class="text-sm mt-1 text-center">
    {Math.ceil(remainingTime)}
</div>
