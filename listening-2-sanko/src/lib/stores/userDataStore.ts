// lib/stores/userDataStore.ts
import { writable, get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { user } from './authStore';

interface UserData {
    id: string;
    username: string | null;
    wallet_address: string | null;
    data: Record<string, any>;
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
                const { data, error } = await supabase
                    .from('users')
                    .update({ data: supabase.utils.toJSON({ [key]: value }) })
                    .eq('id', currentUser.id)
                    .single();

                if (error) throw error;

                if (data) {
                    update(currentData => {
                        if (currentData) {
                            return { 
                                ...currentData, 
                                data: { ...currentData.data, [key]: value }
                            };
                        }
                        return currentData;
                    });
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
