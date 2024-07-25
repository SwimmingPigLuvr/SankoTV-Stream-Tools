<script lang="ts">
    import WalletAddress from "$lib/components/WalletAddress.svelte";
    import { isDarkMode } from "$lib/stores";
    import { cubicInOut } from "svelte/easing";
    import { fly, slide } from "svelte/transition";

    let sectionData = [{ name: "zyn" }, { name: "top donation" }];

    const widgets = [
        "AI + Text to Speech",
        "Donation Goals",
        "Donation Lists",
        "Emotes",
        "Giveaway Wheel",
        "Pin Chat",
        "Top Donations",
    ];

    // mainSections array
    const mainSections = [
        "Donation Alerts",
        "Chat Box",
        "Chat Plays",
        "Theme Library",
    ];

    let activeSection: string | null = null;

    function showCurrentSection(section: string) {
        activeSection = activeSection === section ? null : section;
    }
</script>

<main
    class="w-full p-2 min-h-screen font-mono {$isDarkMode
        ? 'bg-slate-900 text-white'
        : 'bg-yellow-100 text-slate-800'}"
>
    <div
        class="mt-16 flex flex-col space-y-8 items-start justify-center m-auto font-mono"
    >
        <!-- Main Sections -->
        <div class="w-full">
            <div class="flex flex-col items-start w-full">
                {#each mainSections as section}
                    <button
                        on:click={() => showCurrentSection(section)}
                        class="rounded-none w-full p-2 text-left items-center justify-center hover:bg-amber-400 hover:bg-opacity-10 hover:border-amber-300 border-transparent border-[1px]"
                    >
                        <span class="text-xl">{section}</span>
                    </button>
                    {#if activeSection === section}
                        <div
                            in:slide={{ easing: cubicInOut, duration: 250 }}
                            out:slide={{ easing: cubicInOut, duration: 250 }}
                            class="flex w-full flex-col items-start justify-start"
                        >
                            <a
                                href="/dashboard/donation-alerts"
                                class="w-full text-left hover:text-amber-400 p-2"
                                >create new</a
                            >
                            {#each sectionData as data}
                                <button
                                    class="w-full text-left hover:text-amber-400 p-2"
                                    >{data.name}</button
                                >
                            {/each}
                        </div>
                    {/if}
                {/each}
            </div>
        </div>

        <!-- Widgets -->
        <div class="w-full">
            <h2 class="text-2xl p-2 text-left">Widgets</h2>
            <div class="flex flex-col">
                {#each widgets as widget}
                    <a
                        href="/dashboard/{widget
                            .toLowerCase()
                            .replace(' ', '-')}"
                        class="rounded-none hover:bg-amber-400 hover:bg-opacity-10 hover:border-amber-300 border-transparent border-2 p-2 text-left"
                    >
                        <span class="text-">{widget}</span>
                    </a>
                {/each}
            </div>
        </div>
    </div>
</main>
