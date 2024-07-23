import { writable } from 'svelte/store';
import type { Web3Provider } from '@ethersproject/providers';

interface Web3ModalState {
  provider: Web3Provider | null;
  signer: any | null;
  address: string | null;
}

export const web3ModalStore = writable<Web3ModalState>({
  provider: null,
  signer: null,
  address: null,
});
