import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { user } from './authStore';

interface UserData {
    id: string;
    email: string;
    username: string;
    // Add other fields as needed
}

function createUserDataStore() {
    const { subscribe, set, update } = writable<UserData | null>(null);

    return {
        subscribe,
        set,
        update,
        async fetch() {
            const userId = user.get()?.id;
            if (!userId) return;

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user data:', error);
                return;
            }

            set(data);
        },
        async update(updates: Partial<UserData>) {
            const userId = user.get()?.id;
            if (!userId) return;

            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error updating user data:', error);
                return;
            }

            set(data);
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
