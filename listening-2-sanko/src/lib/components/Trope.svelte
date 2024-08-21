<script>
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";

    let showFirstChemical = false;
    let showSecondChemical = false;
    let showExplosion = false;
    let showStar = false;

    onMount(() => {
        setTimeout(() => {
            showFirstChemical = true;
        }, 1000);
        setTimeout(() => {
            showSecondChemical = true;
        }, 2000);
        setTimeout(() => {
            showFirstChemical = false;
            showSecondChemical = false;
            showExplosion = true;
        }, 3000);
        setTimeout(() => {
            showExplosion = false;
            showStar = true;
        }, 4000);
    });
</script>

<div class="experiment-container">
    {#if showFirstChemical}
        <div
            class="emoji chemical-1"
            in:fly={{ y: 50, duration: 500 }}
            out:fade
        >
            🧪
        </div>
    {/if}
    {#if showSecondChemical}
        <div
            class="emoji chemical-2"
            in:fly={{ y: -50, duration: 500 }}
            out:fade
        >
            🧪
        </div>
    {/if}
    {#if showExplosion}
        <div class="emoji explosion" in:scale={{ duration: 300 }} out:fade>
            💥
        </div>
    {/if}
    {#if showStar}
        <div class="emoji star" in:scale={{ duration: 500 }}>⭐️</div>
    {/if}
</div>

<style>
    .experiment-container {
        position: relative;
        width: 200px;
        height: 200px;
        margin: 50px auto;
    }

    .emoji {
        position: absolute;
        font-size: 50px;
        left: 50%;
        transform: translateX(-50%);
    }

    .chemical-1 {
        top: 0;
    }

    .chemical-2 {
        bottom: 0;
    }

    .explosion,
    .star {
        top: 50%;
        transform: translate(-50%, -50%);
    }

    @keyframes pulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
        }
    }

    .star {
        animation: pulse 1s infinite;
    }
</style>
