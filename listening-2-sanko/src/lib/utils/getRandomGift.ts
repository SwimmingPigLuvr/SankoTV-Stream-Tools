import { type Gift, gifts } from '../stores/alertConfigStore.ts';

export function getRandomGift(): Gift {
    const giftKeys = Object.keys(gifts) as Gift[];
    const randomIndex = Math.floor(Math.random() * giftKeys.length);
    return giftKeys[randomIndex];
}
