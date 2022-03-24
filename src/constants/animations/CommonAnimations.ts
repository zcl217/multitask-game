export const XMARK_ANIMATION = {
    scale: 2,
    transition: {
        type: "spring",
        velocity: 50,
        stiffness: 200,
        damping: 50
    }
}

export const INSTRUCTIONS_ANIMATION = {
    opacity: [0, 1, 0.5, 0],
    transition: {
        ease: 'linear',
        duration: 8.5,
        times: [0.24, 0.25, 0.8, 1],
    }
}

export const getTopAnimation = (value: number) => {
    return {
        top: `${value}vh`,
        transition: {
            duration: 1,
            ease: 'easeInOut',
        }
    }
}
