<script lang="ts">
    import { writable } from "svelte/store";
    import type { AnimationType, AnimationConfig } from "../animations/types";
    import {
        defaultConfigs,
        commonParams,
        specificParams,
        easingFunctions,
    } from "../animations/constants";

    let showAdvanced = false;

    const inConfig = writable<AnimationConfig>(defaultConfigs.fade);
    const outConfig = writable<AnimationConfig>(defaultConfigs.fade);

    function handlePremadeAnimationChange(
        config: typeof inConfig | typeof outConfig,
        event: Event,
    ) {
        const target = event.target as HTMLSelectElement;
        const selectedAnimation = target.value as keyof typeof premadeConfigs;
        updateConfig(config, premadeConfigs[selectedAnimation]);
    }

    function updateConfig(
        config: typeof inConfig | typeof outConfig,
        updates: Partial<AnimationConfig>,
    ) {
        config.update((curr) => ({ ...curr, ...updates }));
    }

    function handleInputChange(
        config: typeof inConfig | typeof outConfig,
        param: string,
        event: Event,
    ) {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        const value = target.type === "number" ? +target.value : target.value;
        updateConfig(config, { [param]: value });
    }

    $: relevantParamsIn = [...commonParams, ...specificParams[$inConfig.type]];
    $: relevantParamsOut = [
        ...commonParams,
        ...specificParams[$outConfig.type],
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
                    class="custom-dropdown p-4 bg-slate-800"
                    bind:value={$inConfig.type}
                    on:change={() =>
                        updateConfig(inConfig, defaultConfigs[$inConfig.type])}
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
                            class="custom-dropdown p-4 bg-slate-800"
                            bind:value={$inConfig[param]}
                            on:change={(e) =>
                                handleInputChange(inConfig, param, e)}
                        >
                            {#each easingFunctions as easing}
                                <option value={easing}>{easing}</option>
                            {/each}
                        </select>
                    {:else}
                        <input
                            class="custom-dropdown p-4 bg-slate-800"
                            type="number"
                            id={`in-${param}`}
                            bind:value={$inConfig[param]}
                            on:input={(e) =>
                                handleInputChange(inConfig, param, e)}
                        />
                    {/if}
                {/each}
            {:else}
                <select
                    id="animationIn"
                    class="custom-dropdown p-4 bg-slate-800"
                    on:change={(e) => handlePremadeAnimationChange(inConfig, e)}
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
            <select
                id="animationOut"
                class="custom-dropdown p-4 bg-slate-800"
                bind:value={$outConfig.type}
                on:change={() =>
                    updateConfig(outConfig, defaultConfigs[$outConfig.type])}
            >
                {#each Object.keys(defaultConfigs) as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>

            {#if showAdvanced}
                {#each relevantParamsOut as param}
                    <label for={`out-${param}`}>{param}</label>
                    {#if param === "easing"}
                        <select
                            class="custom-dropdown p-4 bg-slate-800"
                            id={`out-${param}`}
                            bind:value={$outConfig[param]}
                            on:change={(e) =>
                                handleInputChange(outConfig, param, e)}
                        >
                            {#each easingFunctions as easing}
                                <option value={easing}>{easing}</option>
                            {/each}
                        </select>
                    {:else}
                        <input
                            class="custom-dropdown p-4 bg-slate-800"
                            type="number"
                            id={`out-${param}`}
                            bind:value={$outConfig[param]}
                            on:input={(e) =>
                                handleInputChange(outConfig, param, e)}
                        />
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
</div>
