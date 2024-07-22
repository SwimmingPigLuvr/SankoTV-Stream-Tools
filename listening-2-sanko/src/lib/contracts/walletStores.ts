import { writable } from 'svelte/store';
import { ethers } from 'ethers';
import type { AuthContract } from './AuthContract.ts';
import { AUTH_CONTRACT_ABI, AUTH_CONTRACT_ADDRESS } from './AuthContract.ts';

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
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                const authContract = new ethers.Contract(AUTH_CONTRACT_ADDRESS, AUTH_CONTRACT_ABI, signer) as AuthContract;

                update(store => ({ ...store, provider, signer, address, authContract }));
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
                        console.error('authentication failed: ', error);
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
    };
}

export const walletStore = createWalletStore();
