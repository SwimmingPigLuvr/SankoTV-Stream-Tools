// lib/stores/userDataStore.ts
import { writable, get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { user } from './authStore';
import { alertConfig, type AlertConfig } from '$lib/stores/alertConfigStore';

interface UserData {
    id: string;
    username: string | null;
    wallet_address: string | null;
    data: {
        donationAlerts: Array<{
            id: string;
            name: string;
            config: AlertConfig;
        }>;
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
                    update(currentData => ({ ...currentData, ...data } as UserData));
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
                const currentData = get(this) || { data: {} };
                const updatedData = {
                    ...currentData.data,
                    [key]: value
                };

                const { data, error } = await supabase
                    .from('users')
                    .update({ data: updatedData })
                    .eq('id', currentUser.id)
                    .single();

                if (error) throw error;

                if (data) {
                    this.set({ ...currentData, data: updatedData } as UserData);
                }
            } catch (error) {
                console.error('Error updating data field:', error);
            }
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
