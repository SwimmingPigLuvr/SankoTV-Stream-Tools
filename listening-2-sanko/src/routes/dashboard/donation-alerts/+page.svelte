<!-- src/routes/donationAlerts/+page.svelte -->
<script lang="ts">
	import type { AnimationProps } from "$lib/types";
	import { onMount, onDestroy } from "svelte";
	import { writable, get } from "svelte/store";
	import { browser } from "$app/environment";
	import {
		isDarkMode,
		showNameAlert,
		showLinkVisualMedia,
	} from "$lib/stores";
	import {
		alertConfig,
		type AlertConfig,
		messageTemplate,
		currentAlert,
		type Alert,
	} from "$lib/stores/alertConfigStore";
	import { fade, fly, slide, scale, draw, blur } from "svelte/transition";
	import AnimationControls from "$lib/components/AnimationControls.svelte";
	import { inConfig, outConfig } from "$lib/animations/stores";
	import * as easings from "svelte/easing";
	import CreateNew from "$lib/components/CreateNew.svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { userData } from "$lib/stores/userDataStore";
	import lodash from "lodash";
	import UploadOrLinkMedia from "$lib/components/UploadOrLinkMedia.svelte";
	import Timer from "$lib/components/Timer.svelte";

	const { debounce } = lodash;

	let alerts: Alert[] = [];
	$: alerts = $userData?.data?.donationAlerts || [];

	$: {
		const alertId = $page.url.searchParams.get("id");
		if (alertId && alerts.length > 0) {
			const alert = alerts.find((a) => a.id === alertId);
			if (alert) {
				currentAlert.set(alert);
			} else {
				currentAlert.reset();
				console.log("alert not found");
			}
		} else if (!alertId) {
			currentAlert.reset();
		}
	}

	interface AlertCreatedEvent {
		id: string;
		name: string;
		config: AlertConfig;
		isActive: boolean;
	}

	type Placeholder = "{sender}" | "{amount}" | "{gift}";

	$: alertName = $currentAlert?.name;
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

	function handleVisualMediaSelected(event: CustomEvent) {
		console.log("event.detail: ", event.detail);
		console.log("event.detail.media: ", event.detail.media);
		updateAlertConfig("mediaSrc", event.detail.media);
	}

	function playAudio() {
		if (audio) {
			audio.play();
		}
	}

	let isPreviewPlaying = false;

	function startPreview() {
		isPreviewPlaying = true;
	}

	function endPreview() {
		isPreviewPlaying = false;
	}

	let defaultMedia =
		"https://i.seadn.io/s/raw/files/e34c296e6e2089853f59748e87975c70.gif?auto=format&dpr=1&w=3840";
	let currentMediaSrc: string | null = defaultMedia;

	let layout: string;
	$: if ($currentAlert) {
		layout = $currentAlert.config.composition;
	}

	let layoutSelection = "imageAboveText";

	let previewContainer: HTMLElement;
	let previewContent: HTMLElement;
	let previewPlaceholder: HTMLElement;
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

	let showUploadVisualMedia = false;
	let showUploadAudio = false;
	let showLinkAudio = false;

	let showToast = false;
	let toastKey = "";
	let toastValue = "";

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

	const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

	const senders = ["swimmingPig", "fizzleStix", "charlotte", "Tony", "Dav3"];

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

	$: inAnimation = $currentAlert?.config.animation?.in;
	$: outAnimation = $currentAlert?.config.animation?.out;

	function applyAnimation(node: HTMLElement, props: any) {
		if (!props) return {};

		const { type, easing: easingName, ...params } = props;
		const easing =
			typeof easingName === "string"
				? easings[easingName as keyof typeof easings] || easings.linear
				: easings.linear;
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
		updateAlertConfig("mediaSrc", null);
		updateAlertConfig("composition", "image-above-text");
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

	function generateRandomMessage(): {
		parts: { text: string; highlight: boolean }[];
	} {
		if (!$currentAlert) {
			console.warn("no current alert available");
			return { parts: [] };
		}

		const alert = get(currentAlert);
		const template = alert?.config.messageTemplate;
		if (!template) {
			console.warn("no template available");
			return { parts: [] };
		}

		const sender = getRandomSender();
		const amount = getRandomAmount();
		const gift =
			$currentAlert.config.eventTrigger === "specificgift"
				? $currentAlert.config.specificGift
				: getRandomGift();

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
		}
	}, 500);

	const debouncedUpdateDatabase = debounce((alerts: Alert[]) => {
		userData.updateDataField("donationAlerts", alerts);
		console.log("alert updated in db");
	}, 500);

	interface Toast {
		key: string;
		value: any;
	}

	let toasts: Toast[] = [];

	// Function to delete a toast from the array using the toast's key
	function deleteToast(key: string): void {
		// Find the index of the toast with the specified key
		const index = toasts.findIndex((toast) => toast.key === key);

		// If the toast is found, remove it from the array
		if (index !== -1) {
			toasts.splice(index, 1);
		}
	}

	function pushToastNoti(key: string, value: any) {
		// Push the new Toast object into the toasts array
		toasts.push({ key, value });

		// Set a timeout to remove the toast after 5000ms
		setTimeout(() => {
			// Find the index of the toast to remove
			const index = toasts.findIndex(
				(toast) => toast.key === key && toast.value === value,
			);
			// Remove the toast if it exists in the array
			if (index !== -1) {
				toasts.splice(index, 1);
			}
		}, 5000);
	}

	function updateAlertName(key: "name", name: string) {
		const alert = get(currentAlert);
		if (!alert) {
			console.error("no alert currently selected");
			return;
		}

		// update current alert store with new name
		const updatedAlert = {
			...alert,
			name: name,
		};
		currentAlert.set(updatedAlert);

		// push toast
		pushToastNoti(key, name);

		// make sure that the updatedonation alert method can handle updating the name field
		userData.updateDonationAlert(updatedAlert);
	}

	function toggleIsActive() {
		const alert = get(currentAlert);
		if (!alert) {
			console.error("no alert currently selected");
			return;
		}

		// toggle isActive
		const updatedAlert = {
			...alert,
			isActive: !alert.isActive,
		};
		currentAlert.set(updatedAlert);

		// push toast
		pushToastNoti("isActive", updatedAlert.isActive);

		userData.updateDonationAlert(updatedAlert);
	}

	function updateAlertConfig(key: string, value: any) {
		console.log(`updating alert config. Key: ${key}, vlue:`, value);

		currentAlert.update((alert) => {
			if (!alert) {
				console.error("No alert is currently selected");
				return alert;
			}

			const keys = key.split(".");
			console.log("parsed keys", keys);
			let current: any = alert.config;
			for (let i = 0; i < keys.length - 1; i++) {
				if (!current[keys[i]]) current[keys[i]] = {};
				current = current[keys[i]];
			}

			const finalKey = keys[keys.length - 1];
			console.log(`setting ${finalKey} to: `, value);
			current[finalKey] = value;

			// trigger toast notification
			pushToastNoti(key, value);

			// Update user data
			userData.updateDonationAlert(alert);

			return alert;
		});
	}

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		alertName = input.value;
		debouncedUpdateAlertName(alertName);
	}

	async function handleAlertCreated(event: CustomEvent<AlertCreatedEvent>) {
		// if alert has been created and added to userData in the CreateNew component
		const newAlert = event.detail;
		await userData.addDonationAlert(newAlert);
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
	in:fly={{ y: 10, duration: 1000, easing: easings.backOut }}
	out:fly={{ y: 10, duration: 1000, easing: easings.backIn }}
	class="{$isDarkMode
		? 'bg-slate-900 text-white'
		: 'bg-lime-100 text-slate-800'} w-full overflow-x-hidden font-mono p-4 pt-20"
