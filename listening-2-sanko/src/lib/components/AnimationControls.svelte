<script lang="ts">
    import type { AlertConfig } from "$lib/stores/alertConfigStore";
    import { isDarkMode } from "$lib/stores";
    import { defaultConfigs, easingFunctions } from "../animations/constants";

    export let updateAlertConfig: (key: string, value: any) => void;
    export let alertConfig: AlertConfig;

    let showAdvanced = false;

    const premadeAnimationsIn = [
        "blur in",
        "fade in",
        "fly in up",
        "fly in down",
        "scale in",
        "slide in up",
        "slide in down",
    ];

    const premadeAnimationsOut = [
        "blur out",
        "fade out",
        "fly out up",
        "fly out down",
        "scale out",
        "slide out up",
        "slide out down",
    ];

    const premadeAnimationConfigs: Record<string, AnimationConfig> = {
        "blur in": { ...defaultConfigs.blur, amount: 5 },
    };

    function handlePremadeAnimationChange(
        direction: "in" | "out",
        event: Event,
    ) {
        const target = event.target as HTMLSelectElement;
        updateAlertConfig(`animation.${direction}.type`, target.value);
    }
</script>

<div class="flex flex-col space-y-2">
    <div class="flex justify-between">
        <label for="animation">Animation</label>
        <div class="flex space-x-2">
            <label for="advancedToggle">Advanced Settings</label>
            <input
                id="advancedToggle"
                type="checkbox"
                bind:checked={showAdvanced}
            />
        </div>
    </div>
    <div id="animation" class="flex space-x-4">
        <!-- Animation In -->
        <div class="flex flex-col space-y-2 w-1/2">
            <label for="animationIn">In</label>
            {#if showAdvanced}
                <select
                    id="animationIn"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    value={alertConfig.animation.in.type}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.in.type",
                            e.currentTarget.value,
                        )}
                >
                    {#each Object.keys(defaultConfigs) as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>

                <label for="in-duration">Duration</label>
                <input
                    type="number"
                    id="in-duration"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    value={alertConfig.animation.in.duration}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.in.duration",
                            Number(e.currentTarget.value),
                        )}
                />

                <label for="in-delay">Delay</label>
                <input
                    type="number"
                    id="in-delay"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    value={alertConfig.animation.in.delay}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.in.delay",
                            Number(e.currentTarget.value),
                        )}
                />

                <label for="in-easing">Easing</label>
                <select
                    id="in-easing"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    value={alertConfig.animation.in.easing}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.in.easing",
                            e.currentTarget.value,
                        )}
                >
                    {#each easingFunctions as easing}
                        <option value={easing}>{easing}</option>
                    {/each}
                </select>

                <!-- Add more advanced options here based on the animation type -->
            {:else}
                <select
                    id="animationIn"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    on:change={(e) => handlePremadeAnimationChange("in", e)}
                >
                    {#each premadeAnimationsIn as animation}
                        <option value={animation}>{animation}</option>
                    {/each}
                </select>
            {/if}
        </div>

        <!-- Animation Out -->
        <div class="flex flex-col space-y-2 w-1/2">
            <label for="animationOut">Out</label>
            {#if showAdvanced}
                <select
                    id="animationOut"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    value={alertConfig.animation.out.type}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.out.type",
                            e.currentTarget.value,
                        )}
                >
                    {#each Object.keys(defaultConfigs) as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>

                <label for="out-duration">Duration</label>
                <input
                    type="number"
                    id="out-duration"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    value={alertConfig.animation.out.duration}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.out.duration",
                            Number(e.currentTarget.value),
                        )}
                />

                <label for="out-delay">Delay</label>
                <input
                    type="number"
                    id="out-delay"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    value={alertConfig.animation.out.delay}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.out.delay",
                            Number(e.currentTarget.value),
                        )}
                />

                <label for="out-easing">Easing</label>
                <select
                    id="out-easing"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    value={alertConfig.animation.out.easing}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.out.easing",
                            e.currentTarget.value,
                        )}
                >
                    {#each easingFunctions as easing}
                        <option value={easing}>{easing}</option>
                    {/each}
                </select>

                <!-- Add more advanced options here based on the animation type -->
            {:else}
                <select
                    id="animationOut"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    on:change={(e) => handlePremadeAnimationChange("out", e)}
                >
                    {#each premadeAnimationsOut as animation}
                        <option value={animation}>{animation}</option>
                    {/each}
                </select>
            {/if}
        </div>
    </div>
</div>
