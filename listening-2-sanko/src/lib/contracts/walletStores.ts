import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import type { AuthContract } from './AuthContract';
import { AUTH_CONTRACT_ABI, AUTH_CONTRACT_ADDRESS } from './AuthContract';
import { browser } from '$app/environment';

interface WalletStore {
    provider: ethers.providers.Web3Provider | null;
    signer: ethers.Signer | null;
    address: string | null;
    isAuthenticated: boolean;
    authContract: AuthContract | null;
}

function createWalletStore() {
    const { subscribe, set, update } = writable<WalletStore>({
        provider: null,
        signer: null,
        address: null,
        isAuthenticated: false,
        authContract: null,
    });

    return {
        subscribe,
        connect: async () => {
            if (browser && typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                const authContract = new ethers.Contract(AUTH_CONTRACT_ADDRESS, AUTH_CONTRACT_ABI, signer) as AuthContract;
                update(store => ({ ...store, provider, signer, address, authContract }));
            } else {
                throw new Error('No Ethereum wallet found');
            }
        },
        authenticate: async () => {
            update(async (store) => {
                if (store.authContract && store.address) {
                    try {
                        const tx = await store.authContract.authenticate();
                        await tx.wait();
                        const isAuthenticated = await store.authContract.isAuthenticated(store.address);
                        return { ...store, isAuthenticated };
                    } catch (error) {
                        console.error('Authentication failed: ', error);
                        throw error;
                    }
                }
                return store;
            });
        },
        checkAuthentication: async () => {
            update(async (store) => {
                if (store.authContract && store.address) {
                    const isAuthenticated = await store.authContract.isAuthenticated(store.address);
                    return { ...store, isAuthenticated };
                }
                return store;
            });
        },
        checkConnection: async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    const authContract = new ethers.Contract(AUTH_CONTRACT_ADDRESS, AUTH_CONTRACT_ABI, signer) as AuthContract;
                    const isAuthenticated = await authContract.isAuthenticated(address);
                    update(store => ({ ...store, provider, signer, address, authContract, isAuthenticated }));
                }
            }
        },
        disconnect: async () => {
            set({
                provider: null,
                signer: null,
                address: null,
                isAuthenticated: false,
                authContract: null,
            });
        }
    };
}

export const walletStore = createWalletStore();
