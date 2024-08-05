import { writable } from 'svelte/store';
import type { AlertConfig } from './alertConfigStore.ts';

export interface Alert {
    id: string;
    name: string;
    config: AlertConfig;
}

function createCurrentAlertStore() {
    const { subscribe, set, update } = writable<Alert | null>(null);

    return {
        subscribe, set, update, reset: () => set(null)
    };
}

export const currentAlert = createCurrentAlertStore();
