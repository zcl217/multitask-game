import { GAME_SCREEN_SHIFT_DURATION } from "../common"

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

export const CONTROL_KEYS_ANIMATION = {
    boxShadow: ['inset 0px -2px 3px 3px grey', 'inset 0px 0px 3px 3px grey'],
    backgroundColor: ['#ffffff', '#cec8c8'],
    paddingTop: ['8px', '11px'],
    transition: {
        repeat: 8,
        duration: 1
    }
}

export const getVerticalShiftAnimation = (value: number) => {
    return {
        top: `${value}vh`,
        transition: {
            duration: GAME_SCREEN_SHIFT_DURATION,
            ease: 'easeInOut',
        }
    }
}

export const HORIZONTAL_DISPLAY_ANIMATION = {
    left: ['100vw', '0vw', '0vw', '0vw'],
    opacity: [1, 1, 1, 1],
    transition: {
        duration: GAME_SCREEN_SHIFT_DURATION,
        ease: 'easeInOut',
        times: [0, 0.98, 0.99, 1]
    }

}

export const HORIZONTAL_HIDE_ANIMATION = {
    left: ['0vw', '-100vw', '-100vw', '100vw'],
    opacity: [1, 1, 0, 0],
    transition: {
        duration: GAME_SCREEN_SHIFT_DURATION,
        ease: 'easeInOut',
        times: [0, 0.98, 0.99, 1]
    }
}

