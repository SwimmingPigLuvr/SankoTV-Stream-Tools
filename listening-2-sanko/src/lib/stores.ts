import { writable } from 'svelte/store';

export const isDarkMode = writable<boolean>(true);

export let isMobile = writable<boolean>(false);
export let showDirectory = writable<boolean>(false);

export let showNameAlert = writable<boolean>(false);

export let showLinkVisualMedia = writable<boolean>(false);
export let showSelectVisualMedia = writable<boolean>(false);




