<script lang="ts">
    import { get, type Writable } from "svelte/store";
    import type { AnimationType, AnimationConfig } from "../animations/types";
    import {
        defaultConfigs,
        commonParams,
        specificParams,
        easingFunctions,
    } from "../animations/constants";
    import * as easings from "svelte/easing";
    import { inConfig, outConfig } from "$lib/animations/stores";
    import type { EasingFunction } from "svelte/transition";
    import { isDarkMode } from "$lib/stores";
    import type { AlertConfig } from "$lib/stores/alertConfigStore";

    export let updateAlertConfig: (key: string, value: any) => void;
    export let alertConfig: AlertConfig;

    let showAdvanced = false;

    function handlePremadeAnimationChange(
        direction: "in" | "out",
        event: Event,
    ) {
        const target = event.target as HTMLSelectElement;
        const selectedAnimation = target.value as keyof typeof premadeConfigs;
        const updates = premadeConfigs[selectedAnimation];

        updateAlertConfig(`animation.${direction}`, {
            ...alertConfig.animation[direction],
            ...updates,
        });
    }

    function updateConfig(
        config: Writable<AnimationConfig>,
        updates: Partial<AnimationConfig>,
    ) {
        config.update((curr) => {
            console.log("Current config:", curr);
            // start with default config
            let newConfig = { ...curr };

            // apply updates
            newConfig = { ...newConfig, ...updates };

            // ensure easing is a function
            if (newConfig.easing && typeof newConfig.easing === "string") {
                newConfig.easing =
                    easings[newConfig.easing as keyof typeof easings] ||
                    easings.linear;
            }

            console.log("Updates to apply:", updates);
            console.log("New config:", newConfig); // Log new config after updates

            return newConfig;
        });
    }

    function getEasingName(easingFunction: EasingFunction) {
        return (
            Object.entries(easings).find(
                ([, func]) => func === easingFunction,
            )?.[0] || "linear"
        );
    }

    function handleInputChange(
        direction: "in" | "out",
        param: string,
        event: Event,
    ) {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        let value: string | number = target.value;

        if (param === "easing") {
            value = value; // Keep as string, convert to function when applying
        } else if (target.type === "number") {
            value = +value;
        }

        updateAlertConfig(`animation.${direction}.${param}`, value);
    }

    $: relevantParamsIn = [
        ...commonParams,
        ...specificParams[alertConfig.animation.in.type],
    ];
    $: relevantParamsOut = [
        ...commonParams,
        ...specificParams[alertConfig.animation.out.type],
    ];

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

    const premadeConfigs = {
        "blur in": { ...defaultConfigs.blur, amount: 10 },
        "fade in": defaultConfigs.fade,
        "fly in up": { ...defaultConfigs.fly, y: 100 },
        "fly in down": { ...defaultConfigs.fly, y: -100 },
        "scale in": { ...defaultConfigs.scale, start: 0.8 },
        "slide in up": { ...defaultConfigs.slide, y: 100 },
        "slide in down": { ...defaultConfigs.slide, y: -100 },
        "blur out": { ...defaultConfigs.blur, amount: 10 },
        "fade out": defaultConfigs.fade,
        "fly out up": { ...defaultConfigs.fly, y: -100 },
        "fly out down": { ...defaultConfigs.fly, y: 100 },
        "scale out": { ...defaultConfigs.scale, start: 1.2 },
        "slide out up": { ...defaultConfigs.slide, y: -100 },
        "slide out down": { ...defaultConfigs.slide, y: 100 },
    };

    $: currentInEasing = getEasingName($inConfig.easing as EasingFunction);
    $: currentOutEasing = getEasingName($inConfig.easing as EasingFunction);
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
                    bind:value={alertConfig.animation.in.type}
                    on:change={(e) => handleInputChange("in", "type", e)}
                >
                    {#each Object.keys(defaultConfigs) as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>

                {#each relevantParamsIn as param}
                    <label for={`in-${param}`}>{param}</label>
                    {#if param === "easing"}
                        <select
                            id={`in-${param}`}
                            class="custom-dropdown p-4 {$isDarkMode
                                ? 'bg-slate-800'
                                : 'bg-lime-200'}"
                            bind:value={alertConfig.animation.in.easing}
                            on:change={(e) => handleInputChange("in", param, e)}
                        >
                            {#each easingFunctions as easing}
                                <option value={easing}>{easing}</option>
                            {/each}
                        </select>
                    {:else if param === "axis"}
                        <select
                            id={`in-${param}`}
                            class="custom-dropdown p-4 {$isDarkMode
                                ? 'bg-slate-800'
                                : 'bg-lime-200'}"
                            bind:value={alertConfig.animation.in[param]}
                            on:change={(e) => handleInputChange("in", param, e)}
                        >
                            <option value="x">x</option>
                            <option value="y">y</option>
                        </select>
                    {:else}
                        <input
                            class="custom-dropdown p-4 {$isDarkMode
                                ? 'bg-slate-800'
                                : 'bg-lime-200'}"
                            type="number"
                            id={`in-${param}`}
                            bind:value={alertConfig.animation.in[param]}
                            on:input={(e) => handleInputChange("in", param, e)}
                        />
                    {/if}
                {/each}
            {:else}
                <select
                    id="animationIn"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    on:change={(e) =>
                        handlePremadeAnimationChange(inConfig, e, "in")}
                >
                    {#each premadeAnimationsIn as animation}
                        <option value={animation}>{animation}</option>
                    {/each}
                </select>
            {/if}
        </div>

        <!-- Animation out -->
        <div class="flex flex-col space-y-2 w-1/2">
            <label for="animationOut">Out</label>
            {#if showAdvanced}
                <select
                    id="animationOut"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    bind:value={$outConfig.type}
                    on:change={() =>
                        updateConfig(
                            outConfig,
                            defaultConfigs[$outConfig.type],
                        )}
                >
                    {#each Object.keys(defaultConfigs) as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>

                {#each relevantParamsOut as param}
                    <label for={`out-${param}`}>{param}</label>
                    {#if param === "easing"}
                        <select
                            class="custom-dropdown p-4 {$isDarkMode
                                ? 'bg-slate-800'
                                : 'bg-lime-200'}"
                            id={`out-${param}`}
                            bind:value={currentOutEasing}
                            on:change={(e) =>
                                handleInputChange(outConfig, param, e)}
                        >
                            {#each easingFunctions as easing}
                                <option value={easing}>{easing}</option>
                            {/each}
                        </select>
                    {:else if param === "axis"}
                        <select
                            id={`out-${param}`}
                            class="custom-dropdown p-4 {$isDarkMode
                                ? 'bg-slate-800'
                                : 'bg-lime-200'}"
                            bind:value={$outConfig[param]}
                            on:change={(e) =>
                                handleInputChange(outConfig, param, e)}
                        >
                            <option value="x">x</option>
                            <option value="y">y</option>
                        </select>
                    {:else}
                        <input
                            class="custom-dropdown p-4 {$isDarkMode
                                ? 'bg-slate-800'
                                : 'bg-lime-200'}"
                            type="number"
                            id={`out-${param}`}
                            placeholder="500"
                            bind:value={$outConfig[param]}
                            on:input={(e) =>
                                handleInputChange(outConfig, param, e)}
                        />
                    {/if}
                {/each}
            {:else}
                <select
                    id="animationOut"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-800'
                        : 'bg-lime-200'}"
                    on:change={(e) =>
                        handlePremadeAnimationChange(outConfig, e, "out")}
                >
                    {#each premadeAnimationsOut as animation}
                        <option value={animation}>{animation}</option>
                    {/each}
                </select>
            {/if}
        </div>
    </div>
</div>
