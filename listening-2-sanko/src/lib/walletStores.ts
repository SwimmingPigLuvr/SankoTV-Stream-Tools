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

    async function authenticateWallet(provider: ethers.providers.Web3Provider, address: string): Promise<string> {
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

        // generate jwt
        const response = await fetch('/api/auth/jwt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('server response:', response.status, errorText);
            throw new Error(`Failed to generate JWT: ${errorText || 'Unknown error'}`);
        }

        const { token } = await response.json();
        return token;
    }

    //
    async function handleUserData(provider: ethers.providers.Web3Provider, address: string): Promise<any> {
       console.log('handleUserData called with address:', address);
       
       try {
           const now = new Date().toISOString();
            const token = await authenticateWallet(provider, address);

           const { data: user, error } = await supabase
               .from('users')
               .upsert(
                   { 
                       wallet_address: address.toLowerCase(),
                       created_at: now,
                       updated_at: now,
                       data: {},
                       last_connected: now
                   },
                   { 
                       onConflict: 'wallet_address',
                       update: { last_connected: now, updated_at: now }
                   }
               )
               .select()
               .single();

           console.log('Upsert result:', { data: user, error });

           if (error) {
               console.error('Error upserting user:', error);
               console.error('Error details:', JSON.stringify(error, null, 2));
               throw error;
           }

           if (!user) {
               throw new Error('Failed to create or fetch user');
           }

           console.log('Returning user data:', user);
           return user;
       } catch (error) {
           console.error('Error in handleUserData:', error);
           console.error('Error details:', JSON.stringify(error, null, 2));
           throw error;
       }
   }
        // end handleuserdata


    return {
        subscribe,
        checkConnection: async (): Promise<boolean> => {
            if (!browser || typeof window.ethereum === 'undefined') {
                return false;
            }

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                
                if (accounts.length > 0) {
                    const address = accounts[0];
                    const network = await provider.getNetwork();

                    if (network.chainId === SANKO_TESTNET.chainId) {
                        // User is connected and on the correct network
                        const userData = await handleUserData(provider, address);
                        update(store => ({
                            ...store,
                            provider,
                            signer: provider.getSigner(),
                            address,
                            chainId: network.chainId,
                            userData
                        }));
                        return true;
                    }
                }
            } catch (error) {
                console.error('Error checking connection:', error);
            }

            return false;
        },
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
                const token = await authenticateWallet(provider, address);

                // Handle user data in Supabase
                console.log('Handling user data');
                const userData = await handleUserData(provider, address);

                // Set the session in Supabase
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token: token,
                    refresh_token: token, // Adjust if your JWT structure is different
                });

                if (sessionError) {
                    console.error('Error setting Supabase session:', sessionError);
                    throw sessionError;
                }

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
                window.ethereum.removeAllListeners(); // Remove any existing listeners to avoid duplicates

                window.ethereum.on("accountsChanged", async (accounts: string[]) => {
                    console.log('Accounts changed:', accounts);
                    if (accounts.length === 0) {
                        console.log('No accounts. Disconnecting.');
                        this.disconnect();
                    } else {
                        console.log('New account detected. Re-authenticating and updating user data.');
                        await this.connect(); // Re-run the connect process
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
                        await this.connect(); // Re-run the connect process
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
