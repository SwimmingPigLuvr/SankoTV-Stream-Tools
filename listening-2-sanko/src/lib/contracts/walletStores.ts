import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import { browser } from '$app/environment';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

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

    let web3Modal: Web3Modal;

    if (browser) {
        web3Modal = new Web3Modal({
            network: "custom",
            cacheProvider: true,
            providerOptions: {}
        });
    }

    return {
        subscribe,
        connect: async (): Promise<ConnectResult> => {
            if (!browser) {
                return { success: false, error: 'Not in browser environment' };
            }

            try {
                const instance = await web3Modal.connect();
                const provider = new ethers.providers.Web3Provider(instance);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                const network = await provider.getNetwork();

                // check if sankotestnet
                if (network.chainId !== SANKO_TESTNET.chainID) {
                    // request to switch network
                    try {
                        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.utils.hexValue(SANKO_TESTNET.chainId) }]);
                    } catch (switchError: any) {
                        // this error code indicates chain has not been added to metamask
                        if (switchError.code === 4902) {
                            try {
                                await provider.send('wallet_addEthereumChain', [SANKO_TESTNET]);
                            } catch (addError) {
                                throw new Error("failed to add Sanko Testnet to your wallet.");
                            }
                        } else {
                            throw new Error("failed to switch to the Sanko Testnet");
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
                instance.on("accountsChanged", (accounts: string[]) => {
                    if (accounts.length === 0) {
                        this.disconnect();
                    } else {
                        update(store => ({ ...store, address: accounts[0] }));
                    }
                });

                instance.on("chainChanged", (chainId: number) => {
                    if (chainId !== SANKO_TESTNET.chainId) {
                        this.disconnect();
                    } else {
                        update(store => ({ ...store, chainId }));
                    }
                });

                return { success: true };
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                return { success: false, error: error instanceof Error ? error.message : String(error) };
            }
        },
        disconnect: async () => {
            if (browser && web3Modal) {
                web3Modal.clearCachedProvider();
            }
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
