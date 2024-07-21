import { writable } from 'svelte/store';
import type { AnimationConfig } from './types.ts';
import { defaultConfigs } from './constants.ts';

export const inConfig = writable<AnimationConfig>(defaultConfigs.fade);
export const outConfig = writable<AnimationConfig>(defaultConfigs.fade);

