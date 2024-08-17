// libs/stores/alertConfigStore.ts
import { writable } from 'svelte/store'

export interface Alert {
    id: string;
    name: string;
    config: AlertConfig;
    isActive: boolean;
}

function createCurrentAlertStore() {
    const { subscribe, set, update } = writable<Alert | null>(null);

    return {
        subscribe, set, update, reset: () => set(null)
    };
}

export interface AlertConfig {
    alertDuration: number;
    alertVolume: number;
    animationIn: string;
    animationOut: string;
    textAnimation: string;
    composition: string;
    borderRadius: string;
    eventTrigger: string,
    specificGift: string,
    specificAmount: number;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    textColor: string;
    highlightColor: string;
    textTransform: string;
    letterSpacing: string;
    textShadow: string;
    mediaSrc: string | null;
    audioSrc: string | null;
    messageTemplate: string;
}

const defaultAlertConfig: AlertConfig = {
    alertDuration: 8, // 8s
    alertVolume: 50, // 50%
    animationIn: "fly in up",
    animationOut: "fade out",
    textAnimation: "bounce",
    composition: "image-above-text",
    borderRadius: "0px",
    eventTrigger: "donation",
    specificGift: "zyn",
    specificAmount: 5,
    fontFamily: "coolfont-trippy",
    fontSize: "32px",
    fontWeight: "400",
    textColor: "",
    highlightColor: "#32CD32",
    textTransform: "uppercase",
    letterSpacing: "-0.05em",
    textShadow: "none",
    mediaSrc: null,
    audioSrc: null,
    messageTemplate: '{sender} donated {amount} {gift}!',
};

export const alertConfig = writable<AlertConfig>(defaultAlertConfig);
export const currentAlert = createCurrentAlertStore();
export const messageTemplate = writable<string>();
