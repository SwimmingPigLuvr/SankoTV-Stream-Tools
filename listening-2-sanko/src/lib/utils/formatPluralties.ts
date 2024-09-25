import type { Gift } from '../stores/alertConfigStore';

export function formatPluralities(amount: number, gift: Gift): string {
    const specialPlurals: Record<Gift, string> = {
        "Golden Glizzy": "Golden Glizzies",
        "Glock": "Glocks",
        "Diamond": "Diamonds",
        "Steroids": "Steroids",
        "Trump": "Trumps",
        "O'Hearn": "O'Hearns",
        "Cross": "Crosses",
        "Size Chad": "Size Chads",
        "Boxing Gloves": "Boxing Gloves",
        "Grippy": "Grippies",
        "Yellow Hat": "Yellow Hats",
        "Liquidation": "Liquidations",
        "Dubya": "Dubyas",
        "Su Zhu": "Su Zhus",
        "Wizzy": "Wizzies",
        "Orbs": "Orbs",
        "Cocktail": "Cocktails",
        "Teddy": "Teddies",
        "Larry": "Larrys",
        "Addys": "Addys",
        "Beer": "Beers",
        "Banana": "Bananas",
        "Baby Bottle": "Baby Bottles",
        "Kitten": "Kittens",
        "Femboy": "Femboys",
        "Dead Dev": "Dead Devs",
        "Daisy": "Daisies",
        "Cash": "Cash",
        "Chili": "Chilis",
        "Glizzy": "Glizzies",
        "Crack": "Cracks",
        "Bunny": "Bunnies",
        "Mimosa": "Mimosas",
        "Rug": "Rugs",
        "Cigarette": "Cigarettes",
        "Gensler": "Genslers",
        "Bitboy": "Bitboys",
        "Clover": "Clovers",
        "Bible": "Bibles",
        "Head Phones": "pairs of Head Phones",
        "Zyn": "Zyns",
    };

    if (amount === 1) {
        if (gift === "Head Phones") {
            return `1 pair of Head Phones`;
        }
        return `${gift}`;
    }

    if (specialPlurals[gift]) {
        return `${specialPlurals[gift]}`;
    }

    if (
        gift.endsWith("y") &&
        !gift.endsWith("ay") &&
        !gift.endsWith("ey") &&
        !gift.endsWith("oy") &&
        !gift.endsWith("uy")
    ) {
        return `${gift.slice(0, -1)}ies`;
    }

    return `${gift}s`;
}
