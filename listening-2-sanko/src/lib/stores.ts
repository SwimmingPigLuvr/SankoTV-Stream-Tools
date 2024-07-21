import { writable } from 'svelte/store';


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
    animationIn: "fade in",
    animationOut: "fade out",
    textAnimation: "bounce",
    borderRadius: "0px",
    eventTrigger: "donation",
    specificAmount: 5,
    fontFamily: "coolfont-pix-outlined",
    fontSize: "32px",
    fontWeight: "900",
    textColor: "#FFFFFF",
    highlightColor: "#32CD32",
    textTransform: "lowercase",
    letterSpacing: "-0.05em",
    textShadow: "none",
};

export const alertConfig = writable<DonationStyle>(defaultAlertConfig);

export const messageTemplate = writable<string>('{sender} donated {amount} {gift}!');
