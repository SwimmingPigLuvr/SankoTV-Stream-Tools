<script lang="ts">
    import WalletAddress from "$lib/components/WalletAddress.svelte";
    import { isDarkMode, showDirectory, showNameAlert } from "$lib/stores";
    import { onMount } from "svelte";
    import { backIn, backOut, cubicInOut } from "svelte/easing";
    import { fade, fly, slide } from "svelte/transition";
    import DarkMode from "./DarkMode.svelte";
    import { page } from "$app/stores";
    import { userData } from "$lib/stores/userDataStore";
    import { user } from "$lib/stores/authStore";
    import CreateNew from "./CreateNew.svelte";
    import { goto } from "$app/navigation";
    import { currentAlert } from "$lib/stores/alertConfigStore";

    export let isMobile: boolean = false;

    onMount(() => {
        if ($userData) {
            userData.fetch();
        }
    });

    let comingSoon = false;
    let widgetsComingSoon = true;
    let chatBoxes = [{ name: "zyn" }, { name: "top donation" }];

    let showDonationAlerts = true;
    let showChatBoxes = false;
    let showChatPlays = false;
    let showThemeLibrary = false;

    $: donationAlerts = $userData?.data?.donationAlerts || [];

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

    function handleGoToDonationAlerts(alertId: string | null) {
        if (isMobile) {
            showDirectory.set(false);
        } else if (!isMobile) {
            showDirectory.set(true);
        }

        if (alertId) {
            const selectedAlert = $userData?.data?.donationAlerts.find(
                (alert) => alert.id === alertId,
            );
            if (selectedAlert) {
                currentAlert.set(selectedAlert);
            }
        } else {
            currentAlert.set(null);
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

    function toggleDonationAlerts() {
        showDonationAlerts = !showDonationAlerts;
    }

    function handleCreateNewAlert() {
        goto("/dashboard/donation-alerts");
        showNameAlert.set(true);
    }
</script>

{#if $showDirectory}
    <main
        in:slide
        class="{isMobile
            ? 'fixed w-full top-0 left-0'
            : ''} p-2 min-h-screen font-mono {$isDarkMode
            ? 'text-white bg-slate-800'
            : 'text-slate-800 bg-blue-200'} w-full h-screen"
    >
        <div
            class="mt-16 flex flex-col space-y-2 items-start justify-center m-auto font-mono"
        >
            <!-- Donation alerts -->
            <div class="w-full">
                <div
                    class="flex flex-col items-center justify-center text-left w-full"
                >
                    <button
                        on:click={toggleDonationAlerts}
                        class="
                            {$isDarkMode
                            ? 'hover:text-lime-400'
                            : 'hover:text-blue-400'} text-white rounded-none w-full p-2 text-left items-center justify-center"
                    >
                        <span class="text-xl font-black">Donation Alerts</span>
                    </button>
                    {#if showDonationAlerts}
                        <div
                            in:slide={{ easing: backOut, duration: 750 }}
                            out:slide={{
                                easing: backIn,
                                duration: 500,
                            }}
                            class="flex p-2 w-full flex-col space-y-4 items-center justify-center"
                        >
                            {#each donationAlerts as alert (alert.id)}
                                <a
                                    href="/dashboard/donation-alerts?id={alert.id}"
                                    on:click={() =>
                                        handleGoToDonationAlerts(alert.id)}
                                    class="w-full text-left font-thin tracking-widest {$isDarkMode
                                        ? 'hover:text-lime-400'
                                        : 'hover:text-blue-400'} text-white relative"
                                    >{alert.name}</a
                                >
                            {/each}
                            <button
                                on:click={handleCreateNewAlert}
                                class="w-full text-left {$isDarkMode
                                    ? 'text-slate-400 hover:text-blue-400'
                                    : 'text-blue-400 hover:text-pink-400'}"
                                >create new +</button
                            >
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
                        disabled
                        on:mouseenter={() => (comingSoon = true)}
                        on:mouseleave={() => (comingSoon = false)}
                        class="
                            {$isDarkMode
                            ? 'hover:text-lime-400'
                            : 'hover:tet-blue-400'} cursor-not-allowed text-white rounded-none w-full p-2 text-left items-center justify-center"
                    >
                        <span class="text-xl relative font-black"
                            >Chat Boxes {#if comingSoon}
                                <div
                                    in:fade
                                    class="p-2 text-blue-400 text-xs bg-white absolute top-8 left-1/2 -translate-x-1/2 w-full text-center"
                                >
                                    coming soon
                                </div>
                            {/if}</span
                        >
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
                                on:click={() => handleGoToDonationAlerts(null)}
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
        </div>
        {#if !isMobile}
            <div class="fixed bottom-2 left-2">
                <DarkMode />
            </div>
        {/if}
    </main>
{/if}
