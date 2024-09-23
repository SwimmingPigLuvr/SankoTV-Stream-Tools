// libs/stores/alertConfigStore.ts
import { writable } from 'svelte/store';
import { type MediaItem } from '../media-options';

function createCurrentAlertStore() {
    const { subscribe, set, update } = writable<Alert | null>(null);

    return {
        subscribe, set, update, reset: () => set(null)
    };
}

export interface Alert {
    id: string;
    name: string;
    config: AlertConfig;
    isActive: boolean;
}

export type EventTrigger = 
    "donation" 
    | "specificgift" 
    | "atleast"
    | "exactamount"
    | "topdonation"
;

export interface DonationEvent {
    type: string;
    attributes: {
        giftName: string;
        name: string;
        quantity: string;
    };
}


export interface AnimationSettings {
    type: string;
    duration: number;
    delay: number;
    easing: string;
    amount?: number;
    opacity?: number;
    x?: number;
    y?: number;
    start?: number;
    axis?: 'x' | 'y';
}

export type Gift = keyof typeof gifts;

// name and $DMT value
export const gifts: { [key: string]: number } = {
    "Golden Glizzy": 3,
    "Glock": 0.5,
    "Diamond": 0.5,
    "Steroids": 0.5,
    "Trump": 0.5,
    "O'Hearn": 0.5,
    "Cross": 0.15,
    "Size Chad": 0.15,
    "Boxing Gloves": 0.15,
    "Grippy": 0.15,
    "Yellow Hat": 0.15,
    "Liquidation": 0.15,
    "Dubya": 0.1,
    "Su Zhu": 0.1,
    "Wizzy": 0.1,
    "Orbs": 0.1,
    "Cocktail": 0.1,
    "Teddy": 0.1,
    "Larry": 0.1,
    "Addys": 0.05,
    "Beer": 0.05,
    "Banana": 0.05,
    "Baby Bottle": 0.05,
    "Kitten": 0.05,
    "Femboy": 0.05,
    "Dead Dev": 0.05,
    "Daisy": 0.02,
    "Cash": 0.02,
    "Chili": 0.02,
    "Glizzy": 0.02,
    "Crack": 0.02,
    "Bunny": 0.02,
    "Mimosa": 0.02,
    "Rug": 0.02,
    "Cigarette": 0.01,
    "Gensler": 0.01,
    "Bitboy": 0.01,
    "Clover": 0.01,
    "Bible": 0.01,
    "Head Phones": 0.01,
    "Zyn": 0.01,
} as const;

export interface GiftEvent {
    type: "GIFT";
    attributes: {
        giftName: string;
        quantity: string;
        name: string;
        alertId: string;
    };
    alertId?: string;
    isTest?: boolean;
    donationAmount?: number;
}


export interface AlertConfig {
    animation: {
        in: AnimationSettings;
        out: AnimationSettings;
    }
    alertDuration: number;
    alertVolume: number;
    animationIn: string;
    animationOut: string;
    textAnimation: string;
    composition: string;
    borderRadius: string;
    eventTrigger: EventTrigger,
    specificGift?: Gift,
    specificAmount?: number;
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    textColor: string;
    highlightColor: string;
    textTransform: string;
    letterSpacing: string;
    textShadow: string;
    media: MediaItem | null;
    videoDuration: 'once' | 'match' | 'loop';
    notificationSound: MediaItem | null;
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
    fontWeight: 400,
    textColor: "",
    highlightColor: "#32CD32",
    textTransform: "uppercase",
    letterSpacing: "-0.05em",
    textShadow: "none",
    media: null,
    notificationSound: null,
    messageTemplate: '{sender} donated {amount} {gift}!',
    animationSettings: {
        in: {
            type: "fly",
            duration: 500,
            delay: 0,
            easing: "cubicOut",
            y: 100,  // for "fly in up"
            opacity: 0,  // start fully transparent
        },
        out: {
            type: "fade",
            duration: 300,
            delay: 0,
            easing: "linear",
            opacity: 0,  // end fully transparent
        }
    }
};

// Premade animation objects
export const premadeAnimations = {
    in: [
        {
            name: "Blur In",
            config: {
                type: "blur",
                duration: 500,
                delay: 0,
                easing: "cubicOut",
                amount: 5,
                opacity: 0,
            }
        },
        {
            name: "Fade In",
            config: {
                type: "fade",
                duration: 500,
                delay: 0,
                easing: "cubicOut",
                opacity: 0,
            }
        },
        {
            name: "Fly In Up",
            config: {
                type: "fly",
                duration: 500,
                delay: 0,
                easing: "cubicOut",
                y: 100,
                opacity: 0,
            }
        },
        {
            name: "Fly In Down",
            config: {
                type: "fly",
                duration: 500,
                delay: 0,
                easing: "cubicOut",
                y: -100,
                opacity: 0,
            }
        },
        {
            name: "Scale In",
            config: {
                type: "scale",
                duration: 500,
                delay: 0,
                easing: "cubicOut",
                start: 0.5,
                opacity: 0,
            }
        },
        {
            name: "Slide In Up",
            config: {
                type: "slide",
                duration: 500,
                delay: 0,
                easing: "cubicOut",
                y: 100,
            }
        },
        {
            name: "Slide In Down",
            config: {
                type: "slide",
                duration: 500,
                delay: 0,
                easing: "cubicOut",
                y: -100,
            }
        }
    ],
    out: [
        {
            name: "Blur Out",
            config: {
                type: "blur",
                duration: 300,
                delay: 0,
                easing: "cubicIn",
                amount: 5,
                opacity: 0,
            }
        },
        {
            name: "Fade Out",
            config: {
                type: "fade",
                duration: 300,
                delay: 0,
                easing: "cubicIn",
                opacity: 0,
            }
        },
        {
            name: "Fly Out Up",
            config: {
                type: "fly",
                duration: 300,
                delay: 0,
                easing: "cubicIn",
                y: -100,
                opacity: 0,
            }
        },
        {
            name: "Fly Out Down",
            config: {
                type: "fly",
                duration: 300,
                delay: 0,
                easing: "cubicIn",
                y: 100,
                opacity: 0,
            }
        },
        {
            name: "Scale Out",
            config: {
                type: "scale",
                duration: 300,
                delay: 0,
                easing: "cubicIn",
                start: 1,
                opacity: 0,
            }
        },
        {
            name: "Slide Out Up",
            config: {
                type: "slide",
                duration: 300,
                delay: 0,
                easing: "cubicIn",
                y: -100,
            }
        },
        {
            name: "Slide Out Down",
            config: {
                type: "slide",
                duration: 300,
                delay: 0,
                easing: "cubicIn",
                y: 100,
            }
        }
    ]
};

export const alertConfig = writable<AlertConfig>(defaultAlertConfig);
export const currentAlert = createCurrentAlertStore();
export const messageTemplate = writable<string>();


