<!-- src/routes/donationAlerts/+page.svelte -->
<script lang="ts">
	import type { AnimationProps } from "$lib/types";
	import { onMount, onDestroy } from "svelte";
	import { writable } from "svelte/store";
	import { browser } from "$app/environment";
	import { isDarkMode, showNameAlert } from "$lib/stores";
	import {
		alertConfig,
		type AlertConfig,
		messageTemplate,
	} from "$lib/stores/alertConfigStore";
	import { fade, fly, slide, scale, draw, blur } from "svelte/transition";
	import AnimationControls from "$lib/components/AnimationControls.svelte";
	import { inConfig, outConfig } from "$lib/animations/stores";
	import * as easings from "svelte/easing";
	import CreateNew from "$lib/components/CreateNew.svelte";
	import { goto } from "$app/navigation";
	import { currentAlert, type Alert } from "$lib/stores/currentAlert";
	import { page } from "$app/stores";
	import { userData } from "$lib/stores/userDataStore";
	import lodash from "lodash";

	const { debounce } = lodash;

	let alerts: Alert[] = [];
	let nice = false;

	interface AlertCreatedEvent {
		id: string;
		name: string;
		config: AlertConfig;
	}

	type Placeholder = "{sender}" | "{amount}" | "{gift}";

	let alertName = "";
	let alertActive = true;
	let volumePercent = 50;
	let volume = volumePercent / 100;

	$: {
		volume = volumePercent / 100;
		if (audio) {
			audio.volume = volume;
		}
	}

	let audio: HTMLAudioElement | undefined;
	let currentAudioSrc: string | null = "/sounds/notification.mp3";

	// This will run only in the browser
	if (browser) {
		onMount(() => {
			if (currentAudioSrc) {
				audio = new Audio(currentAudioSrc);
				audio.volume = volume;
			}
		});
	}

	function playAudio() {
		if (audio) {
			audio.play();
		}
	}

	let isPreviewPlaying = false;

	let defaultMedia =
		"https://i.seadn.io/s/raw/files/e34c296e6e2089853f59748e87975c70.gif?auto=format&dpr=1&w=3840";
	let currentMediaSrc: string | null = defaultMedia;
	let layoutSelection = "imageAboveText";

	let previewContainer: HTMLElement;
	let previewContent: HTMLElement;
	let previewePlaceholder: HTMLElement;
	let maxWidth = 1080;
	let divScale = 1;

	const debouncedUpdateAlertName = debounce((name: string) => {
		currentAlert.update((alert: Alert | null) => {
			if (alert) {
				return { ...alert, name: name };
			}
			return null;
		});
	}, 300);

	onMount(() => {
		alerts = $userData?.data.donationAlerts || [];
		const alertId = $page.url.searchParams.get("id");

		if (alertId) {
			const alert = alerts.find((a) => a.id === alertId);
			if (alert) {
				currentAlert.set(alert);
			} else {
				currentAlert.reset();
			}
		} else {
			currentAlert.reset();
		}

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
		divScale = containerWidth / maxWidth;

		if (previewePlaceholder) {
			previewePlaceholder.style.transform = `scale(${divScale})`;
			previewePlaceholder.style.transformOrigin = "center";
			previewePlaceholder.style.width = `${100 / divScale}%`;
			previewePlaceholder.style.height = "540px";
		}
		if (previewContent) {
			previewContent.style.transform = `scale(${divScale})`;
		}
	}

	let currentBackgroundColor = "#000000";

	$: currentBackgroundColor = $isDarkMode ? "#000000" : "#ffffff";

	let showImgUploadControls = false;
	let showAudioUploadControls = false;
	let showTemplateInfo = false;
	let showBackgroundColorInfo = false;
	let showWeightInfo = false;
	let message: string;
	let muted = false;

	let fontSize = 32;
	let letterSpacing = 0;

	let alertDuration = 4;

	let specificDonationAmount: number | null = null;
	let specificGift: string | null = null;

	const fonts = [
		"amsterdam",
		"amsterdam-display",
		"anthem",
		"badger",
		"botch",
		"cinema",
		"coolfont",
		"coolfont-cloud",
		"coolfont-distorted",
		"coolfont-fire",
		"coolfont-fluid",
		"coolfont-goop",
		"coolfont-pixel",
		"coolfont-pix-outlined",
		"coolfont-rough-outlined",
		"coolfont-simplified",
		"coolfont-sketch",
		"coolfont-structured",
		"coolfont-trippy",
		"sunny",
		"sans-serif",
		"serif",
		"monospace",
		"cursive",
		"fantasy",
	];

	let selectedFont = "coolfont-trippy";
	let selectedWeight = "normal";
	let selectedTextTransform = "none";
	let selectedTrigger = "donation";

	$: if (selectedTrigger !== "specificgift") {
		specificGift = null;
	}

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

	function applyAnimation(node: HTMLElement, props: any) {
		const { type, easing: easingName, ...params } = props;
		const easing =
			typeof easingName === "string"
				? easings[easingName as keyof typeof easings] || easings.linear
				: easingName;
		switch (type) {
			case "blur":
				return blur(node, { ...params, easing });
			case "fade":
				return fade(node, { ...params, easing });
			case "fly":
				return fly(node, { ...params, easing });
			case "scale":
				return scale(node, { ...params, easing });
			case "slide":
				return slide(node, { ...params, easing });
			default:
				return {};
		}
	}

	function handleRemoveCurrentMedia() {
		currentMediaSrc = null;
	}

	function handleRemoveCurrentAudio() {
		currentAudioSrc = null;
	}

	function handleSpecificDonationAmount() {
		// todo use this to set the specific donation amount for
		// donation at least amount
		// donation exactly amount
		specificDonationAmount;
	}

	function handleSpecificGiftChoice() {
		// do something with the specific gift
		specificGift;
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

	function setAlertVolume(volume: number) {
		alertConfig.update((s) => ({ ...s, alertVolume: volume }));
	}

	$: setAlertVolume(volume);

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

	function toggleAlert() {
		alertActive = !alertActive;
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

	function generateRandomMessage(template: string): {
		parts: { text: string; highlight: boolean }[];
	} {
		const sender = getRandomSender();
		const amount = getRandomAmount();
		let gift;
		if (specificGift) {
			gift = specificGift;
		} else {
			gift = getRandomGift();
		}

		const placeholders: Record<Placeholder, string> = {
			"{sender}": sender,
			"{amount}": amount.toString(),
			"{gift}": formatPluralities(amount, gift),
		};

		const parts = template.split(/({\w+})/g).map((part) => {
			if (part in placeholders) {
				return {
					text: placeholders[part as Placeholder],
					highlight: true,
				};
			}
			return { text: part, highlight: false };
		});

		return { parts };
	}

	function handleDonationPreview() {
		console.log("animation props");
		console.log("IN: ", $inConfig);
		console.log("OUT: ", $outConfig);
		// play /sounds/notification.mp3
		if (!isPreviewPlaying) {
			isPreviewPlaying = true;
			if (!muted) {
				playAudio();
			}
			setTimeout(() => {
				isPreviewPlaying = false;
			}, alertDuration * 1000);
		}
	}

	$: if ($currentAlert) {
		debouncedUpdateAlert($currentAlert);
		alertName = $currentAlert.name;
	} else {
		alertName = "";
	}

	const debouncedUpdateAlert = debounce((alert: Alert) => {
		const index = alerts.findIndex((a) => a.id === alert.id);
		if (index !== -1) {
			alerts[index] = alert;
			alerts = [...alerts, alert];
			userData.updateDataField("donationAlerts", alerts);
			console.log("alert updated in db");
			nice = true;
			setTimeout(() => {
				let nice = false;
				console.log(nice);
			}, 500);
		}
	}, 500);

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		alertName = input.value;
		debouncedUpdateAlertName(alertName);
	}

	function handleAlertCreated(event: CustomEvent<AlertCreatedEvent>) {
		// if alert has been created and added to userData in the CreateNew component
		const newAlert = event.detail;
		alerts = [...alerts, newAlert];
		userData.updateDataField("donation-alerts", alerts);
		showNameAlert.set(false);
		selectAlert(newAlert);
	}

	function handleCloseNameAlert() {
		showNameAlert.set(false);
	}

	function selectAlert(alert: Alert) {
		currentAlert.set(alert);
		goto(`/dashboard/donation-alerts?id=${alert.id}`);
	}

	function handleSaveAlert() {
		if ($currentAlert) {
			const index = alerts.findIndex((a) => a.id === $currentAlert.id);
			if (index !== -1) {
				alerts[index] = $currentAlert;
				alerts = [...alerts];
				userData.updateDataField("donation-alerts", alerts);
			}
		}
	}

	function backToList() {
		currentAlert.reset();
		goto("/dashboard/donation-alerts");
	}

	onDestroy(() => {
		debouncedUpdateAlertName.cancel();
	});
</script>

<svelte:head>
	<title>Donation Alert Settings</title>
</svelte:head>

<main
	class="{$isDarkMode
		? 'bg-slate-900 text-white'
		: 'bg-lime-100 text-slate-800'} w-full overflow-x-hidden font-mono p-4 pt-20"
>
	{#if nice}
		<button
			class="z-50 fixed bottom-2 right-2 bg-slate-900 border-[1px] border-lime-400"
		>
			<p class="font-badger text-lime-400">NICE</p>
		</button>
	{/if}

	{#if $showNameAlert}
		<div class="z-50">
			<CreateNew
				on:alertCreated={handleAlertCreated}
				on:close={handleCloseNameAlert}
			/>
		</div>
	{/if}

	<div class="alert-grid m-auto sm:text-sm text-xs max-w-1080px]">
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
					in:applyAnimation={$inConfig}
					out:applyAnimation={$outConfig}
					bind:this={previewContent}
					class:layout-imageAboveText={layoutSelection ===
						"imageAboveText"}
					class:layout-textOverImage={layoutSelection ===
						"textOverImage"}
					class:layout-imgLeft={layoutSelection === "imgLeft"}
					class:layout-imgRight={layoutSelection === "imgRight"}
					class="preview-content leading-[1] flex items-center justify-center text-center"
					style="background-color: {currentBackgroundColor}; border-radius: {$alertConfig.borderRadius}; font-family: {$alertConfig.fontFamily}; font-size: {$alertConfig.fontSize}; font-weight: {$alertConfig.fontWeight}; color: {$alertConfig.textColor}; text-transform: {$alertConfig.textTransform}; letter-spacing: {$alertConfig.letterSpacing}; text-shadow: {$alertConfig.textShadow};"
				>
					{#if layoutSelection === "textOverImage"}
						<img src={currentMediaSrc} alt="" />
						<div class="text" style="white-space: nowrap;">
							{#each generateRandomMessage($messageTemplate).parts as part}
								<span
									style="color: {part.highlight
										? $alertConfig.highlightColor
										: $alertConfig.textColor};"
								>
									{part.text}
								</span>
							{/each}
						</div>
					{:else}
						<img src={currentMediaSrc} alt="" />
						<div style="white-space: nowrap;">
							{#each generateRandomMessage($messageTemplate).parts as part}
								<span
									style="color: {part.highlight
										? $alertConfig.highlightColor
										: $alertConfig.textColor};"
								>
									{part.text}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
			<div
				class="absolute {$isDarkMode
					? 'bg-slate-900'
					: 'bg-lime-200'} z-20 bottom-0 w-full p-4 flex space-x-2 justify-end items-center"
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
							class="{$isDarkMode
								? 'bg-slate-600 text-slate-400 hover:bg-slate-400 hover:text-slate-900'
								: 'bg-lime-600 text-white hover:bg-lime-400 hover:text-black'} relative rounded-full w-4 h-4 text-xs"
							>i
							{#if showBackgroundColorInfo}
								<div
									in:fly={{ y: 10 }}
									class="absolute border-[1px] -top-40 -left-20 text-left w-48 z-20 p-3 {$isDarkMode
										? 'bg-slate-300 text-slate-600'
										: 'bg-lime-400 text-black border-black'}"
								>
									This will not effect the background color of
									the alert. This is just for preview
									purposes. For best results set background
									color to match your stream.
								</div>
							{/if}
						</button>
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
					class="px-3 p-2 text-xl rounded-full {$isDarkMode
						? 'hover:bg-slate-800'
						: 'hover:bg-lime-300'} hover:bg-slate-800"
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
					disabled={isPreviewPlaying}
					class="text-xs ml-auto text-right p-4 {$isDarkMode
						? 'bg-slate-800 hover:bg-slate-600'
						: 'bg-lime-400 hover:bg-lime-600 hover:text-lime-100'} {isPreviewPlaying
						? 'cursor-not-allowed'
						: ''} ">preview</button
				>
			</div>
		</div>

		<!-- alert config -->
		<div class="alert-grid-container relative">
			<div
				class="{$isDarkMode
					? 'bg-black border-b-white'
					: 'bg-white border-b-black'}  border-b-[1px] z-20 p-4 absolute top-0 w-full left-0 flex justify-between"
			>
				<!-- alert name -->
				<div class="flex flex-col space-y-2 w-[70%]">
					<label for="alertname">Alert Name</label>
					<!-- text input -->
					<input
						bind:value={alertName}
						on:input={handleInput}
						name="alertName"
						id="alertName"
						class=" flex space-x-4 p-4 {$isDarkMode
							? 'bg-slate-800'
							: 'bg-lime-200'}"
						type="text"
					/>
				</div>

				<!-- alert active -->
				<div class="flex flex-col space-y-2 w-[30%] items-center">
					<label for="active" class="text-center"
						>Alert {alertActive ? "Enabled" : "Disabled"}</label
					>
					<button
						name="active"
						id="active"
						on:click={() => toggleAlert()}
						class="p-1 px-2 rounded-full flex items-center text-xl {$isDarkMode
							? 'hover:bg-slate-800'
							: 'hover:bg-lime-200'}"
					>
						{#if alertActive}
							✅
						{:else}
							❌
						{/if}
					</button>
				</div>
			</div>

			<!-- event trigger -->
			<div class="flex flex-col space-y-2 mt-28">
				<label for="eventtrigger">Event Trigger</label>
				<select
					class="custom-dropdown p-4 {$isDarkMode
						? 'bg-slate-800'
						: 'bg-lime-200'}"
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

			{#if selectedTrigger === "specificgift"}
				<!-- specific gift -->
				<!-- reverse this -->
				<div class="flex flex-col space-y-2">
					<label for="gift">Gift</label>
					<select
						class="custom-dropdown p-4 {$isDarkMode
							? 'bg-slate-800'
							: 'bg-lime-200'}"
						name="gift"
						id="gift"
						bind:value={specificGift}
						on:change={handleSpecificGiftChoice}
					>
						{#each gifts as gift}
							<option value={gift}>{gift}</option>
						{/each}
					</select>
				</div>
			{/if}

			{#if selectedTrigger === "atleast" || selectedTrigger === "exactamount"}
				<!-- donation amount -->
				<div class="flex flex-col space-y-2">
					<label for="donationamount">Donation Amount</label>
					<input
						type="number"
						class="custom-dropdown p-4 {$isDarkMode
							? 'bg-slate-800'
							: 'bg-lime-200'}"
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
					class="custom-dropdown p-4 {$isDarkMode
						? 'bg-slate-800'
						: 'bg-lime-200'}"
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
					class="relative flex items-center space-x-4 p-4 {$isDarkMode
						? 'bg-slate-800'
						: 'bg-lime-200'}"
					name="image"
					id="image"
				>
					<img
						class="absolute max-w-[3.25rem] h-[3rem] left-0"
						src={currentMediaSrc
							? currentMediaSrc
							: "/gifs/minecraft.gif"}
						alt="🪲"
					/>
					<p class="pl-10 truncate max-w-sm sm:max-w-lg">
						{currentMediaSrc
							? currentMediaSrc
							: "upload/link media"}
					</p>
					<button
						on:mouseenter={() => (showImgUploadControls = true)}
						on:mouseleave={() => (showImgUploadControls = false)}
						class="text-xs flex {$isDarkMode
							? 'bg-slate-800'
							: 'bg-lime-200'} space-x-0 absolute right-2"
					>
						{#if showImgUploadControls}
							<!-- link image url -->
							<button
								class="{$isDarkMode
									? 'hover:bg-slate-600'
									: 'hover:bg-lime-400'} p-2 px-4"
								>link</button
							>
							<!-- delete -->
							{#if currentMediaSrc}
								<button
									on:click={handleRemoveCurrentMedia}
									class="{$isDarkMode
										? 'hover:bg-slate-600'
										: 'hover:bg-lime-400'} p-2 px-4"
									>remove</button
								>
							{/if}
							<!-- upload -->
							<button
								class="{$isDarkMode
									? 'hover:bg-slate-600'
									: 'hover:bg-lime-400'} p-2 px-4"
								>upload</button
							>
						{:else}
							<p class="text-2xl p-2">+</p>
						{/if}
					</button>
				</button>
			</div>

			<!-- Message template -->
			<div class="flex flex-col space-y-2">
				<div class="flex space-x-6 items-center">
					<label for="template">Message Template</label>
					<button
						on:mouseenter={() => (showTemplateInfo = true)}
						on:mouseleave={() => (showTemplateInfo = false)}
						class="{$isDarkMode
							? 'bg-slate-600 text-slate-400 hover:bg-slate-400 hover:text-slate-900'
							: 'bg-lime-600 text-white hover:bg-lime-400 hover:text-black'} relative rounded-full w-4 h-4 text-xs"
						>i
						{#if showTemplateInfo}
							<div
								in:fly={{ y: 10 }}
								class="{$isDarkMode
									? 'bg-slate-300 text-slate-600'
									: 'bg-lime-400 text-black border-black'} border-[1px] absolute -top-28 -left-20 text-left w-48 z-20 p-3"
							>
								Format your message with three possible
								variables:
								<p>SENDER, AMOUNT, & GIFT.</p>
							</div>
						{/if}
					</button>
				</div>

				<!-- delete after we write this input correctly -->

				<!-- text input -->
				<input
					bind:value={$messageTemplate}
					on:change={() => messageTemplate.set(message)}
					name="template"
					id="template"
					class="flex space-x-4 p-4 {$isDarkMode
						? 'bg-slate-800'
						: 'bg-lime-200'}"
					type="text"
				/>
			</div>

			<!-- alert duration -->
			<div class="flex flex-col space-y-2">
				<div class="flex space-x-6">
					<label class="block mb-2" for="alertduration"
						>Alert Duration</label
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
				<!-- sound upload -->
				<button
					class="relative flex items-center space-x-4 p-4 {$isDarkMode
						? 'bg-slate-800'
						: 'bg-lime-200'}"
					name="sound"
					id="sound"
				>
					<p class="absolute text-2xl left-3">🎧</p>

					<p class="pl-10">
						{currentAudioSrc
							? currentAudioSrc
							: "upload/link audio"}
					</p>
					<button
						on:mouseenter={() => (showAudioUploadControls = true)}
						on:mouseleave={() => (showAudioUploadControls = false)}
						class="text-xs z-20 {$isDarkMode
							? 'bg-slate-800'
							: 'bg-lime-200'} flex space-x-0 absolute right-2"
					>
						{#if showAudioUploadControls}
							<!-- link image url -->
							<button
								class="{$isDarkMode
									? 'hover:bg-slate-600'
									: 'hover:bg-lime-400'} p-2 px-4"
								>link</button
							>
							<!-- delete -->
							{#if currentAudioSrc}
								<button
									on:click={handleRemoveCurrentAudio}
									class="{$isDarkMode
										? 'hover:bg-slate-600'
										: 'hover:bg-lime-400'} p-2 px-4"
									>remove</button
								>
							{/if}
							<!-- upload -->
							<button
								class="{$isDarkMode
									? 'hover:bg-slate-600'
									: 'hover:bg-lime-400'} p-2 px-4"
								>upload</button
							>
						{:else}
							<p class="text-2xl p-2">+</p>
						{/if}
					</button>
				</button>
			</div>

			<!-- alert volume -->
			<div class="flex flex-col space-y-2">
				<div class="flex space-x-6">
					<label class="block mb-2" for="volume">Volume</label>
					<p>{volumePercent}%</p>
				</div>
				<!-- volume slider -->
				<input
					bind:value={volumePercent}
					type="range"
					id="volume"
					name="volume"
					min="0"
					max="100"
					step="1"
				/>
			</div>
		</div>

		<div class="alert-grid-container">
			<AnimationControls />
		</div>

		<!-- font settings -->
		<div class="alert-grid-container">
			<!-- font family -->
			<div class="flex flex-col space-y-2">
				<label for="font">Font</label>
				<select
					class="custom-dropdown p-4 {$isDarkMode
						? 'bg-slate-800'
						: 'bg-lime-200'}"
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
					<label class="block mb-2" for="font">Size</label>
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
				<div class="space-x-2">
					<label for="fontweight">Weight</label>
					<button
						on:mouseenter={() => (showWeightInfo = true)}
						on:mouseleave={() => (showWeightInfo = false)}
						class="relative {$isDarkMode
							? 'bg-slate-600 hover:bg-slate-400 text-slate-400 hover:text-slate-900'
							: 'bg-lime-600 text-white hover:bg-lime-400 hover:text-black'} rounded-full w-4 h-4 text-xs"
						>i
						{#if showWeightInfo}
							<div
								in:fly={{ y: 10 }}
								class="absolute border-[1px] -top-20 -left-20 text-left w-48 z-20 p-3 {$isDarkMode
									? 'bg-slate-300 text-slate-600'
									: 'bg-lime-400 text-black border-black'}"
							>
								Some fonts do not have variable weights
							</div>
						{/if}
					</button>
				</div>
				<select
					class="custom-dropdown p-4 {$isDarkMode
						? 'bg-slate-800'
						: 'bg-lime-200'}"
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
					<label class="block mb-2" for="letterspacing"
						>Letter Spacing</label
					>
					<p>{letterSpacing}em</p>
				</div>
				<!-- letter spacing slider -->
				<input
					bind:value={letterSpacing}
					type="range"
					id="letterspacing"
					name="letterspacing"
					min="-0.1"
					max="0.1"
					step="0.01"
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
					class="custom-dropdown p-4 {$isDarkMode
						? 'bg-slate-800'
						: 'bg-lime-200'}"
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
		gap: 0.5rem;
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
