// src/lib/stores/authStore.ts
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export const user = writable(null);

supabase.auth.onAuthStateChange((event, session) => {
  user.set(session?.user ?? null);
});
