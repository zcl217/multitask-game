export const getPlayerJumpAnimationProperties = (duration: number) => {
    return {
        rotateZ: [-10, -10, 0, 10, 0],
        marginLeft: ['0', '0', '0', '10%', '0%'],
        transition: {
            duration: duration / 1000
        }
    }
}

export const getSkateboardJumpAnimationProperties = (duration: number) => {
    return {
        rotateX: [0, 0, 0, 360, 360],
        rotateZ: [-10, -20, 0, 10, 0],
        transition: {
            ease: 'linear',
            duration: duration / 1000,
        }
    }
}

export const getVerticalMovementAnimationProperties = (duration: number) => {
    return {
        bottom: ["0%", "60%", "0%"],
        transition: {
            duration: duration / 1000 - 0.3,
            ease: ['easeOut', 'easeIn']
        }
    }
}

export const getTopObstacleAnimationProperties = (duration: number, offset: number) => {
    return {
        right: [`-${offset}%`, "100%", "100%", "100%", `-${offset}%`],
        height: ["67%", "67%", "67%", "0%", "0%"],
        opacity: [1, 1, 0, 0, 0],
        transition: {
            duration: duration / 1000,
            ease: 'linear',
            times: [0, 0.97, 0.98, 0.99, 1],
        }
    }
}


export const getBottomObstacleAnimationProperties = (duration: number, widthOffset: number, height: number) => {
    return {
        right: [`-${widthOffset}%`, "100%", "100%", "100%", `-${widthOffset}%`],
        height: [`${height}%`, `${height}%`, `${height}%`, "0%", "0%"],
        opacity: [1, 1, 0, 0, 0],
        transition: {
            duration: duration / 1000,
            ease: 'linear',
            times: [0, 0.97, 0.98, 0.99, 1],
        }
    }
}
