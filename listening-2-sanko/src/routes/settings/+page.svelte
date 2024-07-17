<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
	import { get } from "svelte/store";
	import {
		donationSettings,
		messageTemplate,
		type DonationStyle,
	} from "$lib/stores";

	let currentBackgroundColor = "#000000";

	let imageExists = false;

	let showUploadControls = false;
	let showFonts = false;
	let showWeights = false;
	let showTemplateInfo = false;
	let showBackgroundColorInfo = false;
	let message: string;
	let muted = false;

	let fontSize = 34;
	let letterSpacing = 0;

	let alertDuration = 8;

	const fonts = ["sans-serif", "serif", "monospace", "cursive", "fantasy"];
	let selectedFont = fonts[2];
	let selectedWeight = "normal";
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

	function setFont(font: string) {
		selectedFont = font;
		console.log("hey");
		donationSettings.update((s) => ({ ...s, fontFamily: font }));
	}

	function handleWeightChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (target) {
			setWeight(target.value);
		}
	}

	function setWeight(weight: string) {
		selectedWeight = weight;
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

	function handleTextTransformChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (target) {
			setTextTransform(target.value);
		}
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

	function setAlertDuration(duration: number) {
		let durationString: string = `${duration}s`;
		donationSettings.update((s) => ({
			...s,
			alertDuration: durationString,
		}));
	}

	$: setAlertDuration(alertDuration);

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
	<h1 class="text-xl py-2 m-auto w-full text-left">Donation Alerts</h1>

	<div class="alert-grid sm:text-sm text-xs">
		<!-- donation preview -->
		<div class="alert-grid-preview-container">
			<div
				class="min-h-[420px] flex items-center text-center"
				style="background-color: {currentBackgroundColor}; border-radius: {$donationSettings.borderRadius}; font-family: {$donationSettings.fontFamily}; font-size: {$donationSettings.fontSize}; font-weight: {$donationSettings.fontWeight}; color: {$donationSettings.textColor}; text-transform: {$donationSettings.textTransform}; letter-spacing: {$donationSettings.letterSpacing}; text-shadow: {$donationSettings.textShadow};"
			>
				{generateRandomMessage($messageTemplate)}
			</div>
			<div class="w-full p-4 flex space-x-2 justify-end items-center">
				<!-- background color -->
				<div class="flex mr-auto space-x-4 items-center">
					<div class="flex space-x-2 items-center">
						<label for="color">Background Color</label>
						<button
							on:mouseenter={() =>
								(showBackgroundColorInfo = true)}
							on:mouseleave={() =>
								(showBackgroundColorInfo = false)}
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
		<div class="alert-grid-container">
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
					<img class="absolute max-w-[3.25rem] h-[3.25rem] left-0" src='https://basedretard.com/cdn/shop/files/red.gif' alt="🪲" />
					<p class="pl-10">select media</p>
					<button
						on:mouseenter={() => (showUploadControls = true)}
						on:mouseleave={() => (showUploadControls = false)}
						class="text-xs flex space-x-4 absolute right-2 p-2"
					>
						{#if showUploadControls}
							<!-- link image url -->
							<button class="hover:bg-slate-600 p-2 px-4">link</button>
							<!-- delete -->
							{#if imageExists}
								<button>remove</button>
							{/if}
							<!-- upload -->
							<button class="hover:bg-slate-600 p-2 px-4">upload</button>
						{:else}
							<p class="text-2xl">+</p>
						{/if}
					</button>
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

			<!-- alert duration -->
			<div class="flex flex-col space-y-2">
				<div class="flex space-x-6">
					<label
						class="block text-slate-200 font-bold mb-2"
						for="alertduration">Alert Duration</label
					>
					<p>{alertDuration}s</p>
				</div>
				<!-- letter spacing slider -->
				<input
					bind:value={alertDuration}
					type="range"
					id="alertduration"
					name="alertduration"
					min="2"
					max="200"
					step="1"
				/>
			</div>
		</div>

		<!-- font settings -->
		<div class="alert-grid-container">
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
				<!-- font size slider -->
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
					bind:value={selectedWeight}
					on:click={handleWeightChange}
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
				<!-- letter spacing slider -->
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

	/* Base classes */
	.alert-grid {
		display: grid;
		grid-template-columns: repeat(2, calc(50% - 12px));
		gap: 24px;
	}

	.alert-grid-container {
		padding: 1rem;
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
		justify-content: flex-start;
		gap: 20px;
		width: calc(100% - 1px);
		border: 1px solid;
		border-radius: 0px;
	}

	.alert-grid-preview-container {
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
		justify-content: flex-start;
		gap: 20px;
		width: calc(100% - 1px);
		border: 1px solid;
		border-radius: 0px;
	}

	/* Variations for screen sizes large and smaller */
	@media (max-width: 1024px) {
		.alert-grid {
			grid-template-columns: 1fr; /* Single column grid layout */
			gap: 24px;
		}

		.alert-grid-container {
			width: 100%; /* Full width */
			padding: 1rem; /* Adjust padding for larger screens */
		}
	}
</style>
