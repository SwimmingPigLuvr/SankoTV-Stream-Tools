import { writable } from 'svelte/store';


export interface DonationStyle {
    alertDuration: string;
    borderRadius: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    textColor: string;
    highlightColor: string;
    textTransform: string;
    letterSpacing: string;
    textShadow: string;
}

const defaultDonationStyle: DonationStyle = {
    alertDuration: "8s",
    borderRadius: "0px",
    fontFamily: "sans-serif",
    fontSize: "1rem",
    fontWeight: "900",
    textColor: "#32CD32",
    highlightColor: "#000000",
    textTransform: "lowercase",
    letterSpacing: "-0.05em",
    textShadow: "none",
};

export const donationSettings = writable<DonationStyle>(defaultDonationStyle);

export const messageTemplate = writable<string>('{sender} donated {amount} {gift}!');
