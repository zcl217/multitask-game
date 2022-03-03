export const HITZONE_CONTAINER_VARIANT = {
    normal: {
        width: '200px',
        transition: {
            ease: 'linear'
        }
    },
    small: {
        width: '200px',
        height: '200px',
        transition: {
            ease: 'linear'
        }
    }
}
export const HITZONE_ANIMATION_PROPERTIES = {
    scale: [1, 1.1, 1],
    opacity: [1, 0.9, 1],
    transition: {
        duration: 0.2
    }
}
export const CORRECT_TIMING_ANIMATION_PROPERTIES = {
    width: ["0%", "100%"],
    height: ["0%", "100%"],
    opacity: [1, 0],
    transition: {
        duration: 0.5,
        opacity: { delay: 0.3 }
    },
}
export const WRONG_TIMING_ANIMATION_PROPERTIES = {
    width: ["0%", "100%"],
    height: ["0%", "100%"],
    opacity: [1, 0],
    transition: {
        duration: 0.5,
        opacity: { delay: 0.3 }
    },
}


export const getNoteAnimationProperties = (noteAnimationSpeed: number) => {
    return {
        top: ["0%", "100%", "100%", "0%"],
        opacity: [1, 1, 0, 0],
        transition: {
            duration: noteAnimationSpeed,
            ease: 'linear',
            times: [0, 0.98, 0.99, 1],
        }
    }
}

// export const NOTE_ANIMATION_VARIANT = {
//     playing: (noteAnimationSpeed: number) => ({
//         top: '100%',
//         opacity: 1,
//         transition: {
//             ease: 'linear',
//             duration: noteAnimationSpeed,
//             opacity: { duration: 0 }
//         }
//     }),
//     fading: {
//         opacity: 0,
//         top: '100%',
//         transition: {
//             duration: 1
//         }
//     },
//     hidden: {
//         opacity: 0,
//         top: '0px',
//         transition: {
//             duration: 0
//         }
//     },
// };

export const NOTE_FADE_VARIANT = {
    hidden: {
        opacity: 0,
        scale: [1.3, 1],
        transition: { 
            duration: 0.5 
        }
    },
    display: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.1 }
    }
}

export const NOTE_SCALE_ANIMATION_PROPERTIES = {
    scale: [1.5, 1],
    transition: {
        duration: 0.5,
        times: [0.5, 1]
    }
}

export const CHECKMARK_ANIMATION_PROPERTIES = {
    scale: [1, 2],
    opacity: [1, 0],
    transition: {
        type: "spring",
        velocity: 50,
        stiffness: 200,
        damping: 50
    }
}

export const MARK_ANIMATION_VARIANT = {
    display: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            velocity: 50,
            stiffness: 200,
            damping: 50,
            opacity: { duration: 0 }
        }
    },
    fading: {
        opacity: 0,
        transition: {
            duration: 1
        }
    },
}