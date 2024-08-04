<script lang="ts">
    import WalletAddress from "$lib/components/WalletAddress.svelte";
    import { isDarkMode, showDirectory } from "$lib/stores";
    import { onMount } from "svelte";
    import { cubicInOut } from "svelte/easing";
    import { fade, fly, slide } from "svelte/transition";
    import DarkMode from "./DarkMode.svelte";
    import { page } from "$app/stores";
    import { userData } from "$lib/stores/userDataStore";
    import { user } from "$lib/stores/authStore";

    export let isMobile: boolean = false;

    onMount(() => {
        if ($user) {
            userData.fetch();
        }
    });

    let chatBoxes = [{ name: "zyn" }, { name: "top donation" }];

    let showDonationAlerts = false;
    let showChatBoxes = false;
    let showChatPlays = false;
    let showThemeLibrary = false;

    let showNameAlert = false;

    $: donationAlerts = $userData?.data.donationAlerts || [];

    const widgets = [
        "AI + Text to Speech",
        "Donation Goals",
        "Donation Lists",
        "Emotes",
        "Giveaway Wheel",
        "Pin Chat",
        "Top Donations",
    ];

    let activeSection: string | null = null;

    function showCurrentSection(section: string) {
        activeSection = activeSection === section ? null : section;
    }

    $: if ($page.url.pathname === "/dashboard") {
        showDirectory.set(true);
    }
    $: if (!isMobile) {
        showDirectory.set(true);
    }

    function handleGoToDonationAlerts() {
        if (isMobile) {
            showDirectory.set(false);
        } else if (!isMobile) {
            showDirectory.set(true);
        }
    }

    // mainSections array
    const mainSections = [
        "donation alerts",
        "chat box",
        "chat plays",
        "theme library",
    ];

    let path = "";

    $: path = $page.url.pathname
        .toLowerCase()
        .replace(/-/g, " ")
        .replace("/dashboard/", "");

    console.log("current url", $page.url.pathname);
    console.log("current url as section", path);

    const getSectionClass = (section: string) => {
        if ($isDarkMode) {
            return path === section ? "title-glow" : "";
        } else {
            return path === section ? "title-glow-light" : "";
        }
    };

    function toggleDonationAlerts() {
        showDonationAlerts = !showDonationAlerts;
    }

    function handleCreateNewAlert() {
        showNameAlert = true;
    }

    function handleAlertCreated(event: Event) {
        // if alert has been created and added to userData in the CreateNew component
        showNameAlert = false;
    }

    function handleCloseNameAlert() {
        showNameAlert = false;
    }
</script>

{#if $showDirectory}
    <main
        in:slide
        class="w-full h-screen {isMobile
            ? 'fixed w-full top-0 left-0'
            : ''} p-4 min-h-screen font-mono {$isDarkMode
            ? 'text-white bg-slate-800'
            : 'text-slate-800 bg-blue-200'}"
    >
        <div
            class="mt-16 flex flex-col space-y-2 items-start justify-center m-auto font-mono"
        >
            <h1>{$userData?.data}</h1>

            <!-- Donation alerts -->
            <div class="w-full">
                <div
                    class="flex flex-col items-center justify-center text-left w-full"
                >
                    <button
                        on:click={toggleDonationAlerts}
                        class="
                            {$isDarkMode
                            ? 'title-glow-hover'
                            : 'title-glow-light-hover'} rounded-none w-full p-2 text-left items-center justify-center"
                    >
                        <span class="text-xl font-black">Donation Alerts</span>
                    </button>
                    {#if showDonationAlerts}
                        <div
                            in:slide={{ easing: cubicInOut, duration: 250 }}
                            out:slide={{
                                easing: cubicInOut,
                                duration: 250,
                            }}
                            class="flex w-full flex-col items-center justify-center"
                        >
                            <button
                                on:click={handleCreateNewAlert}
                                class="w-full text-left {$isDarkMode
                                    ? 'title-glow-hover'
                                    : 'title-glow-light-hover'} p-2"
                                >create new</button
                            >
                            {#each donationAlerts as alert}
                                <a
                                    href="/donation-alerts/{alert.id}"
                                    class="w-full text-left {$isDarkMode
                                        ? 'title-glow-hover'
                                        : 'title-glow-light-hover'} p-2"
                                    >{alert.name}</a
                                >
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Chat Box -->
            <div class="w-full">
                <div
                    class="flex flex-col items-center justify-center text-left w-full"
                >
                    <button
                        on:click={toggleChatBoxes}
                        class="
                            {$isDarkMode
                            ? 'title-glow-hover'
                            : 'title-glow-light-hover'} rounded-none w-full p-2 text-left items-center justify-center"
                    >
                        <span class="text-xl font-black">Chat Boxes</span>
                    </button>
                    {#if showChatBoxes}
                        <div
                            in:slide={{ easing: cubicInOut, duration: 250 }}
                            out:slide={{
                                easing: cubicInOut,
                                duration: 250,
                            }}
                            class="flex w-full flex-col items-center justify-center"
                        >
                            <a
                                href="/dashboard/chat-boxes"
                                on:click={handleGoToDonationAlerts}
                                class="w-full text-left {$isDarkMode
                                    ? 'title-glow-hover'
                                    : 'title-glow-light-hover'} p-2"
                                >create new</a
                            >
                            {#each chatBoxes as chatBox}
                                <button
                                    class="w-full text-left {$isDarkMode
                                        ? 'title-glow-hover'
                                        : 'title-glow-light-hover'} p-2"
                                    >{chatBox.name}</button
                                >
                            {/each}
                        </div>
                    {/if}
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
                            class="rounded-none {$isDarkMode
                                ? 'title-glow-hover'
                                : 'title-glow-light-hover'} p-2 text-left"
                        >
                            <span class="text-">{widget}</span>
                        </a>
                    {/each}
                </div>
            </div>
        </div>
        {#if !isMobile}
            <div class="fixed bottom-2 left-2">
                <DarkMode />
            </div>
        {/if}
    </main>
{/if}
