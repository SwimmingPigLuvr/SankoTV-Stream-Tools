import { writable } from 'svelte/store';

export const isDarkMode = writable<boolean>(true);

export let isMobile = writable<boolean>(false);
export let showDirectory = writable<boolean>(false);




export interface AlertConfig {
    alertDuration: number;
    alertVolume: number;
    animationIn: string;
    animationOut: string;
    textAnimation: string;
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
    animationIn: "fly in up",
    animationOut: "fade out",
    textAnimation: "bounce",
    borderRadius: "0px",
    eventTrigger: "donation",
    specificAmount: 5,
    fontFamily: "coolfont-trippy",
    fontSize: "32px",
    fontWeight: "400",
    textColor: "#FFFFFF",
    highlightColor: "#32CD32",
    textTransform: "uppercase",
    letterSpacing: "-0.05em",
    textShadow: "none",
};

export const alertConfig = writable<AlertConfig>(defaultAlertConfig);

export const messageTemplate = writable<string>('{sender} donated {amount} {gift}!');
