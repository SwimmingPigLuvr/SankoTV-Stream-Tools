<script lang="ts">
	import { onMount } from "svelte";
	import { walletStore } from "$lib/contracts/walletStores";
	import { AuthService } from "$lib/services/AuthService";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";

	let authService: AuthService;
	let isAuthenticated = false;
	let isConnecting = false;
	let isAuthenticating = false;
	let error = "";

	onMount(() => {
		if (browser) {
			walletStore.subscribe(({ signer, address }) => {
				if (signer && address) {
					authService = new AuthService(signer);
					checkAuthentication(address);
				}
			});
			checkConnection();
		}
	});

	async function checkConnection() {
		try {
			await walletStore.checkConnection();
		} catch (err) {
			console.error("Failed to check connection:", err);
		}
	}

	async function checkAuthentication(address: string) {
		try {
			isAuthenticated = await authService.isAuthenticated(address);
			if (isAuthenticated) {
				// Redirect to dashboard or fetch user data
				goto("/dashboard");
			}
		} catch (err) {
			console.error("Failed to check authentication:", err);
			error = "Failed to check authentication. Please try again.";
		}
	}

	async function handleConnect() {
		isConnecting = true;
		error = "";
		try {
			await walletStore.connect();
		} catch (err) {
			console.error("Failed to connect wallet:", err);
			error =
				"Failed to connect wallet. Please make sure you have MetaMask installed and try again.";
		} finally {
			isConnecting = false;
		}
	}

	async function handleAuthenticate() {
		isAuthenticating = true;
		error = "";
		try {
			const success = await authService.authenticate();
			if (success) {
				isAuthenticated = true;
				// Redirect to dashboard or fetch user data
				goto("/dashboard");
			}
		} catch (err) {
			console.error("Authentication failed:", err);
			error = "Failed to authenticate. Please try again.";
		} finally {
			isAuthenticating = false;
		}
	}
</script>

<main>
	<div
		class="text-white items-center p-8 w-full h-screen flex flex-col justify-start"
	>
		<h1 class="font-coolfont items-baseline text-[9rem] flex -space-x-1">
			<span class="text-red-500">S</span>
			<span class="text-blue-500">A</span>
			<span class="text-lime-500">N</span>
			<span class="text-yellow-400">K</span>
			<span class="text-white">O</span>
			<span class="text-lime-400 font-coolfont-fluid text-[5rem]"
				>.tv</span
			>
		</h1>
		<div class="-translate-y-16 items-center flex flex-col">
			<h2 class="text-3xl tracking-widest font-coolfont-pixel">
				⭐️
				<span class="text-5xl">StarLabs</span>
				🧪
			</h2>
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://x.com/SwimmingPigLuvr"
				class="text-xs font-mono px-4 p-2 hover:bg-sky-800 rounded-xl"
			>
				by <span class="text-sky-300">Swimming</span> 𓃟 ❤️ 'r
			</a>
		</div>
		<!-- Wallet Connection and Authentication -->
		<div class="m-auto flex flex-col items-center">
			{#if $walletStore.address}
				{#if isAuthenticated}
					<p class="text-green-500">You're authenticated!</p>
					<a
						class="hover:bg-red-600 rounded border-white border-2 w-32 text-center h-10 items-center flex justify-center"
						href="/dashboard">dashboard</a
					>
				{:else}
					<p>
						Your wallet is connected, but you're not authenticated.
					</p>
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						on:click={handleAuthenticate}
						disabled={isAuthenticating}
					>
						{isAuthenticating
							? "Authenticating..."
							: "Authenticate"}
					</button>
				{/if}
			{:else}
				<button
					class="w-48 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded"
					on:click={handleConnect}
					disabled={isConnecting}
				>
					{isConnecting ? "Connecting..." : "Connect Wallet"}
				</button>
			{/if}
			{#if error}
				<p class="text-red-500 mt-2">{error}</p>
			{/if}
		</div>
	</div>
</main>
