export const defaultConfigs: Record<AnimationType, AnimationConfig> = {
    fade: { type: 'fade', delay: 0, duration: 500, easing: 'cubicInOut' },
    fly: { type: 'fly', delay: 0, duration: 500, easing: 'cubicInOut', y: -20, x: 0 },
    slide: { type: 'slide', delay: 0, duration: 500, easing: 'cubicInOut', axis: 'y' },
    scale: { type: 'scale', delay: 0, duration: 500, easing: 'cubicInOut', start: 0 },
    blur: { type: 'blur', delay: 0, duration: 500, easing: 'cubicInOut', amount: 5 },
}

export const commonParams = ['delay', 'duration', 'easing'];

export const specificParams: Record<AnimationType, string[]> = {
    fade: [],
    fly: ['x', 'y'],
    slide: ['axis'],
    scale: ['start'],
    blur: ['amount']
}

export const easingFunctions = [
    "linear",
    "backIn",
    "backOut",
    "backInOut",
    "bounceIn",
    "bounceOut",
    "bounceInOut",
    "circIn",
    "circOut",
    "circInOut",
    "cubicIn",
    "cubicOut",
    "cubicInOut",
    "elasticIn",
    "elasticOut",
    "elasticInOut",
    "expoIn",
    "expoOut",
    "expoInOut",
    "quadIn",
    "quadOut",
    "quadInOut",
    "quartIn",
    "quartOut",
    "quartInOut",
    "quintIn",
    "quintOut",
    "quintInOut",
    "sineIn",
    "sineOut",
    "sineInOut",
];


