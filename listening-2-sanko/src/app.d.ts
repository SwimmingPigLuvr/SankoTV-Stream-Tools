// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Alert } from '$lib/stores/alertConfigStore';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			userId?: string;
			userAlerts?: Alert[];
			streamerAddress?: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/static/private' {
    export const JWT_TOKEN: string;
}

export {};
