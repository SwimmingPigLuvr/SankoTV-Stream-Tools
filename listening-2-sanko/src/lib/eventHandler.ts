import { writable, get } from 'svelte/store';

export const currentGift = writable('');
export const sender = writable('');
export const giftName = writable('');
export const quantity = writable(0);
export const showNotification = writable(false);

interface GiftEvent {
	event: string;
	data: {
		event: {
			attributes: {
				name: string;
				giftName: string;
				quantity: string;
			};
		};
	};
}

export function setupEventSource() {
    const eventSource = new EventSource("/api/trigger-gift-animation");

    eventSource.onmessage = async (event) => {
        console.log("raw event data", event.data);
        try {
            const cleanedData = event.data.replace(/}[^}]*$/, "}");
            const data: GiftEvent = JSON.parse(cleanedData);
            console.log("parsed animation data:", data);

            if (data.event === "GIFT") {
                const attributes = data.data.event.attributes;
                sender.set(attributes.name);
                giftName.set(attributes.giftName);
                quantity.set(parseInt(attributes.quantity, 10));
                currentGift.set(attributes.giftName.toLowerCase());
                showNotification.set(true);

                // Hide notification after 5 seconds
                setTimeout(() => {
                    showNotification.set(false);
                }, 10000);
            }
        } catch (error) {
            console.error("error parsing event data:", error);
        }
    };

    eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        setTimeout(() => {
            console.log("attempting to reconnect...");
            setupEventSource();
        }, 5000);
    };

    return eventSource;
}

export function testDonation() {
    const gifts = ["zyn", "trump", "addys"];
    const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
    sender.set("TestUser");
    giftName.set(randomGift);
    quantity.set(Math.floor(Math.random() * 5) + 1);
    currentGift.set(randomGift);
    showNotification.set(true);

    console.log(`Test donation triggered for ${randomGift}`);
    console.log(`Sender: ${get(sender)}, Gift: ${get(giftName)}, Quantity: ${get(quantity)}, show notification? ${get(showNotification)}`);

    // Hide notification after 5 seconds
    setTimeout(() => {
        showNotification.set(false);
        console.log(`notification hidden, show notification: ${get(showNotification)}`);
    }, 5000);
}
