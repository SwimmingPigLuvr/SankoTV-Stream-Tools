import { writable } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '$lib/supabaseClient';

interface AuthState {
    user: User | null;
    session: Session | null;
}

const initialState: AuthState = {
    user: null,
    session: null
};

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(initialState);

    return {
        subscribe,
        set,
        update,
        setUser: (user: User | null) => update(state => ({ ...state, user })),
        setSession: (session: Session | null) => update(state => ({ ...state, session })),
    };
}

export const authStore = createAuthStore();

// For convenience, you can also export a derived store for just the user
import { derived } from 'svelte/store';
export const user = derived(authStore, $auth => $auth.user);

// Set up the auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
    authStore.setSession(session);
    authStore.setUser(session?.user ?? null);
});

// Function to update the auth store (useful for manual updates if needed)
export function setAuthState(newState: Partial<AuthState>) {
    authStore.update(state => ({ ...state, ...newState }));
}

// Initialize the store with the current session
supabase.auth.getSession().then(({ data: { session } }) => {
    authStore.setSession(session);
    authStore.setUser(session?.user ?? null);
});
