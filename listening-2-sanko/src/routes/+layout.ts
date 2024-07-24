import { walletStore } from "$lib/contracts/walletStores";
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
    // List of routes that require authentication
    const protectedRoutes = ['/emotes', '/donations', '/text-to-speech'];

    if (protectedRoutes.includes(url.pathname)) {
        // Check if user is authenticated
        const unsubscribe = walletStore.subscribe(({ isAuthenticated }) => {
            if (!isAuthenticated) {
                throw redirect(307, '/');
            }
        });
        unsubscribe();
    }

    return {};
};
