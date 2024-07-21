import type { Writable } from 'svelte/store';
import type { AnimationProps, AnimationType } from './types.ts';
import { animationParams } from './constants.ts';

export function updateAnimationProp(props: Writable<AnimationProps>, prop: string, value: any) {
    props.update(currentProps => ({ ...currentProps, [prop]: value}));
}

export function handleAnimationChange(props: typeof inProps | typeof outProps, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value in animationParams) {
        props.update(currentProps => ({ ...currentProps, type: target.value as AnimationType }));
    }
}
