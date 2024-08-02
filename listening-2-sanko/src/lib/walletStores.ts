// lib/walletStores.ts
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

const SANKO_MAINNET = {
    chainId: 1996,
    chainName: "Sanko",
    nativeCurrency: {
        name: "DMT",
        symbol: "tDMT",
        decimals: 18
    },
    rpcUrls: ["https://mainnet.sanko.xyz"],
    blockExplorerUrls: ["https://explorer.sanko.xyz/"]
};

function createWalletStore() {
    const { subscribe, set, update } = writable<WalletStore>({
        provider: null,
        signer: null,
        address: null,
        chainId: null,
    });

    return {
        subscribe,
        connect: async (): Promise<ConnectResult> => {
            if (!browser || typeof window.ethereum === 'undefined') {
                return { success: false, error: 'No Ethereum wallet found. Please install MetaMask.' };
            }

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                const network = await provider.getNetwork();

                if (network.chainId !== SANKO_TESTNET.chainId) {
                    try {
                        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.utils.hexValue(SANKO_TESTNET.chainId) }]);
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

                // Update Supabase user data with wallet address
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('users').upsert({
                        id: user.id,
                        wallet_address: address.toLowerCase(),
                    });
                }

                update(store => ({ 
                    ...store, 
                    provider, 
                    signer, 
                    address, 
                    chainId: SANKO_TESTNET.chainId,
                }));

                // Setup listeners
                window.ethereum.removeAllListeners();
                window.ethereum.on("accountsChanged", (accounts: string[]) => {
                    if (accounts.length === 0) {
                        this.disconnect();
                    } else {
                        this.connect();
                    }
                });

                window.ethereum.on("chainChanged", (chainId: string) => {
                    const newChainId = parseInt(chainId, 16);
                    if (newChainId !== SANKO_TESTNET.chainId) {
                        this.disconnect();
                    } else {
                        this.connect();
                    }
                });

                return { success: true };
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                return { success: false, error: error instanceof Error ? error.message : String(error) };
            }
        },
        disconnect: () => {
            set({
                provider: null,
                signer: null,
                address: null,
                chainId: null,
            });
        }
    };
}

export const walletStore = createWalletStore();
