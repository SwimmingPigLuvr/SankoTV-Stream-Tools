import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { supabase } from '$lib/supabaseClient';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from '$env/static/private'

const { sign } = jwt;

const secret = JWT_TOKEN;

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
        const token = sign({ sub: address.toLowerCase() }, secret, { expiresIn: '1d'});
        return token;
    }

    //
    async function handleUserData(address: string): Promise<any> {
       console.log('handleUserData called with address:', address);
       
       try {
           const now = new Date().toISOString();
            const token = await authenticateWallet(provider, address);

            // set the JWT in the supabase client
            supabase.auth.setAuth(token);

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
