import { writable } from 'svelte/store';

export const isDarkMode = writable<boolean>(true);

export let isMobile = writable<boolean>(false);
export let showDirectory = writable<boolean>(false);

export let showNameAlert = writable<boolean>(false);

export let showLinkVisualMedia = writable<boolean>(false);
export let showSelectVisualMedia = writable<boolean>(false);

export let showSelectMedia = writable<boolean>(false);
export let selectionType = writable<'audio' | 'visual'>('visual');
export let selectionMode = writable<'link' | 'upload' | 'select'>('select');





