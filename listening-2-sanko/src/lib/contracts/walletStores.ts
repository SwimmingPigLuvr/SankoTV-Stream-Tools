import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import { browser } from '$app/environment';

interface WalletStore {
    provider: ethers.providers.Web3Provider | null;
    signer: ethers.Signer | null;
    address: string | null;
    chainId: number | null;
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

                // Check if we're on the correct network
                if (network.chainId !== SANKO_TESTNET.chainId) {
                    // Request network switch
                    try {
                        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.utils.hexValue(SANKO_TESTNET.chainId) }]);
                    } catch (switchError: any) {
                        // This error code indicates that the chain has not been added to MetaMask.
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

                update(store => ({ 
                    ...store, 
                    provider, 
                    signer, 
                    address, 
                    chainId: SANKO_TESTNET.chainId 
                }));

                // Setup listeners
                window.ethereum.on("accountsChanged", (accounts: string[]) => {
                    if (accounts.length === 0) {
                        this.disconnect();
                    } else {
                        update(store => ({ ...store, address: accounts[0] }));
                    }
                });

                window.ethereum.on("chainChanged", (chainId: string) => {
                    const newChainId = parseInt(chainId, 16);
                    if (newChainId !== SANKO_TESTNET.chainId) {
                        this.disconnect();
                    } else {
                        update(store => ({ ...store, chainId: newChainId }));
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
