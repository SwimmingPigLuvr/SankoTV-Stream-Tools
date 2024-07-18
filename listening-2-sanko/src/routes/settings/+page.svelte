<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
	import { onMount } from "svelte";
	import { alertConfig, messageTemplate } from "$lib/stores";
	import { fade, fly } from "svelte/transition";

	let isPreviewPlaying = false;

	let defaultMedia =
		"https://i.seadn.io/s/raw/files/e34c296e6e2089853f59748e87975c70.gif?auto=format&dpr=1&w=3840";
	let donationMediaSrc: string = defaultMedia;
	let layoutSelection = "imageAboveText";

	let previewContainer: HTMLElement;
	let previewContent: HTMLElement;
	let previewePlaceholder: HTMLElement;
	let maxWidth = 1080;
	let scale = 1;

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === previewContainer) {
					updatePreviewScale();
				}
			}
		});
		resizeObserver.observe(previewContainer);
		return () => {
			resizeObserver.disconnect();
		};
	});

	function updatePreviewScale() {
		const containerWidth = previewContainer.offsetWidth;
		scale = containerWidth / maxWidth;

		if (previewePlaceholder) {
			previewePlaceholder.style.transform = `scale(${scale})`;
			previewePlaceholder.style.transformOrigin = "center";
			previewePlaceholder.style.width = `${100 / scale}%`;
			previewePlaceholder.style.height = "540px";
		}
		if (previewContent) {
			previewContent.style.transform = `scale(${scale})`;
		}
	}

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

	let alertDuration = 2;

	let specificDonationAmount = 5;

	const fonts = [
		"cinema",
		"sans-serif",
		"serif",
		"monospace",
		"cursive",
		"fantasy",
	];
	let selectedFont = fonts[1];
	let selectedWeight = "normal";
	let selectedTextTransform = "none";
	let selectedTrigger = "donation";

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

	const senders = ["Bill", "Michael", "Kevin", "Todd", "David"];

	const gifts = [
		"Golden Glizzy",
		"Glock",
		"Diamond",
		"Steroids",
		"Trump",
		"O'Hearn",
		"Cross",
		"Size Chad",
		"Boxing Gloves",
		"Grippy",
		"Yellow Hat",
		"Liquidation",
		"Dubya",
		"Su Zhu",
		"Wizzy",
		"Orbs",
		"Cocktail",
		"Teddy",
		"Larry",
		"Addys",
		"Beer",
		"Banana",
		"Baby Bottle",
		"Kitten",
		"Femboy",
		"Dead Dev",
		"Daisy",
		"Cash",
		"Chili",
		"Glizzy",
		"Crack",
		"Bunny",
		"Mimosa",
		"Rug",
		"Cigarette",
		"Gensler",
		"Bitboy",
		"Clover",
		"Bible",
		"Head Phones",
		"Zyn",
	];

	function handleSpecificDonationAmount() {
		// todo use this to set the specific donation amount for
		// donation at least amount
		// donation exactly amount
		specificDonationAmount;
	}

	function handleTriggerChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (target) {
			setTrigger(target.value);
		}
	}

	function setTrigger(trigger: string) {
		selectedTrigger = trigger;
		console.log("set trigger: ", trigger);
		alertConfig.update((s) => ({ ...s, eventTrigger: trigger }));
	}

	function handleFontChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (target) {
			setFont(target.value);
		}
	}

	function setFont(font: string) {
		selectedFont = font;
		console.log("hey");
		alertConfig.update((s) => ({ ...s, fontFamily: font }));
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
				numericalWeight = "400";
		}
		alertConfig.update((s) => ({
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
		alertConfig.update((s) => ({
			...s,
			textTransform: textTransform,
		}));
	}

	function setFontSize(size: number) {
		let sizeString: string = `${size}px`;
		alertConfig.update((s) => ({ ...s, fontSize: sizeString }));
	}

	$: setFontSize(fontSize);

	function setLetterSpacing(spacing: number) {
		let spacingString: string = `${spacing}em`;
		alertConfig.update((s) => ({
			...s,
			letterSpacing: spacingString,
		}));
	}

	$: setLetterSpacing(letterSpacing);

	function setAlertDuration(duration: number) {
		alertConfig.update((s) => ({
			...s,
			alertDuration: duration,
		}));
	}

	$: setAlertDuration(alertDuration);

	function toggleMute() {
		muted = !muted;
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

	type Gift = (typeof gifts)[number];

	function formatPluralities(amount: number, gift: Gift): string {
		const specialPlurals: Record<Gift, string> = {
			Glizzy: "Glizzies",
			"Head Phones": "pairs of Head Phones",
			"Boxing Gloves": "Boxing Gloves",
			Addys: "Addys",
			"Golden Glizzy": "Golden Glizzies",
			Glock: "Glocks",
			Diamond: "Diamonds",
			Steroids: "Steroids",
			Trump: "Trumps",
			"O'Hearn": "O'Hearns",
			Cross: "Crosses",
			"Size Chad": "Size Chads",
			Grippy: "Grippies",
			"Yellow Hat": "Yellow Hats",
			Liquidation: "Liquidations",
			Dubya: "Dubyas",
			"Su Zhu": "Su Zhus",
			Wizzy: "Wizzies",
			Orbs: "Orbs",
			Cocktail: "Cocktails",
			Teddy: "Teddies",
			Larry: "Larrys",
			Beer: "Beers",
			Banana: "Bananas",
			"Baby Bottle": "Baby Bottles",
			Kitten: "Kittens",
			Femboy: "Femboys",
			"Dead Dev": "Dead Devs",
			Daisy: "Daisies",
			Cash: "Cash",
			Chili: "Chilis",
			Crack: "Cracks",
			Bunny: "Bunnies",
			Mimosa: "Mimosas",
			Rug: "Rugs",
			Cigarette: "Cigarettes",
			Gensler: "Genslers",
			Bitboy: "Bitboys",
			Clover: "Clovers",
			Bible: "Bibles",
			Zyn: "Zyns",
		};

		if (amount === 1) {
			if (gift === "Head Phones") {
				return `1 pair of Head Phones`;
			}
			return `${gift}`;
		}

		if (specialPlurals[gift]) {
			return `${specialPlurals[gift]}`;
		}

		if (
			gift.endsWith("y") &&
			!gift.endsWith("ay") &&
			!gift.endsWith("ey") &&
			!gift.endsWith("oy") &&
			!gift.endsWith("uy")
		) {
			return `${gift.slice(0, -1)}ies`;
		}

		return `${gift}s`;
	}

	function generateRandomMessage(template: string) {
		const sender = getRandomSender();
		const amount = getRandomAmount();
		const gift = getRandomGift();

		return template
			.replace("{sender}", sender)
			.replace("{amount}", amount.toString())
			.replace("{gift}", formatPluralities(amount, gift));
	}

	function handleDonationPreview() {
		isPreviewPlaying = true;
		setTimeout(() => {
			isPreviewPlaying = false;
		}, alertDuration * 1000);
	}
</script>

<svelte:head>
	<title>Donation Alert Settings</title>
</svelte:head>

<main
	class="text-white w-full overflow-x-hidden bg-slate-900 font-mono p-4 pt-20"
>
	<div class=" alert-grid m-auto sm:text-sm text-xs">
		<h1
			class="absolute top-10 font-cinema text-xl py-2 m-auto w-full text-left"
		>
			Donation Alerts
		</h1>
		<!-- donation preview -->
		<div
			bind:this={previewContainer}
			style="background-color: {currentBackgroundColor}"
			class="relative alert-grid-preview-container min-h-[420px]"
		>
			<!-- placeholder div to keep parent correct size -->
			<div
				bind:this={previewePlaceholder}
				class="preview-placeholder"
			></div>

			{#if isPreviewPlaying}
				<div
					in:fly={{ y: 1000, duration: 1000 }}
					bind:this={previewContent}
					class:layout-imageAboveText={layoutSelection ===
						"imageAboveText"}
					class:layout-textOverImage={layoutSelection ===
						"textOverImage"}
					class:layout-imgLeft={layoutSelection === "imgLeft"}
					class:layout-imgRight={layoutSelection === "imgRight"}
					class="preview-content leading-tight flex items-center justify-center text-center"
					style="background-color: {currentBackgroundColor}; border-radius: {$alertConfig.borderRadius}; font-family: {$alertConfig.fontFamily}; font-size: {$alertConfig.fontSize}; font-weight: {$alertConfig.fontWeight}; color: {$alertConfig.textColor}; text-transform: {$alertConfig.textTransform}; letter-spacing: {$alertConfig.letterSpacing}; text-shadow: {$alertConfig.textShadow};"
				>
					{#if layoutSelection === "textOverImage"}
						<img src={donationMediaSrc} alt="" />
						<div class="text">
							{generateRandomMessage($messageTemplate)}
						</div>
					{:else}
						<img src={donationMediaSrc} alt="" />
						{generateRandomMessage($messageTemplate)}
					{/if}
				</div>
			{/if}
			<div
				class="absolute bg-slate-900 z-20 bottom-0 w-full p-4 flex space-x-2 justify-end items-center"
			>
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
					class="px-3 p-2 text-xl hover:bg-slate-800"
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

		<!-- alert config -->
		<div class="alert-grid-container">
			<!-- event trigger -->
			<div class="flex flex-col space-y-2">
				<label for="eventtrigger">Event Trigger</label>
				<select
					class="custom-dropdown p-4 bg-slate-800"
					name="eventtrigger"
					id="eventtrigger"
					bind:value={selectedTrigger}
					on:change={handleTriggerChange}
				>
					<option value="donation">Donation</option>
					<option value="specificgift">Specific Gift</option>
					<option value="topdonation">Top Donation</option>
					<option value="atleast"
						>Donation amount is at least [amount]</option
					>
					<option value="exactamount"
						>Donation is exactly [amount]</option
					>
				</select>
			</div>

			{#if selectedTrigger === "atleast" || selectedTrigger === "exactamount"}
				<!-- donation amount -->
				<div class="flex flex-col space-y-2">
					<label for="donationamount">Donation Amount</label>
					<input
						type="number"
						class="custom-dropdown p-4 bg-slate-800"
						name="donationamount"
						id="donationamount"
						bind:value={specificDonationAmount}
						on:change={handleSpecificDonationAmount}
					/>
				</div>
			{/if}

			<!-- layout -->
			<div class="flex flex-col space-y-2">
				<label for="layout">Layout</label>
				<select
					class="custom-dropdown p-4 bg-slate-800"
					name="layout"
					id="layout"
				>
					<option value="imageAboveText">Image above text</option>
					<option value="textOverImage">Text over image</option>
					<option value="imgLeft">Image to left</option>
					<option value="imgRight">Image to right</option>
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
					<img
						class="absolute max-w-[3.25rem] h-[3.25rem] left-0"
						src={donationMediaSrc}
						alt="🪲"
					/>
					<p class="pl-10">select media</p>
					<button
						on:mouseenter={() => (showUploadControls = true)}
						on:mouseleave={() => (showUploadControls = false)}
						class="text-xs flex space-x-4 absolute right-2 p-2"
					>
						{#if showUploadControls}
							<!-- link image url -->
							<button class="hover:bg-slate-600 p-2 px-4"
								>link</button
							>
							<!-- delete -->
							{#if imageExists}
								<button>remove</button>
							{/if}
							<!-- upload -->
							<button class="hover:bg-slate-600 p-2 px-4"
								>upload</button
							>
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

		<!-- animation/sound settings -->
		<div class="alert-grid-container">
			<!-- sound-->
			<!-- implement the same as the img upload -->

			<div class="flex flex-col space-y-2">
				<label for="sound">Sound</label>
				<!-- image upload -->
				<button
					class="relative flex items-center space-x-4 p-4 bg-slate-800"
					name="image"
					id="image"
				>
					<img
						class="absolute max-w-[3.25rem] h-[3.25rem] left-0"
						src={donationMediaSrc}
						alt="🪲"
					/>
					<p class="pl-10">select media</p>
					<button
						on:mouseenter={() => (showUploadControls = true)}
						on:mouseleave={() => (showUploadControls = false)}
						class="text-xs flex space-x-4 absolute right-2 p-2"
					>
						{#if showUploadControls}
							<!-- link image url -->
							<button class="hover:bg-slate-600 p-2 px-4"
								>link</button
							>
							<!-- delete -->
							{#if imageExists}
								<button>remove</button>
							{/if}
							<!-- upload -->
							<button class="hover:bg-slate-600 p-2 px-4"
								>upload</button
							>
						{:else}
							<p class="text-2xl">+</p>
						{/if}
					</button>
				</button>
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

			<!-- text color -->
			<div class="flex space-x-12 justify-start py-2">
				<!-- color -->
				<div class="flex space-x-2 items-center">
					<label for="color">Text Color</label>
					<input
						name="color"
						id="color"
						type="color"
						bind:value={$alertConfig.textColor}
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
						bind:value={$alertConfig.highlightColor}
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

			<!-- text color -->
			<div class="flex space-x-12 justify-start py-2">
				<!-- color -->
				<div class="flex space-x-2 items-center">
					<label for="color">Text Color</label>
					<input
						name="color"
						id="color"
						type="color"
						bind:value={$alertConfig.textColor}
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
						bind:value={$alertConfig.highlightColor}
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

	.alert-grid {
		max-width: 1080;
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
		align-items: center;
		justify-content: center;
		gap: 20px;
		width: 100%;
		border: 1px solid;
		border-radius: 0px;
		overflow: hidden;
	}

	.preview-placeholder {
		width: 100%;
		height: 540px;
		transform-origin: center;
	}

	.preview-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transform-origin: center;
	}

	@media (max-width: 1024px) {
		.alert-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.alert-grid-container {
			width: 100%;
			padding: 1rem;
		}
	}

	.layout-imageAboveText {
		gap: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.layout-textOverImage {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.layout-textOverImage img {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 1;
	}
	.layout-textOverImage .text {
		position: absolute;
		z-index: 2;
	}
	.layout-imgLeft {
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}

	.layout-imgRight {
		display: flex;
		flex-direction: row-reverse;
		gap: 2rem;
	}
</style>
