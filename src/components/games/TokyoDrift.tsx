import React, { useState, useReducer, useEffect, useCallback, useMemo, useRef } from "react";
import { times, uniqueId } from 'lodash';
import { ReactComponent as Spaceship } from '../../assets/spaceship.svg';
import { ReactComponent as Meteor } from '../../assets/meteor.svg';
import { motion, useAnimation } from "framer-motion";
import { useKey } from "react-use";
import XMark from "../XMark";
import { GAME_IDS } from "../../constants/common";
import { checkIfIntersecting, handleGameOverAudio } from "../../helpers/helpers";
import { getMeteorAnimationProperties, TOKYO_DRIFT_SMALL_SPRITES_ANIMATION } from "../../constants/animations/TokyoDriftAnimations";
import Instructions from "../Instructions";
import useTimeout from "../../hooks/useTimeout";

const INITIAL_METEOR_COUNT = 4;
const SPACESHIP_MOVEMENT_DELAY = 2;
// this is the spaceship's width offset between the actual svg and the div boundary
// (used in collision calculations)
// 2rem (32px) from the spaceship width + 1rem(16px) from the meteor width
const widthOffset = 32;

interface TokyoDriftProps {
    endAllGames: (gameId: number) => void,
    isAnotherGameOver: boolean,
    isSmallScreen: boolean,
}
interface SpaceshipReducerPayload {
    type: string,
    index: number
}
interface SpaceshipContainerElement {
    type: string,
    id: string,
    subId?: string
}

const SPACESHIP_CONTAINER_ACTION_TYPES = {
    LEFT: 'left',
    RIGHT: 'right'
}
const spaceshipContainerReducer = (spaceshipContainer: SpaceshipContainerElement[], payload: SpaceshipReducerPayload): SpaceshipContainerElement[] => {
    const newContainer = [...spaceshipContainer];
    const { index } = payload;
    switch (payload.type) {
        case SPACESHIP_CONTAINER_ACTION_TYPES.LEFT:
            if (index === 0) return spaceshipContainer;
            [newContainer[index], newContainer[index - 1]] = [newContainer[index - 1], newContainer[index]];
            return newContainer;
        case SPACESHIP_CONTAINER_ACTION_TYPES.RIGHT:
            if (index === 2) return spaceshipContainer;
            [newContainer[index], newContainer[index + 1]] = [newContainer[index + 1], newContainer[index]];
            return newContainer;
        default:
            return spaceshipContainer;
    }
}

const CONTAINER_ELEMENT_TYPES = {
    FILLER: 'filler',
    SPACESHIP: 'spaceship'
}
const generateSpaceshipContainer = (): SpaceshipContainerElement[] => {
    const container = [
        {
            type: CONTAINER_ELEMENT_TYPES.FILLER,
            id: uniqueId(),
        },
        {
            type: CONTAINER_ELEMENT_TYPES.SPACESHIP,
            id: uniqueId(),
            subId: uniqueId(),
        },
        {
            type: CONTAINER_ELEMENT_TYPES.FILLER,
            id: uniqueId(),
        },
    ]
    return container;
}

