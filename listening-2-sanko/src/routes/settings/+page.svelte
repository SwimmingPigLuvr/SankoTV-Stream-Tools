<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
	import { get } from "svelte/store";
	import {
		donationSettings,
		messageTemplate,
		type DonationStyle,
	} from "$lib/stores";

	let currentBackgroundColor = "#000000";

	let showFonts = false;
	let showWeights = false;
	let showTemplateInfo = false;
	let showBackgroundColorInfo = false;
	let message: string;
	let muted = false;

	let fontSize = 34;
	let letterSpacing = 0;

	const fonts = ["sans-serif", "serif", "monospace", "cursive", "fantasy"];
	let selectedFont = fonts[2];
	let selectedTextTransform = "none";

	const fontWeights = [
		"thin",
		"extralight",
		"light",
		"normal",
		"medium",
		"semibold",
		"bold",
		"extrabold",
		"black",
	];

	const textTransformOptions = [
		"none",
		"uppercase",
		"lowercase",
		"capitalize",
	];

	const senders = ["Bill", "Michael", "Kevin", "Todd", "David"];

	const gifts = ["zyn", "trump", "addys", "chili", "glizzy", "bible"];

	function handleFontChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (target) {
			setFont(target.value);
		}
	}

	function handleTextTransformChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (target) {
			setTextTransform(target.value);
		}
	}

	function setFont(font: string) {
		selectedFont = font;
		console.log("hey");
		donationSettings.update((s) => ({ ...s, fontFamily: font }));
	}

	function setTextTransform(textTransform: string) {
		selectedTextTransform = textTransform;
		console.log("transform");
		donationSettings.update((s) => ({
			...s,
			textTransform: textTransform,
		}));
	}

	function setFontSize(size: number) {
		let sizeString: string = `${size}px`;
		donationSettings.update((s) => ({ ...s, fontSize: sizeString }));
	}

	$: setFontSize(fontSize);

	function setLetterSpacing(spacing: number) {
		let spacingString: string = `${spacing}em`;
		donationSettings.update((s) => ({
			...s,
			letterSpacing: spacingString,
		}));
	}

	$: setLetterSpacing(letterSpacing);

	function setWeight(weight: string) {
		let numericalWeight: string;
		switch (weight) {
			case "thin":
				numericalWeight = "100";
				break;
			case "extralight":
				numericalWeight = "200";
				break;
			case "light":
				numericalWeight = "300";
				break;
			case "normal":
			case "regular":
				numericalWeight = "400";
				break;
			case "medium":
				numericalWeight = "500";
				break;
			case "semibold":
				numericalWeight = "600";
				break;
			case "bold":
				numericalWeight = "700";
				break;
			case "extrabold":
				numericalWeight = "800";
				break;
			case "black":
				numericalWeight = "900";
				break;
			default:
				numericalWeight = "400"; // default to normal if no match is found
		}
		donationSettings.update((s) => ({
			...s,
			fontWeight: numericalWeight,
		}));
	}

	function setTextShadow(preset: string) {
		let shadowStyle: string;
		switch (preset) {
			case "3d":
				shadowStyle =
					"-1px -1px 0 red, 1px -1px 0 red, -1px 1px 0 red, 1px 1px 0 red";
				break;
			case "3d-bold":
				shadowStyle =
					"-1px -1px 0 red, 1px -1px 0 red, -1px 1px 0 red, 1px 1px 0 red, -2px -2px 0 red, 2px -2px 0 red, -2px 2px 0 red, 2px 2px 0 red";
				break;
		}
		donationSettings.update((s) => ({
			...s,
			textShadow: shadowStyle,
		}));
	}

	async function saveSettings() {
		console.log("Saving settings:", $donationSettings);
		alert("Settings saved!");
	}

	function toggleMute() {
		muted = !muted;
	}

	function toggle(style: string) {
		switch (style) {
			case "font":
				showFonts = !showFonts;
				break;
			case "weight":
				showWeights = !showWeights;
				break;
		}
	}

	function getRandomSender() {
		return senders[Math.floor(Math.random() * senders.length)];
	}

	function getRandomGift() {
		return gifts[Math.floor(Math.random() * gifts.length)];
	}

	function getRandomAmount() {
		const weights = [
			{ max: 5, weight: 70 },
			{ max: 10, weight: 15 },
			{ max: 20, weight: 10 },
			{ max: 100, weight: 5 },
		];

		const totalWeight = weights.reduce(
			(sum, range) => sum + range.weight,
			0,
		);
		const rand = Math.random() * totalWeight;

		let cumulativeWeight = 0;
		for (let range of weights) {
			cumulativeWeight += range.weight;
			if (rand < cumulativeWeight) {
				return Math.floor(Math.random() * range.max) + 1;
			}
		}

		return 1;
	}

	function generateRandomMessage(template: string) {
		const sender = getRandomSender();
		const amount = getRandomAmount();
		const gift = getRandomGift();

		return template
			.replace("{sender}", sender)
			.replace("{amount}", amount.toString())
			.replace("{gift}", gift);
	}

	function handleDonationPreview(event: Event) {}
