export type AnimationType = 'blur' | 'fade' | 'fly' | 'scale' | 'slide';

export interface AnimationConfig {
    type: AnimationType;
    delay: number;
    duration: number;
    easing: string;
    [key: string]: any; // for type specific properties
}

