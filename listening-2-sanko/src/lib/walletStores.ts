import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { supabase } from '$lib/supabaseClient';

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

function createWalletStore() {
    const { subscribe, set, update } = writable<WalletStore>({
        provider: null,
        signer: null,
        address: null,
        chainId: null,
        userData: null,
    });

    async function authenticateWallet(provider: ethers.providers.Web3Provider, address: string): Promise<boolean> {
        console.log('Authenticating wallet');
        
        const nonce = Math.floor(Math.random() * 1000000).toString();
        const message = `sign to login to StarLabs\nAddress: ${address}\nNonce: ${nonce}`;
        
        const signer = provider.getSigner();
        const signature = await signer.signMessage(message);
        
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            throw new Error('Signature verification failed');
        }
        
        console.log('Wallet authenticated successfully');
        return true;
    }

    async function handleUserData(address: string): Promise<any> {
    console.log('handleUserData called with address:', address);
    
    try {
        // Attempt to select the user
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', address.toLowerCase())
            .single();

        // If there's an error but it's not a "not found" error, throw it
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user:', error);
            throw error;
        }

        if (!user) {
            // User not found, attempt to create a new one
            console.log('User not found. Attempting to create new user');
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([
                    { 
                        wallet_address: address.toLowerCase(),
                        created_at: new Date().toISOString(),
                        last_connected: new Date().toISOString()
                    }
                ])
                .single();

            if (insertError) {
                // If we get a duplicate key error, the user was likely created in a race condition
                // Try to fetch the user again
                if (insertError.code === '23505') {
                    console.log('User already exists. Fetching existing user.');
                    const { data: existingUser, error: fetchError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('wallet_address', address.toLowerCase())
                        .single();

                    if (fetchError) {
                        console.error('Error fetching existing user:', fetchError);
                        throw fetchError;
                    }

                    user = existingUser;
                } else {
                    console.error('Error creating new user:', insertError);
                    throw insertError;
                }
            } else {
                console.log('New user created:', newUser);
                user = newUser;
            }
        }

        // User exists (either found initially or after insert attempt), update last_connected
        console.log('Updating existing user');
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ last_connected: new Date().toISOString() })
            .eq('wallet_address', address.toLowerCase())
            .single();

        if (updateError) {
            console.error('Error updating user:', updateError);
            throw updateError;
        }

        console.log('User updated:', updatedUser);
        user = updatedUser;

        console.log('Returning user data:', user);
        return user;
    } catch (error) {
        console.error('Error in handleUserData:', error);
        throw error;
    }
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
                    try {
                        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.utils.hexValue(SANKO_TESTNET.chainId) }]);
                        console.log('Successfully switched to Sanko Testnet');
                    } catch (switchError: any) {
                        if (switchError.code === 4902) {
                            try {
                                await provider.send('wallet_addEthereumChain', [SANKO_TESTNET]);
                            } catch (addError) {
                                throw new Error("Failed to add the Sanko Testnet to your wallet.");
                            }
                        } else {
                            throw new Error("Failed to switch to the Sanko Testnet.");
                        }
                    }
                }

                // Authenticate wallet
                await authenticateWallet(provider, address);

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
                        console.log('New account detected. Re-authenticating and updating user data.');
                        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                        await authenticateWallet(newProvider, accounts[0]);
                        const userData = await handleUserData(accounts[0]);
                        update(store => ({ 
                            ...store, 
                            provider: newProvider, 
                            signer: newProvider.getSigner(), 
                            address: accounts[0], 
                            userData 
                        }));
                    }
                });

                window.ethereum.on("chainChanged", async (chainId: string) => {
                    console.log('Chain changed. New chainId:', chainId);
                    const newChainId = parseInt(chainId, 16);
                    if (newChainId !== SANKO_TESTNET.chainId) {
                        console.log('Incorrect chain. Disconnecting.');
                        this.disconnect();
                    } else {
                        console.log('Correct chain. Re-authenticating and updating store.');
                        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                        const newAddress = await newProvider.getSigner().getAddress();
                        await authenticateWallet(newProvider, newAddress);
                        const userData = await handleUserData(newAddress);
                        update(store => ({ 
                            ...store, 
                            provider: newProvider, 
                            signer: newProvider.getSigner(), 
                            address: newAddress, 
                            chainId: newChainId,
                            userData 
                        }));
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
