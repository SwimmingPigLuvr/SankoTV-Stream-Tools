// lib/stores/userDataStore.ts
import { writable, get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { user } from './authStore';
import { alertConfig, type AlertConfig } from '$lib/stores/alertConfigStore';

interface Alert {
    id: string;
    name: string;
    config: AlertConfig;
}

interface UserData {
    id: string;
    username: string | null;
    wallet_address: string | null;
    data: {
        donationAlerts: Alert[];
    };
    created_at: string;
    updated_at: string;
}

function createUserDataStore() {
    const { subscribe, set, update } = writable<UserData | null>(null);

    return {
        subscribe,
        set,
        async fetch() {
            const currentUser = get(user);
            if (!currentUser) {
                console.log("No user logged in");
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();
                if (error) throw error;
                // deduplicate donation alerts
                if (data && data.data && Array.isArray(data.data.donationAlerts)) {
                    data.data.donationAlerts = Array.from(
                        new Map(data.data.donationAlerts.map(alert => [alert.id, alert])).values()
                    );
                }
                set(data as UserData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                set(null);
            }
        },
        async updateUserData(updates: Partial<UserData>) {
            const currentUser = get(user);
            if (!currentUser) {
                console.log("No user logged in");
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('users')
                    .update(updates)
                    .eq('id', currentUser.id)
                    .single();
                if (error) throw error;
                if (data) {
                    update(currentData => {
                        if (currentData) {
                            return { ...currentData, ...data } as UserData
                        } else {
                            return data as UserData;
                        }
                    });
                }
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        },
        async updateDataField(key: string, value: any) {
            const currentUser = get(user);
            if (!currentUser) {
                console.log("No user logged in");
                return;
            }
            try {
                const currentData = get(this);
                if (!currentData) throw new Error("no current user data");

                let updatedValue = value;

                // ensure not duplicate
                if (key === 'donationAlerts' && Array.isArray(value)) {
                    const uniqueAlerts = Array.from(new Map(value.map(alert => [alert.id, alert])).values());
                    updatedValue = uniqueAlerts;
                }

                const updatedData = {
                    ...currentData.data,
                    [key]: updatedValue
                };
                const { data, error } = await supabase
                    .from('users')
                    .update({ data: updatedData })
                    .eq('id', currentUser.id)
                    .single();
                if (error) throw error;
                if (data) {
                    this.set({ ...currentData, data: updatedData });
                }
            } catch (error) {
                console.error('Error updating data field:', error);
            }
        },
        // New methods for managing donation alerts
        async addDonationAlert(newAlert: Alert) {
            const currentData = get(this);
            if (!currentData) throw new Error("No current user data");
            const updatedAlerts = [...currentData.data.donationAlerts, newAlert];
            await this.updateDataField('donationAlerts', updatedAlerts);
        },
        async removeDonationAlert(id: string) {
            const currentData = get(this);
            if (!currentData) throw new Error("No current user data");
            const updatedAlerts = currentData.data.donationAlerts.filter(alert => alert.id !== id);
            await this.updateDataField('donationAlerts', updatedAlerts);
        },
        async updateDonationAlert(updatedAlert: Alert) {
            const currentData = get(this);
            if (!currentData) throw new Error("No current user data");
            const updatedAlerts = currentData.data.donationAlerts.map(alert => 
                alert.id === updatedAlert.id ? updatedAlert : alert
            );
            await this.updateDataField('donationAlerts', updatedAlerts);
        }
    };
}

export const userData = createUserDataStore();

// Subscribe to auth changes to fetch user data when logged in
user.subscribe(($user) => {
    if ($user) {
        userData.fetch();
    } else {
        userData.set(null);
    }
});