</script>

<svelte:head>
	<title>Donation Alert Settings</title>
</svelte:head>

<main class="text-white bg-slate-900 font-mono p-4 pt-20">
	<div class="p-4 flex flex-col sm:flex-wrap space-y-4 m-auto -white w-full">
		<h1 class="text-xl mb- m-auto w-full text-left">Donation Alerts</h1>

		<!-- donation preview -->
		<div class="flex flex-col border-white border-[1px]">
			<div
				class="min-h-[525px] p-8 text-center"
				style="background-color: {currentBackgroundColor}; border-radius: {$donationSettings.borderRadius}; font-family: {$donationSettings.fontFamily}; font-size: {$donationSettings.fontSize}; font-weight: {$donationSettings.fontWeight}; color: {$donationSettings.textColor}; text-transform: {$donationSettings.textTransform}; letter-spacing: {$donationSettings.letterSpacing}; text-shadow: {$donationSettings.textShadow};"
			>
				{generateRandomMessage($messageTemplate)}
			</div>
			<div class="w-full p-4 flex space-x-6 justify-end items-center">
				<!-- background color -->
				<div class="flex mr-auto space-x-6 items-center">
					<div class="flex space-x-4 items-center">
						<label for="color">Background Color</label>
						<button
							on:click={() => (showBackgroundColorInfo = true)}
							class="hover:bg-slate-400 hover:text-slate-900 rounded-full bg-slate-600 text-slate-400 w-4 h-4 text-xs"
							>i</button
						>
					</div>
					<input
						name="color"
						id="color"
						type="color"
						bind:value={currentBackgroundColor}
						class="block"
					/>
				</div>

				<!-- mute button -->
				<button
					on:click={() => toggleMute()}
					class="px-3 p-2 text hover:bg-slate-800"
				>
					{#if muted}
						🔇
					{:else}
						🔊
					{/if}
				</button>
				<!-- preview button -->
				<button
					on:click={handleDonationPreview}
					class="text-xs ml-auto text-right p-4 bg-slate-800 hover:bg-slate-600 text-white"
					>preview</button
				>
			</div>
		</div>

		<!-- layout -->
		<div
			class="flex flex-col space-y-3 w-full border-white border-[0.5px] p-4"
		>
			<!-- composition of elements -->
			<div class="flex flex-col space-y-2">
				<label for="layout">Layout</label>
				<select
					class="custom-dropdown p-4 bg-slate-800"
					name="layout"
					id="layout"
				>
					<option value="iat">Image above text</option>
					<option value="toi">Text over image</option>
					<option value="itl">Image to left</option>
					<option value="itr">Image to right</option>
				</select>
			</div>

			<!-- image upload -->
			<div class="flex flex-col space-y-2">
				<label for="image">Image</label>

				<!-- image upload -->
				<button
					class="relative flex items-center space-x-4 p-4 bg-slate-800"
					name="image"
					id="image"
				>
					<img class="w-6 h-6" src="" alt="🪲" />
					<p>upload / link image</p>
					<button class="text-2xl absolute right-2 p-2">+</button>
				</button>
			</div>

			<!-- Message template -->
			<div class="flex flex-col space-y-2">
				<div class="flex space-x-6 items-center">
					<label for="template">Message Template</label>
					<button
						on:click={() => (showTemplateInfo = true)}
						class="hover:bg-slate-400 hover:text-slate-900 rounded-full bg-slate-600 text-slate-400 w-4 h-4 text-xs"
						>i</button
					>
				</div>

				<!-- delete after we write this input correctly -->

				<!-- text input -->
				<input
					bind:value={$messageTemplate}
					on:change={() => messageTemplate.set(message)}
					name="template"
					id="template"
					class="flex space-x-4 p-4 bg-slate-800"
					type="text"
				/>
			</div>
		</div>

		<!-- font settings -->
		<div
			class="flex flex-col space-y-3 w-full border-white border-[0.5px] p-4"
		>
			<!-- font family -->
			<div class="flex flex-col space-y-2">
				<label for="font">Font</label>
				<select
					class="custom-dropdown p-4 bg-slate-800"
					name="font"
					id="font"
					bind:value={selectedFont}
					on:change={handleFontChange}
				>
					{#each fonts as font}
						<option style="font-family: {font};" value={font}
							>{font}</option
						>
					{/each}
				</select>
			</div>

			<!-- size -->
			<div class="flex flex-col space-y-2">
				<div class="flex space-x-6">
					<label
						class="block text-slate-200 font-bold mb-2"
						for="font">Size</label
					>
					<p>{fontSize}px</p>
				</div>
				<!-- Create input slider -->
				<input
					bind:value={fontSize}
					type="range"
					id="fontsize"
					name="fontsize"
					min="12"
					max="80"
					step="1"
				/>
			</div>

			<!-- weight -->
			<div class="flex flex-col space-y-2">
				<label for="fontweight">Weight</label>
				<select
					class="custom-dropdown p-4 bg-slate-800"
					name="font"
					id="font"
				>
					{#each fontWeights as weight}
						<option
							style="font-weight: {weight};"
							class=""
							value={weight}>{weight}</option
						>
					{/each}
				</select>
			</div>

			<!-- tracking -->
			<div class="flex flex-col space-y-2">
				<div class="flex space-x-6">
					<label
						class="block text-slate-200 font-bold mb-2"
						for="letterspacing">Letter Spacing</label
					>
					<p>{letterSpacing}em</p>
				</div>
				<!-- Create input slider -->
				<input
					bind:value={letterSpacing}
					type="range"
					id="letterspacing"
					name="letterspacing"
					min="-0.15"
					max="0.15"
					step="0.005"
				/>
			</div>

			<div class="flex space-x-12 justify-start p-4">
				<!-- color -->
				<div class="flex space-x-2 items-center">
					<label for="color">Text Color</label>
					<input
						name="color"
						id="color"
						type="color"
						bind:value={$donationSettings.textColor}
						class="mt-1 block"
					/>
				</div>

				<!-- highlight color -->
				<div class="flex space-x-2 items-center">
					<label for="color">Highlight Color</label>
					<input
						name="highlightcolor"
						id="highlightcolor"
						type="color"
						bind:value={$donationSettings.highlightColor}
						class="mt-1 block"
					/>
				</div>
			</div>

			<!-- Text Transform -->
			<div class="flex flex-col space-y-2">
				<label for="texttransform">Text Transform</label>
				<select
					class="custom-dropdown p-4 bg-slate-800"
					name="texttransform"
					id="texttransform"
					bind:value={selectedTextTransform}
					on:change={handleTextTransformChange}
				>
					<option class="" value="none">none</option>
					<option class="lowercase" value="lowercase"
						>lowercase</option
					>
					<option class="uppsercase" value="uppercase"
						>uppercase</option
					>
					<option class="capitalize" value="capitalize"
						>capitalize</option
					>
				</select>
			</div>
		</div>

		<div class="bg-red-900 flex space-x-3">
			<!-- font -->
			<div class="flex flex-col space-y-3 w-1/4 items-center">
				<button
					on:click={() => toggle("font")}
					class="block text-center w-full p-4 border-b-[1px] border-white"
					>Font</button
				>
				{#if showFonts}
					<div class="flex flex-col space-y-3 w-32">
						{#each fonts as font}
							<button
								class="px-4 py-3 rounded-none border border-white hover:bg-white hover:text-black transition-colors {$donationSettings.fontFamily ===
								font
									? 'bg-white text-black'
									: 'bg-lack'}"
								on:click={() => setFont(font)}
								style="font-family: {font};"
							>
								{font}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- weight -->
			<div class="flex flex-col space-y-3 w-1/4 items-center">
				<button
					on:click={() => toggle("weight")}
					class="block text-center w-full p-4 border-b-[1px] border-white"
					>Weight</button
				>
				{#if showWeights}
					<div class="flex flex-col space-y-3 w-32">
						{#each fontWeights as weight}
							<button
								class="px-4 py-3 rounded-none border border-white hover:bg-white hover:text-black transition-colors {$donationSettings.fontWeight ===
								weight
									? 'bg-white text-black'
									: 'bg-lack'}"
								on:click={() => setWeight(weight)}
								>{weight}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<label class="block">
			Text Color:
			<input
				type="color"
				bind:value={$donationSettings.textColor}
				class="mt-1 block"
			/>
		</label>

		<label class="block">
			Text Transform:
			<select
				bind:value={$donationSettings.textTransform}
				class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded px-2 py-1"
			>
				{#each textTransformOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</label>

		<label class="block">
			Letter Spacing:
			<input
				type="text"
				bind:value={$donationSettings.letterSpacing}
				class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded px-2 py-1"
			/>
		</label>

		<label class="block">
			Text Shadow:
			<input
				type="text"
				bind:value={$donationSettings.textShadow}
				class="mt-1 block w-full bg-gray-800 border border-gray-700 rounded px-2 py-1"
			/>
		</label>

		<div>
			<h3 class="text-lg mb-2">Preset Styles</h3>
			<button
				class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2"
				on:click={() => setTextShadow("3d")}>3D Effect</button
			>
			<button
				class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
				on:click={() => applyPresetStyle("3d-bold")}
				>Bold 3D Effect</button
			>
		</div>

		<button
			class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mt-4"
			on:click={saveSettings}>Save Settings</button
		>
	</div>
</main>

<style>
	select.custom-dropdown option {
		background-color: #ffffff;
		color: #000000;
	}
	select.custom-dropdown option:hover {
		background-color: #f3f4f6;
	}
</style>
