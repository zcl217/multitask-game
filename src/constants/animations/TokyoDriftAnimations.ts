export const getMeteorAnimationProperties = (meteorAnimationSpeed: number) => {
    return {
        bottom: ['100%', '-5%', '-5%', '100%'],
        opacity: [1, 1, 0, 0],
        transition: {
            duration: meteorAnimationSpeed / 1000,
            ease: 'linear',
            times: [0, 0.98, 0.99, 1],
        }
    }
};

export const TOKYO_DRIFT_SMALL_SPRITES_ANIMATION = {
    width: '2.5rem',
    height: '2.5rem'
}