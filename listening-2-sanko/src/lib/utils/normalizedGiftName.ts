import { type Gift, gifts } from '../stores/alertConfigStore';

export function normalizeGiftName(giftName: Gift): Gift | undefined {
    const normalized = giftName
        .trim()
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");

    if (normalized in gifts) {
        return normalized as Gift;
    }

    console.warn(`Gift name "${giftName}" does not match any known gifts.`);
    return undefined;
}
