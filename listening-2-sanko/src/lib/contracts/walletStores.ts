import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { supabase } from '$lib/supabaseClient';  // Ensure this path is correct

interface WalletStore {
    provider: ethers.providers.Web3Provider | null;
    signer: ethers.Signer | null;
    address: string | null;
    chainId: number | null;
    userData: any | null;
}

interface ConnectResult {
    success: boolean;
    error?: string;
}

const SANKO_TESTNET = {
    chainId: 1992,
    chainName: "Sanko Testnet",
    nativeCurrency: {
        name: "Test DMT",
        symbol: "tDMT",
        decimals: 18
    },
    rpcUrls: ["https://sanko-arb-sepolia.rpc.caldera.xyz/http"],
    blockExplorerUrls: ["https://testnet.sankoscan.io/"]
};

const SANKO = {
    chainId: 1996,
    chainName: "Sanko",
    nativeCurrency: {
        name: "DMT",
        symbol: "DMT",
        decimals: 18
    },
    rpcUrls: ["https://mainnet.sanko.xyz"],
    blockExplorerUrls: ["https://explorer.sanko.xyz/"]
}

function createWalletStore() {
    const { subscribe, set, update } = writable<WalletStore>({
        provider: null,
        signer: null,
        address: null,
        chainId: null,
        userData: null,
    });

    async function handleUserData(address: string) {
        console.log('handleUserData called with address:', address);
        
        // Check if user exists
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', address)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('User not found in database');
            } else {
                console.error('Error fetching user:', error);
            }
            return null;
        }

        if (!user) {
            console.log('Creating new user');
            // Create new user
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([
                    { 
                        wallet_address: address,
                        created_at: new Date().toISOString(),
                        last_connected: new Date().toISOString()
                    }
                ])
                .single();

            if (insertError) {
                console.error('Error creating new user:', insertError);
                return null;
            }

            console.log('New user created:', newUser);
            user = newUser;
        } else {
            console.log('Updating existing user');
            // Update last_connected
            const { error: updateError } = await supabase
                .from('users')
                .update({ last_connected: new Date().toISOString() })
                .eq('wallet_address', address);

            if (updateError) {
                console.error('Error updating last_connected:', updateError);
            } else {
                console.log('User last_connected updated');
            }
        }

        console.log('Returning user data:', user);
        return user;
    }

    return {
        subscribe,
        connect: async (): Promise<ConnectResult> => {
            console.log('Connect method called');
            if (!browser || typeof window.ethereum === 'undefined') {
                console.log('No Ethereum wallet found');
                return { success: false, error: 'No Ethereum wallet found. Please install MetaMask.' };
            }

            try {
                console.log('Attempting to connect to wallet');
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                const network = await provider.getNetwork();

                console.log('Connected to wallet. Address:', address, 'Network:', network);

                // Check if we're on the correct network
                if (network.chainId !== SANKO_TESTNET.chainId) {
                    console.log('Incorrect network. Attempting to switch');
                    // Request network switch
                    try {
                        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.utils.hexValue(SANKO_TESTNET.chainId) }]);
                        console.log('Successfully switched to Sanko Testnet');
                    } catch (switchError: any) {
                        console.error('Error switching network:', switchError);
                        // ... (rest of the network switching logic)
                    }
                }

                // Handle user data in Supabase
                console.log('Handling user data');
                const userData = await handleUserData(address);

                update(store => ({ 
                    ...store, 
                    provider, 
                    signer, 
                    address, 
                    chainId: SANKO_TESTNET.chainId,
                    userData
                }));
                console.log('Store updated with user data');

                // Setup listeners
                window.ethereum.on("accountsChanged", async (accounts: string[]) => {
                    console.log('Accounts changed:', accounts);
                    if (accounts.length === 0) {
                        console.log('No accounts. Disconnecting.');
                        this.disconnect();
                    } else {
                        console.log('New account detected. Updating user data.');
                        const userData = await handleUserData(accounts[0]);
                        update(store => ({ ...store, address: accounts[0], userData }));
                    }
                });

                window.ethereum.on("chainChanged", (chainId: string) => {
                    console.log('Chain changed. New chainId:', chainId);
                    const newChainId = parseInt(chainId, 16);
                    if (newChainId !== SANKO_TESTNET.chainId) {
                        console.log('Incorrect chain. Disconnecting.');
                        this.disconnect();
                    } else {
                        console.log('Correct chain. Updating store.');
                        update(store => ({ ...store, chainId: newChainId }));
                    }
                });

                console.log('Wallet connection successful');
                return { success: true };
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                return { success: false, error: error instanceof Error ? error.message : String(error) };
            }
        },
        disconnect: () => {
            console.log('Disconnecting wallet');
            set({
                provider: null,
                signer: null,
                address: null,
                chainId: null,
                userData: null,
            });
            console.log('Wallet disconnected. Redirecting to home.');
            goto('/');
        }
    };
}

export const walletStore = createWalletStore();
