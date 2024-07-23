<script lang="ts">
	import { onMount } from "svelte";
	import { walletStore } from "$lib/contracts/walletStores";
	import { AuthService } from "$lib/services/AuthService";
	import { goto } from "$app/navigation";

	let authService: AuthService;
	let isAuthenticated = false;
	let isConnecting = false;
	let isAuthenticating = false;

	onMount(() => {
		walletStore.subscribe(({ signer, address }) => {
			if (signer && address) {
				authService = new AuthService(signer);
				checkAuthentication(address);
			}
		});
		checkConnection();
	});

	async function checkConnection() {
		await walletStore.checkConnection();
	}

	async function checkAuthentication(address: string) {
		isAuthenticated = await authService.isAuthenticated(address);
		if (isAuthenticated) {
			// Redirect to dashboard or fetch user data
			goto("/dashboard");
		}
	}

	async function handleConnect() {
		isConnecting = true;
		try {
			await walletStore.connect();
		} catch (error) {
			console.error("Failed to connect wallet:", error);
		} finally {
			isConnecting = false;
		}
	}

	async function handleAuthenticate() {
		isAuthenticating = true;
		try {
			const success = await authService.authenticate();
			if (success) {
				isAuthenticated = true;
				// Redirect to dashboard or fetch user data
				goto("/dashboard");
			}
		} catch (error) {
			console.error("Authentication failed:", error);
		} finally {
			isAuthenticating = false;
		}
	}
</script>

<main>
	<div class="text-white items-center p-8 w-full h-screen flex flex-col">
		<h1 class="font-sans text-5xl flex space-x-1">
			<span class="text-red-600">S</span>
			<span class="text-blue-600">A</span>
			<span class="text-lime-600">N</span>
			<span class="text-yellow-600">K</span>
			<span class="text-white-600">O</span>
			<span class="text-lime-400">.tv</span>
		</h1>
		<h2 class="">CHAT TOOLS</h2>

		<!-- Wallet Connection and Authentication -->
		<div class="m-4">
			{#if $walletStore.address}
				{#if isAuthenticated}
					<p class="text-green-500">You're authenticated!</p>
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
					class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					on:click={handleConnect}
					disabled={isConnecting}
				>
					{isConnecting ? "Connecting..." : "Connect Wallet"}
				</button>
			{/if}
		</div>

		<!-- links -->
		<div class="m-auto flex space-x-2">
			<a
				class="hover:bg-red-600 rounded border-white border-2 w-32 text-center h-10 items-center flex justify-center"
				href="/emotes">emotes</a
			>
			<a
				class="hover:bg-blue-600 rounded border-white border-2 w-32 text-center h-10 items-center flex justify-center"
				href="/donations">gifts</a
			>
			<a
				class="hover:bg-lime-600 rounded border-white border-2 w-32 text-center h-10 items-center flex justify-center"
				href="/text-to-speech">text to speech</a
			>
		</div>
		<p class="fixed bottom-2 text-xs">
			by <span class="text-sky-300">swimming</span> 🐷 ❤️r
		</p>
	</div>
</main>
