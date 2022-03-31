import { MOVEMENT_DELAY } from "../PatternCopier";

export const CELL_ANIMATION_PROPERTIES = {
    width: ["0rem", "3rem"],
    height: ["0rem", "3rem"],
    opacity: [1, 0],
    transition: { duration: 1, opacity: { delay: 0.5 } }
};
export const CELL_ANIMATION_SMALL_PROPERTIES = {
    width: ["0rem", "1.5rem"],
    height: ["0rem", "1.5rem"],
    opacity: [1, 0],
    transition: { duration: 1, opacity: { delay: 0.5 } }
};
export const CHECKMARK_ANIMATION = {
    scale: 1,
    transition: {
        type: "spring",
        velocity: 50,
        stiffness: 200,
        damping: 50
    }
};
export const CELL_CONTAINER_VARIANT = {
    hidden: {
        opacity: 0,
        bottom: '-10px'
    },
    show: {
        opacity: 1,
        bottom: '0px',
        transition: {
            staggerChildren: 0.5
        }
    }
};
export const TIMER_ANIMATION_PROPERTIES = {
    scale: 1,
    transition: {
        type: "spring",
        velocity: 15,
        stiffness: 300,
        damping: 70
    }
};
export const SMOOTH_TRANSITION = { duration: MOVEMENT_DELAY / 1500, ease: "linear" };
export const INSTANT_TRANSITION = { duration: 0, ease: 'linear' };