<script lang="ts">
    import { ethers } from "ethers";
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabaseClient";

    let isConnected = false;
    let address: string | null = null;
    let error: string | null = null;

    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
            try {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum,
                );
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                address = await signer.getAddress();

                // Sign message
                const message = `Sign this message to prove you own the address ${address}. Nonce: ${Date.now()}`;
                const signature = await signer.signMessage(message);

                // Send to backend for verification and token generation
                const response = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ address, message, signature }),
                });

                if (response.ok) {
                    const { token } = await response.json();

                    // Set Supabase session
                    await supabase.auth.setSession(token);

                    isConnected = true;
                } else {
                    throw new Error("Failed to authenticate");
                }
            } catch (err) {
                error = err.message;
            }
        } else {
            error = "Please install MetaMask!";
        }
    }

    function disconnect() {
        supabase.auth.signOut();
        isConnected = false;
        address = null;
    }

    onMount(async () => {
        const session = await supabase.auth.getSession();
        if (session) {
            isConnected = true;
            address = session.user.id; // Assuming user.id is the wallet address
        }
    });
</script>

{#if isConnected}
    <p>Connected: {address}</p>
    <button on:click={disconnect}>Disconnect</button>
{:else}
    <button on:click={connectWallet}>Connect Wallet</button>
{/if}

{#if error}
    <p style="color: red;">{error}</p>
{/if}
