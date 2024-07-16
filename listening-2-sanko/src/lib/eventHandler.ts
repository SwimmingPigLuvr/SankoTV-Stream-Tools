import { writable, get } from 'svelte/store';

export const currentGift = writable('');
export const sender = writable('');
export const giftName = writable('');
export const quantity = writable(0);
export const showNotification = writable(false);
export const allowNotificationSound = writable(true);

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

export interface Donation {
    id: string;
    sender: string;
    giftName: string;
    quantity: number;
    timestamp: number;
}

export const currentDonations = writable<Donation[]>([]);

function addDonation(donation: Donation) {
    currentDonations.update(donations => {
        donations.push(donation);
        return donations;
    });

    setTimeout(() => {
        currentDonations.update(donations => donations.filter(d => d.id !== donations.id));
    }, 10000);
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
                const donation: Donation = {
                    id: Math.random().toString(36).substr(2, 9),
                    sender: attributes.name,
                    giftName: attributes.giftName,
                    quntity: parseInt(attributes.quantity, 10),
                    timestamp: Date.now()
                };
                addDonation(donation);
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

    const donation: Donation = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "testuser",
        giftName: randomGift,
        quantity: Math.floor(Math.random() * 5) + 1,
        timestamp: Date.now()
    };
    addDonation(donation);
    console.log(`received donation ${donation.id}`);
}
