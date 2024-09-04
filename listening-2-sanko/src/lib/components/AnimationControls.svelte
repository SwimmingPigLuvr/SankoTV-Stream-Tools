<script lang="ts">
    import {
        currentAlert,
        type AlertConfig,
    } from "$lib/stores/alertConfigStore";
    import { isDarkMode } from "$lib/stores";
    import { defaultConfigs, easingFunctions } from "../animations/constants";

    import type {
        AnimationType,
        AnimationConfig,
    } from "../animations/types.ts";
    import { userData } from "$lib/stores/userDataStore";

    export let updateAlertConfig: (key: string, value: any) => void;
    export let alertConfig: AlertConfig;

    let showAdvanced = false;

    $: inAnimation = alertConfig?.animation?.in ?? defaultConfigs.fade;
    $: outAnimation = alertConfig?.animation?.out ?? defaultConfigs.fade;

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
        "fade in": defaultConfigs.fade,
        "fly in up": { ...defaultConfigs.fly, y: 20 },
        "fly in down": { ...defaultConfigs.fly, y: -20 },
        "scale in": { ...defaultConfigs.scale, start: 0.8 },
        "slide in up": { ...defaultConfigs.slide, y: 20 },
        "slide in down": { ...defaultConfigs.slide, y: -20 },
        "blur out": { ...defaultConfigs.blur, amount: 5 },
        "fade out": defaultConfigs.fade,
        "fly out up": { ...defaultConfigs.fly, y: -20 },
        "fly out down": { ...defaultConfigs.fly, y: 20 },
        "scale out": { ...defaultConfigs.scale, start: 1.2 },
        "slide out up": { ...defaultConfigs.slide, y: -20 },
        "slide out down": { ...defaultConfigs.slide, y: 20 },
    };

    function handlePremadeAnimationChange(
        direction: "in" | "out",
        event: Event,
    ) {
        const target = event.target as HTMLSelectElement;
        const selectedAnimation = target.value;
        console.log("selected animation: ", selectedAnimation);

        const config = premadeAnimationConfigs[selectedAnimation];
        console.log("config: ", config);

        if (config && alertConfig) {
            currentAlert.update((alert) => {
                if (!alert) {
                    console.error("no alert...");
                    return alert;
                }

                console.log(`updating ${direction} animation with: `, config);
                alert.config.animation[direction] = {
                    ...alert.config.animation[direction],
                    ...config,
                    axis: config.axis || "x",
                };

                // trigger toast
                // pushToastNoti(`animation.${direction}`, selectedAnimation);

                //update userdata
                console.log("updating userdata with new alert config");
                userData.updateUserData(alert);

                return alert;
            });
        }
    }

    function handleAxisChange(direction: "in" | "out", event: Event) {
        const target = event.target as HTMLSelectElement;
        updateAlertConfig(`animation.${direction}.axis`, target.value);
    }

    function handleNumberInput(
        direction: "in" | "out",
        property: string,
        event: Event,
    ) {
        const target = event.target as HTMLInputElement;
        updateAlertConfig(
            `animation.${direction}.${property}`,
            Number(target.value),
        );
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
                        ? 'bg-slate-950'
                        : 'bg-lime-200'}"
                    value={inAnimation.type}
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

                <!-- common props -->

                <!-- duration -->
                <label for="in-duration">Duration</label>
                <input
                    type="number"
                    id="in-duration"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-950'
                        : 'bg-lime-200'}"
                    value={inAnimation.duration}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.in.duration",
                            Number(e.currentTarget.value),
                        )}
                />

                <!-- delay -->
                <label for="in-delay">Delay</label>
                <input
                    type="number"
                    id="in-delay"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-950'
                        : 'bg-lime-200'}"
                    value={inAnimation.delay}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.in.delay",
                            Number(e.currentTarget.value),
                        )}
                />

                <!-- easing -->
                <label for="in-easing">Easing</label>
                <select
                    id="in-easing"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-950'
                        : 'bg-lime-200'}"
                    value={inAnimation.easing}
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

                <!-- specific properties for each animation type -->
                <!-- blur: amount -->
                {#if inAnimation.type === "blur"}
                    <label for="in-amount">Amount</label>
                    <input
                        type="number"
                        id="in-amount"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={inAnimation.amount}
                        on:change={(e) => handleNumberInput("in", "amount", e)}
                    />
                {/if}

                <!-- fly: x and or y -->
                <!-- x -->
                {#if inAnimation.type === "fly"}
                    <label for="in-x">X</label>
                    <input
                        type="number"
                        id="in-x"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={inAnimation.x}
                        on:change={(e) => handleNumberInput("in", "x", e)}
                    />
                {/if}
                <!-- y -->
                {#if inAnimation.type === "fly"}
                    <label for="in-y">Y</label>
                    <input
                        type="number"
                        id="in-y"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={inAnimation.y}
                        on:change={(e) => handleNumberInput("in", "y", e)}
                    />
                {/if}

                <!-- scale: start -->
                {#if inAnimation.type === "scale"}
                    <label for="in-start">Start</label>
                    <input
                        type="number"
                        id="in-start"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={inAnimation.start}
                        on:change={(e) => handleNumberInput("in", "start", e)}
                    />
                {/if}

                <!-- blur, fade, scale: opacity -->
                {#if ["blur", "fade", "scale"].includes(inAnimation.type)}
                    <label for="in-opacity">Opacity</label>
                    <input
                        type="number"
                        id="in-opacity"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={inAnimation.opacity}
                        on:change={(e) => handleNumberInput("in", "opacity", e)}
                        min="0"
                        max="1"
                        step="0.1"
                    />
                {/if}

                <!-- slide: axis -->
                {#if inAnimation.type === "slide"}
                    <label for="in-axis">Axis</label>
                    <select
                        id="in-axis"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={inAnimation.axis || "x"}
                        on:change={(e) => handleAxisChange("in", e)}
                    >
                        <option value="x">x</option>
                        <option value="y">y</option>
                    </select>
                {/if}

                <!-- Add more advanced options here based on the animation type -->
            {:else}
                <select
                    id="animationIn"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-950'
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
                        ? 'bg-slate-950'
                        : 'bg-lime-200'}"
                    value={outAnimation.type}
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

                <!-- common props -->

                <!-- duration -->
                <label for="out-duration">Duration</label>
                <input
                    type="number"
                    id="out-duration"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-950'
                        : 'bg-lime-200'}"
                    value={outAnimation.duration}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.out.duration",
                            Number(e.currentTarget.value),
                        )}
                />

                <!-- delay -->
                <label for="out-delay">Delay</label>
                <input
                    type="number"
                    id="out-delay"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-950'
                        : 'bg-lime-200'}"
                    value={outAnimation.delay}
                    on:change={(e) =>
                        updateAlertConfig(
                            "animation.out.delay",
                            Number(e.currentTarget.value),
                        )}
                />

                <!-- easing -->
                <label for="out-easing">Easing</label>
                <select
                    id="out-easing"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-950'
                        : 'bg-lime-200'}"
                    value={outAnimation.easing}
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

                <!-- specific properties for each animation type -->
                <!-- blur: amount -->
                {#if outAnimation.type === "blur"}
                    <label for="out-amount">Amount</label>
                    <input
                        type="number"
                        id="out-amount"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={outAnimation.amount}
                        on:change={(e) => handleNumberInput("out", "amount", e)}
                    />
                {/if}

                <!-- fly: x and or y -->
                <!-- x -->
                {#if outAnimation.type === "fly"}
                    <label for="out-x">X</label>
                    <input
                        type="number"
                        id="out-x"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={outAnimation.x}
                        on:change={(e) => handleNumberInput("out", "x", e)}
                    />
                {/if}
                <!-- y -->
                {#if outAnimation.type === "fly"}
                    <label for="out-y">Y</label>
                    <input
                        type="number"
                        id="out-y"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={outAnimation.y}
                        on:change={(e) => handleNumberInput("out", "y", e)}
                    />
                {/if}

                <!-- scale: start -->
                {#if outAnimation.type === "scale"}
                    <label for="out-start">Start</label>
                    <input
                        type="number"
                        id="out-start"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={outAnimation.start}
                        on:change={(e) => handleNumberInput("out", "start", e)}
                    />
                {/if}

                <!-- blur, fade, scale: opacity -->
                {#if ["blur", "fade", "scale"].includes(outAnimation.type)}
                    <label for="out-opacity">Opacity</label>
                    <input
                        type="number"
                        id="out-opacity"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={outAnimation.opacity}
                        on:change={(e) =>
                            handleNumberInput("out", "opacity", e)}
                        min="0"
                        max="1"
                        step="0.1"
                    />
                {/if}

                <!-- slide: axis -->
                {#if outAnimation.type === "slide"}
                    <label for="out-axis">Axis</label>
                    <select
                        id="out-axis"
                        class="custom-dropdown p-4 {$isDarkMode
                            ? 'bg-slate-950'
                            : 'bg-lime-200'}"
                        value={outAnimation.axis || "x"}
                        on:change={(e) => handleAxisChange("out", e)}
                    >
                        <option value="x">x</option>
                        <option value="y">y</option>
                    </select>
                {/if}

                <!-- Add more advanced options here based on the animation type -->
            {:else}
                <select
                    id="animationOut"
                    class="custom-dropdown p-4 {$isDarkMode
                        ? 'bg-slate-950'
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
