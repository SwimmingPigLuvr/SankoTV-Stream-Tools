import { type Gift, gifts } from '../stores/alertConfigStore.ts';

export function isValidGift(giftName: any): giftName is Gift {
    return typeof giftName === 'string' && giftName in gifts;
}
