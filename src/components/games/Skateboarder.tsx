import { motion, useAnimation } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useKey } from "react-use";
import { ReactComponent as Skateboard } from '../../assets/skateboard.svg';
import Square from '../../assets/square.svg';
import { getBottomObstacleAnimationProperties, getPlayerJumpAnimationProperties, getSkateboardJumpAnimationProperties, getTopObstacleAnimationProperties, getVerticalMovementAnimationProperties } from "../../constants/animations/SkateboarderAnimations";
import { GAME_IDS } from "../../constants/common";
import { checkIfIntersecting, handleGameOverAudio } from "../../helpers/helpers";
import Instructions from "../Instructions";
import XMark from "../XMark";

interface SkateboarderProps {
    endAllGames: (gameId: number) => void,
    isAnotherGameOver: boolean,
    isSmallScreen: boolean
}
// TODO: not sure, but game might mess up as it shrinks 
const Skateboarder: React.FC<SkateboarderProps> = (props) => {
    const { endAllGames, isAnotherGameOver, isSmallScreen } = props;
    const [isCrouching, setIsCrouching] = useState(false);
    const [gameSpeed, setGameSpeed] = useState(2500);
    const [dynamicTopObstacleStyle, setDynamicTopObstacleStyle] = useState({ width: '20%', right: '-20%' } as React.CSSProperties);
    const [dynamicBottomObstacleStyle, setDynamicBottomObstacleStyle] = useState({ width: '15%', right: '-15%', height: '20%' } as React.CSSProperties);
    const [shouldDisplayX, setShouldDisplayX] = useState(false);

    const isJumpingRef = useRef(false);
    const isCrouchingRef = useRef(false);
    const isCurrentGameOverRef = useRef(false);
    const topWidthRef = useRef(20);
    const bottomWidthRef = useRef(15);
    const bottomHeightRef = useRef(20);
    const clearedObstacleCountRef = useRef(0);
    const collisionCheckerIntervalRef = useRef(0);

    const PLAYER_JUMP_ANIMATION = useAnimation();
    const SKATEBOARD_JUMP_ANIMATION = useAnimation();
    const VERTICAL_MOVEMENT_ANIMATION = useAnimation();
    const TOP_OBSTACLE_ANIMATION = useAnimation();
    const BOTTOM_OBSTACLE_ANIMATION = useAnimation();


    const changeTopObstacleStyle = useCallback(() => {
        const randomWidth = Math.floor(Math.random() * 60) + 20;
        topWidthRef.current = randomWidth;
        setDynamicTopObstacleStyle({
            width: `${randomWidth}%`,
            right: `-${randomWidth}%`
        } as React.CSSProperties);
    }, []);
    const changeBottomObstacleStyle = useCallback(() => {
        const randomHeight = Math.floor(Math.random() * 20) + 10;
        let randomWidth = Math.floor(Math.random() * 10) + 10;
        if (isSmallScreen) randomWidth /= 2;
        bottomWidthRef.current = randomWidth;
        bottomHeightRef.current = randomHeight;
        setDynamicBottomObstacleStyle({
            width: `${randomWidth}%`,
            right: `-${randomWidth}%`,
            height: `${randomHeight}%`
        } as React.CSSProperties);
    }, []);
    // recursively call spawnObstacle until the game ends
    const spawnObstacle = () => {
        if (isCurrentGameOverRef.current) return;
        const isTopObstacle = Math.round(Math.random()) === 0;
        if (isTopObstacle) {
            TOP_OBSTACLE_ANIMATION
                .start(getTopObstacleAnimationProperties(gameSpeed * 1.5, topWidthRef.current))
                .then(changeTopObstacleStyle);
        } else {
            BOTTOM_OBSTACLE_ANIMATION
                .start(getBottomObstacleAnimationProperties(gameSpeed * 1.5, bottomWidthRef.current, bottomHeightRef.current))
                .then(changeBottomObstacleStyle);
        }
        clearedObstacleCountRef.current++;
        if (clearedObstacleCountRef.current % 10 === 0) {
            // every 10 obstacles, make the game faster. but don't go below 1500 ms
            setGameSpeed(speed => speed > 1500 ? speed - 500 : speed);
        }
        setTimeout(() => {
            spawnObstacle();
        }, gameSpeed * 1.5 + 100);
    };

    const stopAllAnimations = useCallback(() => {
        PLAYER_JUMP_ANIMATION.stop();
        SKATEBOARD_JUMP_ANIMATION.stop();
        VERTICAL_MOVEMENT_ANIMATION.stop();
        BOTTOM_OBSTACLE_ANIMATION.stop();
        TOP_OBSTACLE_ANIMATION.stop();
    }, [
        PLAYER_JUMP_ANIMATION,
        SKATEBOARD_JUMP_ANIMATION,
        VERTICAL_MOVEMENT_ANIMATION,
        BOTTOM_OBSTACLE_ANIMATION,
        TOP_OBSTACLE_ANIMATION
    ]);

    const handleCurrentGameEnd = useCallback(() => {
        isCurrentGameOverRef.current = true;
        clearInterval(collisionCheckerIntervalRef.current);
        stopAllAnimations();
    }, [stopAllAnimations]);
    useEffect(() => {
        if (isAnotherGameOver) handleCurrentGameEnd();
    }, [isAnotherGameOver, handleCurrentGameEnd]);
    // on mount, we begin the game and constantly check
    // if the player is intersecting with any obstacles
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            spawnObstacle();
            collisionCheckerIntervalRef.current = window.setInterval(() => {
                const obstacles = document.getElementsByClassName('obstacle');
                const playerBoundary = document.getElementsByClassName('player')[0].getBoundingClientRect();
                const skateboardBoundary = document.getElementsByClassName('skateboard')[0].getBoundingClientRect();
                for (let a = 0; a < obstacles.length; a++) {
                    const obstacleBoundary = obstacles[a].getBoundingClientRect();
                    const isIntersecting = checkIfIntersecting(playerBoundary, obstacleBoundary, 0) || checkIfIntersecting(skateboardBoundary, obstacleBoundary, 10, 10);
                    if (isIntersecting) {
                        setShouldDisplayX(true);
                        handleCurrentGameEnd();
                        handleGameOverAudio();
                        endAllGames(GAME_IDS.SKATEBOARDER);
                        clearInterval(collisionCheckerIntervalRef.current);
                    }
                }
            }, 50);
        }, 4000);
        return () => {
            clearTimeout(timeoutId);
            clearInterval(collisionCheckerIntervalRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleCrouch = (isKeyDown: boolean) => {
        if (isCrouchingRef.current === isKeyDown) return;
        setIsCrouching(isKeyDown);
        isCrouchingRef.current = isKeyDown;
    }
    const handleJump = () => {
        isJumpingRef.current = true;
        PLAYER_JUMP_ANIMATION.start(getPlayerJumpAnimationProperties(gameSpeed));
        SKATEBOARD_JUMP_ANIMATION.start(getSkateboardJumpAnimationProperties(gameSpeed));
        VERTICAL_MOVEMENT_ANIMATION.start(getVerticalMovementAnimationProperties(gameSpeed));
        setTimeout(() => {
            isJumpingRef.current = false;
        }, gameSpeed - 100);

    }
    const handleKeyPress = (event: KeyboardEvent) => {
        if (isJumpingRef.current || isCurrentGameOverRef.current) return;
        switch (event.key) {
            case 'Shift':
                handleCrouch(event.type === 'keydown');
                break;
            case ' ':
                if (isCrouchingRef.current) return;
                handleJump();
                break;
        }
    }
    useKey(' ', handleKeyPress, { event: 'keydown' });
    useKey('Shift', handleKeyPress, { event: 'keydown' });
    useKey('Shift', handleKeyPress, { event: 'keyup' });

    return (
        <div className="relative flex flex-col w-full h-full overflow-x-hidden">
            {shouldDisplayX && <XMark />}
            <Instructions
                mainText={"Dodge the obstacles!"}
                controlKeys={['space', 'shift']}
                controlKeyText={['Jump', 'Duck']}
            />
            <motion.div
                className={`absolute bg-red-300 opacity-0 top-obstacle obstacle`}
                style={dynamicTopObstacleStyle}
                animate={TOP_OBSTACLE_ANIMATION}
            />
            <motion.div
                className={`absolute bg-red-300 opacity-0 obstacle bottom-obstacle`}
                style={dynamicBottomObstacleStyle}
                animate={BOTTOM_OBSTACLE_ANIMATION}
            />
            <div className="top-0 w-full bg-purple-300 h-[10%]">
                &nbsp;
            </div>
            <div className="relative z-10 ml-[30%] w-[20%] h-[80%]">
                <motion.div
                    className="absolute bottom-0 flex flex-col h-1/5"
                    animate={VERTICAL_MOVEMENT_ANIMATION}
                >
                    <div className={`flex flex-col ${isCrouching ? 'justify-end' : 'justify-between'} h-full`} data-type="player-container">
                        <motion.div
                            className={`flex justify-center h-1/2`}
                            animate={PLAYER_JUMP_ANIMATION}
                        >
                            <img src={Square} alt="Square" className="h-full player" />
                        </motion.div>
                        <motion.div
                            className="h-[30%] flex justify-center"
                            animate={SKATEBOARD_JUMP_ANIMATION}
                        >
                            <Skateboard className="h-full skateboard" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            <div className="bottom-0 w-full bg-purple-300 h-[10%]">
                &nbsp;
            </div>
        </div>
    );
}

export default Skateboarder;