// replace setinterval with useinterval
const TokyoDrift: React.FC<TokyoDriftProps> = (props) => {
    const { endAllGames, isAnotherGameOver, isSmallScreen } = props;
    const [spaceshipContainer, spaceshipContainerDispatcher] = useReducer(spaceshipContainerReducer, generateSpaceshipContainer());
    const [meteorContainer, setMeteorContainer] = useState([] as number[]);
    const [meteorSpawnerInterval, setMeteorSpawnerInterval] = useState(0);
    const [spaceshipPositionX, setSpaceshipPositionX] = useState(0);
    const [spaceshipPositionY, setSpaceshipPositionY] = useState(0);
    const [spawnedMeteorCount, setSpawnedMeteorCount] = useState(1);
    const [meteorSpeed, setMeteorSpeed] = useState(5000);
    const [shouldStopSpaceship, setShouldStopSpaceship] = useState(false);
    const [shouldDisplayX, setShouldDisplayX] = useState(false);

    const canPlayerMoveRef = useRef(true);
    const isCurrentGameOverRef = useRef(false);
    const spaceshipIndexRef = useRef(1);
    const meteorCountRef = useRef(INITIAL_METEOR_COUNT);

    const METEOR_ANIMATION = useAnimation();

    const rainbowLanes = useMemo(() => {
        const lanes = [];
        for (let a = 0; a < 3; a++) {
            lanes.push(
                <div className={`flex justify-center ${isSmallScreen ? 'w-8' : 'w-16'}`} key={uniqueId()}>
                    <div className="w-4 h-full bg-rainbow " key={uniqueId()} />
                    <div className="absolute w-4 h-full mask-left" />
                    <div className="absolute w-4 h-full mask-right" />
                </div>
            );
        }
        return lanes;
    }, [isSmallScreen]);

    const setCurrentSpaceshipPosition = () => {
        const gameContainerBoundary = document.getElementsByClassName('tokyo-drift-container')[0].getBoundingClientRect();
        const spaceshipBoundary = document.getElementsByClassName('spaceship')[0].getBoundingClientRect();
        setSpaceshipPositionX(spaceshipBoundary.left - gameContainerBoundary.left);
        setSpaceshipPositionY(spaceshipBoundary.top - gameContainerBoundary.top);
    }
    const handleCurrentGameEnd = () => {
        canPlayerMoveRef.current = false;
        setCurrentSpaceshipPosition();
        setShouldStopSpaceship(true);
        METEOR_ANIMATION.stop();
        clearInterval(meteorSpawnerInterval);
        handleGameOverAudio();
    }

    // if another game ends
    useEffect(() => {
        if (isAnotherGameOver) handleCurrentGameEnd();
    }, [isAnotherGameOver]);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (!canPlayerMoveRef.current || isCurrentGameOverRef.current) return;
        switch (event.key) {
            case 'Q':
            case 'q':
                if (spaceshipIndexRef.current === 0) break;
                spaceshipContainerDispatcher({
                    index: spaceshipIndexRef.current,
                    type: SPACESHIP_CONTAINER_ACTION_TYPES.LEFT
                });
                spaceshipIndexRef.current--;
                canPlayerMoveRef.current = false;
                setTimeout(() => canPlayerMoveRef.current = true, (SPACESHIP_MOVEMENT_DELAY * 1000) - 100);
                break;
            case 'E':
            case 'e':
                if (spaceshipIndexRef.current === 2) break;
                spaceshipContainerDispatcher({
                    index: spaceshipIndexRef.current,
                    type: SPACESHIP_CONTAINER_ACTION_TYPES.RIGHT
                });
                spaceshipIndexRef.current++;
                canPlayerMoveRef.current = false;
                setTimeout(() => canPlayerMoveRef.current = true, (SPACESHIP_MOVEMENT_DELAY * 1000) - 100);
                break;
        }
    }
    useKey('q', handleKeyPress, { event: 'keydown' });
    useKey('e', handleKeyPress, { event: 'keydown' });
    useKey('Q', handleKeyPress, { event: 'keydown' });
    useKey('E', handleKeyPress, { event: 'keydown' });

    // 1 4 7 correspond to player lanes
    // 0 and 8 are unused 
    const generateMeteorLanes = () => {
        const playerLanes = [1, 4, 7];
        const nonPlayerLanes = [2, 3, 5, 6];
        const meteorLanes = [];
        let randomIndex = Math.floor(Math.random() * 3);
        meteorLanes.push(playerLanes[randomIndex]);
        playerLanes.splice(randomIndex, 1);
        let remainingMeteors = meteorCountRef.current - 1;
        // if there are more than 4 meteors, spawn another one in a player lane
        if (meteorCountRef.current > 4) {
            randomIndex = Math.floor(Math.random() * 2);
            meteorLanes.push(playerLanes[randomIndex]);
            remainingMeteors--;
        }
        // randomly select non player lanes to spawn meteors in (by splicing out safe lanes)
        for (let a = 0; a < remainingMeteors; a++) {
            randomIndex = Math.floor(Math.random() * nonPlayerLanes.length);
            meteorLanes.push(nonPlayerLanes[randomIndex]);
            nonPlayerLanes.splice(randomIndex, 1);
        }
        return meteorLanes;
    }
    useEffect(() => {
        METEOR_ANIMATION.start(getMeteorAnimationProperties(meteorSpeed));
        if (spawnedMeteorCount % 10 === 0 && meteorSpeed > 1500) {
            setMeteorSpeed(speed => speed - 500);
        }
        setSpawnedMeteorCount(count => count + 1);
    }, [meteorContainer]);

    const meteorLanes = (
        <div className="absolute z-10 flex justify-around w-full h-full">
            <div data-type="lane-one" />
            <div data-type="lane-two" />
            <div data-type="lane-three" />
            <div data-type="lane-four" />
            <div data-type="lane-five" />
            <div data-type="lane-six" />
            <div data-type="lane-seven" />
            <div data-type="lane-eight" />
            <div data-type="lane-nine" />
        </div>
    );
    useEffect(() => {
        // shuffle meteor positions every interval
        const meteorSpawner = window.setInterval(() => {
            const newLanes = generateMeteorLanes();
            setMeteorContainer(newLanes);
        }, meteorSpeed);
        setMeteorSpawnerInterval(meteorSpawner);
        const collisionChecker = setInterval(() => {
            const meteors = document.getElementsByClassName('meteor');
            const spaceshipBoundary = document.getElementsByClassName('spaceship')[0].getBoundingClientRect();
            for (let a = 0; a < meteors.length; a++) {
                const meteorBoundary = meteors[a].getBoundingClientRect();
                const isIntersecting = checkIfIntersecting(spaceshipBoundary, meteorBoundary, widthOffset);
                if (isIntersecting) {
                    setShouldDisplayX(true);
                    handleCurrentGameEnd();
                    endAllGames(GAME_IDS.DRIFT);
                    handleGameOverAudio();
                    clearInterval(collisionChecker);
                }
            }
            // use animation frame renders too many times; every 200 ms is good enough
        }, 200);
        return () => {
            clearInterval(meteorSpawner);
            clearInterval(collisionChecker);
        }
    }, []);

    const getStoppedSpaceshipPositioning = (left: number, top: number) => {
        return left === 0 ? undefined : {
            left: left + 'px',
            top: top + 'px'
        } as React.CSSProperties
    };


    // TODO: fix clipping background animation
    return (
        <div className="relative w-full h-full overflow-y-hidden bg-black tokyo-drift-container">
            {shouldDisplayX && <XMark />}
            <Instructions
                mainText={"Dodge the meteors!"}
                controlKeys={['Q', 'E']}
                controlKeyText={['Move left', 'Move right']}
            />
            <div className="absolute z-30 flex justify-around w-full h-full" data-type="meteorContainer" >
                {times(9, (i) => {
                    return meteorContainer.includes(i) ?
                        <div key={i}>
                            <motion.div
                                className="absolute"
                                animate={METEOR_ANIMATION}
                                key={'meteor' + i}
                            >
                                <motion.div
                                    className={`absolute -translate-x-1/2 ${isSmallScreen ? 'w-10 h-10' : 'w-20 h-20'}`}
                                    animate={isSmallScreen ? TOKYO_DRIFT_SMALL_SPRITES_ANIMATION : ''}
                                >
                                    <Meteor className="w-full h-full -rotate-45 meteor" />
                                </motion.div>
                            </motion.div>
                        </div> :
                        <div key={i} />
                })}
            </div>
            {meteorLanes}
            <div className="w-full h-full background" />
            <div className="w-full h-full midground" />
            <div className="w-full h-full foreground" />
            <div className="absolute z-10 flex justify-around w-full h-full" data-type="rainbowLanes" >
                {rainbowLanes}
            </div>
            <div className="absolute z-50 flex items-end justify-around w-full h-full" data-type="spaceshipContainer">
                {spaceshipContainer.map(element => {
                    return element.type === CONTAINER_ELEMENT_TYPES.SPACESHIP && !shouldStopSpaceship ?
                        <motion.div
                            layout
                            initial={false}
                            transition={{
                                duration: SPACESHIP_MOVEMENT_DELAY
                            }}
                            key={element.id}
                            className={`flex items-end justify-center ${isSmallScreen ? 'w-10 h-10' : 'w-20 h-20'}`}
                        >
                            <motion.div
                                className={`absolute mb-10 ${isSmallScreen ? 'w-10 h-10' : 'w-20 h-20'}`}
                                animate={isSmallScreen ? TOKYO_DRIFT_SMALL_SPRITES_ANIMATION : ''}
                            >
                                <Spaceship
                                    // className="z-10 w-20 h-20 mb-10 spaceship"
                                    className="w-full h-full spaceship"
                                    key={element.subId}
                                />
                            </motion.div>
                        </motion.div>
                        :
                        <div className={`${isSmallScreen ? 'w-10 h-10' : 'w-20 h-20'}`} key={element.id} />
                })
                }
                {shouldStopSpaceship && <div
                    className={`absolute mb-10 ${isSmallScreen ? 'w-10 h-10' : 'w-20 h-20'}`}
                    style={getStoppedSpaceshipPositioning(spaceshipPositionX, spaceshipPositionY)}
                >
                    <Spaceship
                        className="w-full h-full spaceship"
                    />
                </div>
                }
            </div>


        </div >

    );
}

export default TokyoDrift;
