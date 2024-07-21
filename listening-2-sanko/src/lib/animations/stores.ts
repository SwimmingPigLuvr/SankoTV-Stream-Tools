import { writable } from 'svelte/store';
import type { AnimationProps } from './types.ts';

export const inProps = writable<AnimationProps>({
    type: 'fly',
    delay: 0,
    duration: 1000,
    easing: 'cubicInOut',
    y: 1000,
})

export const outProps = writable<AnimationProps>({
    type: 'fly',
    delay: 0,
    duration: 1000,
    easing: 'cubicInOut',
    y: 1000,
})


