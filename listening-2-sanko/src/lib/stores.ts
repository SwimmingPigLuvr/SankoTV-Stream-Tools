import { writable } from 'svelte/store';


export interface AlertConfig {
    alertDuration: number;
    alertVolume: number;
    borderRadius: string;
    eventTrigger: string,
    specificAmount: number;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    textColor: string;
    highlightColor: string;
    textTransform: string;
    letterSpacing: string;
    textShadow: string;
}

const defaultAlertConfig: AlertConfig = {
    alertDuration: 8, // 8s
    alertVolume: 50, // 50%
    borderRadius: "0px",
    eventTrigger: "donation",
    specificAmount: 5,
    fontFamily: "sans-serif",
    fontSize: "1rem",
    fontWeight: "900",
    textColor: "#32CD32",
    highlightColor: "#000000",
    textTransform: "lowercase",
    letterSpacing: "-0.05em",
    textShadow: "none",
};

export const alertConfig = writable<DonationStyle>(defaultAlertConfig);

export const messageTemplate = writable<string>('{sender} donated {amount} {gift}!');