>
	{#each toasts as toast}
		<div
			class="fixed z-50 top-2 left-1/2 -translate-x-1/2 flex flex-col space-y-2"
		>
			<button
				in:fade
				class="{$isDarkMode
					? 'bg-lime-400 border-white'
					: 'bg-white border-blue-700'} border-[1px] w-[400px] rounded-none flex space-x-4 px-6 p-4 items-center justify-between"
			>
				<p
					class="{$isDarkMode
						? 'hue-rotate-90'
						: ' hue-rotate-180'} filter text-3xl"
				>
					✅
				</p>
				<p class="font-mono text-left flex flex-col space-y-">
					<span
						class="{$isDarkMode
							? 'text-white font-mono font-black'
							: 'text-black font-serif italic -tracking-wide capitalize'} text-xs"
						>{$currentAlert?.name} updataed</span
					>
					<span
						class="text {$isDarkMode
							? 'text-lime-600'
							: 'text-lime-600'}"
						>{toast.key} set to
						<span
							class={$isDarkMode
								? "text-white"
								: "text-sky-400 font-black"}>{toast.value}</span
						></span
					>
				</p>
				<button
					on:click={() => deleteToast(toast.key)}
					class="text-3xl right-4 ml-auto">x</button
				>
			</button>
		</div>
	{/each}

	{#if $showNameAlert}
		<div class="z-50">
			<CreateNew
				on:alertCreated={handleAlertCreated}
				on:close={handleCloseNameAlert}
			/>
		</div>
	{/if}

	<div class="alert-grid m-auto sm:text-sm text-xs max-w-[1234px]">
		<h1
			class="absolute top-10 font-mono text-xl py-2 m-auto w-full text-left"
		>
			<span>now editing: </span>
			{#if $currentAlert?.name}
				<span
					in:fade={{ duration: 500, easing: easings.cubicInOut }}
					class="text-lime-400">{$currentAlert?.name}</span
				>
			{:else}
				<span class=""> </span>
			{/if}
		</h1>
		<!-- donation preview -->
		<div
			bind:this={previewContainer}
			style="background-color: {currentBackgroundColor}"
			class="relative alert-grid-preview-container min-h-[420px]"
		>
			<!-- placeholder div to keep parent correct size -->
			<div
				bind:this={previewPlaceholder}
				class="preview-placeholder relative"
			></div>

			{#if isPreviewPlaying}
				<div
					in:applyAnimation={inAnimation}
					out:applyAnimation={outAnimation}
					bind:this={previewContent}
					class="{layout} preview-content leading-[1] flex items-center justify-center text-center"
					style="background-color: {currentBackgroundColor}; border-radius: {$currentAlert
						?.config.borderRadius}; font-family: {$currentAlert
						?.config.fontFamily}; font-size: {$currentAlert?.config
						.fontSize}; font-weight: {$currentAlert?.config
						.fontWeight}; color: {$currentAlert?.config
						.textColor}; text-transform: {$currentAlert?.config
						.textTransform}; letter-spacing: {$currentAlert?.config
						.letterSpacing}em; text-shadow: {$currentAlert?.config
						.textShadow};"
				>
					{#if layoutSelection === "tet-over-image"}
						<img
							src={$currentAlert?.config.mediaSrc
								? $currentAlert?.config.mediaSrc
								: currentMediaSrc}
							alt=""
						/>
						<div class="text" style="white-space: nowrap;">
							{#if $currentAlert}
								{#each generateRandomMessage().parts as part}
									<span
										style="color: {part.highlight
											? $currentAlert?.config
													.highlightColor
											: $currentAlert?.config.textColor};"
									>
										{part.text}
									</span>
								{/each}
							{/if}
						</div>
					{:else}
						<img
							class="max-h-[420px]"
							src={$currentAlert?.config.mediaSrc
								? $currentAlert?.config.mediaSrc
								: currentMediaSrc}
							alt=""
						/>
						<div style="white-space: nowrap;">
							{#if $currentAlert}
								{#each generateRandomMessage().parts as part}
									<span
										style="color: {part.highlight
											? $currentAlert?.config
													.highlightColor
											: $currentAlert?.config.textColor};"
									>
										{part.text}
									</span>
								{/each}
							{/if}
						</div>
					{/if}
				</div>
				{#if $currentAlert}
					<div class="absolute bottom-20 left-0 right-0 z-50">
						<Timer
							duration={$currentAlert.config.alertDuration}
							onComplete={endPreview}
						/>
					</div>
				{/if}
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
						value={$currentAlert?.name}
						on:change={(e) =>
							updateAlertName("name", e.currentTarget.value)}
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
						on:click={() => toggleIsActive()}
						class="p-1 px-2 rounded-full flex items-center text-xl {$isDarkMode
							? 'hover:bg-slate-800'
							: 'hover:bg-lime-200'}"
					>
						{#if $currentAlert?.isActive}
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
					value={$currentAlert?.config.eventTrigger}
					on:change={(e) =>
						updateAlertConfig(
							"eventTrigger",
							e.currentTarget.value,
						)}
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

			{#if $currentAlert?.config.eventTrigger === "specificgift"}
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
						value={$currentAlert?.config.specificGift}
						on:change={(e) =>
							updateAlertConfig(
								"specificGift",
								e.currentTarget.value,
							)}
					>
						{#each gifts as gift}
							<option value={gift}>{gift}</option>
						{/each}
					</select>
				</div>
			{/if}

			{#if $currentAlert?.config.eventTrigger === "atleast" || $currentAlert?.config.eventTrigger === "exactamount"}
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
						value={$currentAlert?.config.specificAmount}
						on:change={(e) =>
							updateAlertConfig(
								"specificAmount",
								e.currentTarget.value,
							)}
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
					value={$currentAlert?.config.composition}
					on:change={(e) =>
						updateAlertConfig("composition", e.currentTarget.value)}
				>
					<option value="image-above-text">Image above text</option>
					<option value="text-over-image">Text over image</option>
					<option value="image-left">Image left</option>
					<option value="image-right">Image right</option>
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
						src={$currentAlert?.config.mediaSrc
							? $currentAlert?.config.mediaSrc
							: "/gifs/minecraft.gif"}
						alt="🪲"
					/>
					<p class="pl-10 truncate max-w-sm sm:max-w-lg">
						{$currentAlert?.config.mediaSrc
							? $currentAlert?.config.mediaSrc
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
								on:click={() => showLinkVisualMedia.set(true)}
								class="{$isDarkMode
									? 'hover:bg-slate-600'
									: 'hover:bg-lime-400'} p-2 px-4"
								>link</button
							>
							<!-- delete -->
							{#if $currentAlert?.config.mediaSrc}
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
								on:click={() => (showUploadVisualMedia = true)}
								class="{$isDarkMode
									? 'hover:bg-slate-600'
									: 'hover:bg-lime-400'} p-2 px-4"
								>upload</button
							>
						{:else}
							<p class="text-2xl p-2">+</p>
						{/if}
					</button>

					<!-- link / upload modals -->
					{#if $showLinkVisualMedia}
						<div class="z-50">
							<UploadOrLinkMedia
								type="visual"
								mode="link"
								on:mediaSelected={handleVisualMediaSelected}
							/>
						</div>
					{/if}
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
					value={$currentAlert?.config.messageTemplate}
					on:change={(e) =>
						updateAlertConfig(
							"messageTemplate",
							e.currentTarget.value,
						)}
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
					<p>{$currentAlert?.config.alertDuration}s</p>
				</div>
				<!-- letter spacing slider -->
				<input
					value={$currentAlert?.config.alertDuration}
					on:change={(e) =>
						updateAlertConfig(
							"alertDuration",
							e.currentTarget.value,
						)}
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
					<p>
						{$currentAlert?.config.alertVolume
							? $currentAlert?.config.alertVolume
							: ""}%
					</p>
				</div>
				<!-- volume slider -->
				<input
					value={$currentAlert?.config.alertVolume
						? $currentAlert?.config.alertVolume
						: ""}
					on:change={(e) =>
						updateAlertConfig("alertVolume", e.currentTarget.value)}
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
			<AnimationControls
				{updateAlertConfig}
				alertConfig={$currentAlert?.config
					? $currentAlert.config
					: $alertConfig}
			/>
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
					value={$currentAlert?.config.fontFamily ??
						$alertConfig.fontFamily}
					on:change={(e) =>
						updateAlertConfig("fontFamily", e.currentTarget.value)}
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
					<p>{$currentAlert?.config.fontSize ?? fontSize}px</p>
				</div>
				<!-- font size slider -->
				<input
					value={parseInt(
						$currentAlert?.config.fontSize ?? $alertConfig.fontSize,
					)}
					on:input={(e) =>
						updateAlertConfig(
							"fontSize",
							`${e.currentTarget.value}px`,
						)}
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
					name="fontweight"
					id="fontweight"
					value={$currentAlert?.config.fontWeight}
					on:change={(e) =>
						updateAlertConfig("fontWeight", e.currentTarget.value)}
				>
					{#each fontWeights as weight}
						<option value={weight}>{weight}</option>
					{/each}
				</select>
			</div>

			<!-- tracking -->
			<div class="flex flex-col space-y-2">
				<div class="flex space-x-6">
					<label class="block mb-2" for="letterspacing"
						>Letter Spacing</label
					>
					<p>{$currentAlert?.config.letterSpacing}em</p>
				</div>
				<!-- letter spacing slider -->
				<input
					value={$currentAlert?.config.letterSpacing}
					on:change={(e) =>
						updateAlertConfig(
							"letterSpacing",
							e.currentTarget.value,
						)}
					type="range"
					id="letterspacing"
					name="letterspacing"
					min="-0.2"
					max="0.2"
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
						value={$currentAlert?.config.textColor}
						on:input={(e) =>
							updateAlertConfig(
								"textColor",
								e.currentTarget.value,
							)}
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
						value={$currentAlert?.config.highlightColor}
						on:input={(e) =>
							updateAlertConfig(
								"highlightColor",
								e.currentTarget.value,
							)}
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
					value={$currentAlert?.config.textTransform}
					on:change={(e) =>
						updateAlertConfig(
							"textTransform",
							e.currentTarget.value,
						)}
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

	.image-above-text {
		gap: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.image-above-text img {
		max-height: 200px;
	}

	/* Create a CSS class where the text is over the image */
	/* They are both in the middle */
	.text-over-image {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.text-over-image img {
		max-height: 100px;
		position: fixed;
		object-fit: fill;
		z-index: -1;
		margin: auto;
	}

	.image-left {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
	.image-left img {
		max-height: 10%;
	}

	.image-right {
		display: flex;
		flex-direction: row-reverse;
		gap: 1rem;
	}
	.image-right img {
		max-height: 10%;
	}
</style>
