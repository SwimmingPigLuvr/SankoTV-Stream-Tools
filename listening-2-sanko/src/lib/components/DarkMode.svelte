<script>
    import { isDarkMode } from "$lib/stores";

    function toggleDarkMode() {
        isDarkMode.set(!$isDarkMode);
    }
</script>

<button
    on:click={toggleDarkMode}
    class="flex w-6 h-6 justify-center items-center p-2 hover:bg-slate-500 rounded-full"
>
    {#if $isDarkMode}
        <p class="text-amber-300 text-xl">☼</p>
    {:else}
        <p class="text-black">☾</p>
    {/if}
</button>
