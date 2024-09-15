import { walletStore } from "$lib/walletStores";
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
    // List of routes that require authentication
    const protectedRoutes = ['/emotes', '/donations', '/text-to-speech'];

    if (protectedRoutes.includes(url.pathname)) {
        // Check if user is authenticated
        const { isAuthenticated } = await new Promise(resolve => {
            const unsubscribe = walletStore.subscribe(state => {
                unsubscribe();
                resolve(state);
            });
        });

        if (!isAuthenticated) {
            throw redirect(307, '/');
        }
    }

    return {};
};
