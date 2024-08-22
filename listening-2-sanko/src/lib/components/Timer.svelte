<script lang="ts">
    // style="width: {(1 - $progress) * 100}%"
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

<div class="bg-slate-950 h-4 dark:bg-gray-700">
    <div
        class="bg-sky-500 h-4 rounded-none"
        style="width: {$progress * 100}%"
    ></div>
</div>
