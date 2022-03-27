import { useState, useReducer, useEffect, useCallback, useRef } from "react";
import { GAME_IDS } from "../../constants/common";
import { cloneDeep, uniqueId } from "lodash";
import { useKey } from 'react-use';
import { motion, useAnimation } from "framer-motion";
import { CELL_ANIMATION_PROPERTIES, CELL_ANIMATION_SMALL_PROPERTIES, CELL_CONTAINER_VARIANT, CHECKMARK_ANIMATION, PLAYER_TRANSITION, TIMER_ANIMATION_PROPERTIES, } from "../../constants/animations/PatternCopierAnimations";
import { ReactComponent as Checkmark } from '../../assets/checkmark.svg';
import { handleGameOverAudio } from "../../helpers/helpers";
import XMark from "../XMark";
import Instructions from "../Instructions";
import { MOVEMENT_DELAY } from "../../constants/PatternCopier";

interface PatternCopierProps {
    endAllGames: (gameId: number) => void,
    isAnotherGameOver: boolean,
    isSmallScreen: boolean,
    displayNextGame: () => void,
}

interface Pattern {
    x: number,
    y: number
}

interface GridCell {
    id: string,
    isCorrect: boolean,
    isWrong: boolean
}

interface GridReducerPayload {
    type: string,
    previousPattern?: Pattern,
    currentPattern?: Pattern
}

const GRID_ACTION_TYPES = {
    EXPAND_GRID: 'expandGrid',
    // toggle all square animations when the player moves
    TOGGLE_ALL_ANIMATION_PROPERTIES: 'toggleAllAnimationProperties',
    // toggle animation of the correct square
    TOGGLE_PATTERN_ANIMATION_PROPERTIES: 'togglePatternAnimationProperties',
    RESET_ANIMATION_PROPERTIES: 'resetAnimationProperties'
}
const playerId = uniqueId();
const gridReducer = (grid: GridCell[][], payload: GridReducerPayload): GridCell[][] => {
    const newGrid = cloneDeep(grid);
    switch (payload.type) {
        case GRID_ACTION_TYPES.EXPAND_GRID:
            if (grid.length === 5) return grid;
            const curSize = newGrid.length;
            const newRow = [] as GridCell[];
            // add a new row
            for (let a = 0; a < curSize; a++) {
                newRow.push({
                    id: uniqueId(),
                    isCorrect: false,
                    isWrong: false,
                });
            }
            newGrid.push(newRow);
            // add one square to each row
            for (let a = 0; a <= curSize; a++) {
                newGrid[a].push({
                    id: uniqueId(),
                    isCorrect: false,
                    isWrong: false,
                });
            }
            return newGrid;
        case GRID_ACTION_TYPES.TOGGLE_ALL_ANIMATION_PROPERTIES:
            for (let a = 0; a < newGrid.length; a++) {
                for (let b = 0; b < newGrid[a].length; b++) {
                    if (a === payload.currentPattern?.y && b === payload.currentPattern?.x) {
                        newGrid[a][b].isCorrect = true;
                        newGrid[a][b].isWrong = false;
                    } else {
                        newGrid[a][b].isWrong = true;
                        newGrid[a][b].isCorrect = false;
                    }
                }
            }
            return newGrid;
        case GRID_ACTION_TYPES.TOGGLE_PATTERN_ANIMATION_PROPERTIES:
            if (payload.previousPattern && payload.currentPattern) {
                newGrid[payload.previousPattern.y][payload.previousPattern.x].isCorrect = false;
                newGrid[payload.currentPattern.y][payload.currentPattern.x].isCorrect = true;
            }
            return newGrid;
        case GRID_ACTION_TYPES.RESET_ANIMATION_PROPERTIES:
            for (let a = 0; a < newGrid.length; a++) {
                for (let b = 0; b < newGrid[a].length; b++) {
                    newGrid[a][b].isWrong = false;
                    newGrid[a][b].isCorrect = false;
                }
            }
            return newGrid;
        default:
            return grid;
    }
};

const generateGrid = () => {
    const grid = [];
    for (let a = 0; a < 3; a++) {
        const row = [];
        for (let b = 0; b < 3; b++) {
            row.push({
                id: uniqueId(),
                isCorrect: false,
                isWrong: false,
            })
        }
        grid.push(row);
    }
    return grid;
}

// TODO: two consecutive press not working bug might've been because of grid length not being able to be accessed
// in the useKey callback but not completely sure
// TODO: timer is not clearing properly on another game end... and I can still move?????
const PatternCopier: React.FC<PatternCopierProps> = (props) => {
    const { endAllGames, isAnotherGameOver, isSmallScreen, displayNextGame } = props;
    const [displayCheckmark, setDisplayCheckmark] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(3);
    const [isPlayerMoving, setIsPlayerMoving] = useState(false);
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    const [patternList, setPatternList] = useState([] as Pattern[]);
    const [currentPatternIteration, setCurrentPatternIteration] = useState(1);
    const [shouldDisplayPlayer, setShouldDisplayPlayer] = useState(false);
    const [isPlayerOnWrongCell, setIsPlayerOnWrongCell] = useState(false);
    const [shouldDisplayX, setShouldDisplayX] = useState(false);
    // initialize a 3 by 3 matrix
    const [grid, gridDispatcher] = useReducer(gridReducer, generateGrid());
    // you can't access state inside a callback, so use a ref
    // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
    // we still need to keep the useStates because we use them as useEffect's dependency triggers
    // (useRef doesn't trigger renders and therefore won't trigger useEffect)
    const xPosRef = useRef(0);
    const yPosRef = useRef(0);
    const gridLengthRef = useRef(grid.length);
    const timerIdRef = useRef(0);
    const canPlayerMoveRef = useRef(false);
    const levelRef = useRef(2);
    const isCurrentGameOverRef = useRef(false);
    const TIMER_ANIMATION = useAnimation();
    // we want the most updated state in the useKey callback
    useEffect(() => { xPosRef.current = xPos }, [xPos]);
    useEffect(() => { yPosRef.current = yPos }, [yPos]);
    useEffect(() => { gridLengthRef.current = grid.length }, [grid]);

    //if another game ends
    useEffect(() => {
        if (isAnotherGameOver) {
            isCurrentGameOverRef.current = true;
            canPlayerMoveRef.current = false;
            clearInterval(timerIdRef.current);
            handleGameOverAudio();
        };
    }, [isAnotherGameOver]);

    const startPattern = useCallback(() => {
        const patternCount = levelRef.current;
        setTimeRemaining(patternCount + 5);
        let patternXPos = xPosRef.current, patternYPos = yPosRef.current;
        let previousX = 0, previousY = 0;
        const newPatternList: Pattern[] = [];
        const generateNewPosition = () => {
            previousX = patternXPos;
            previousY = patternYPos;
            const randomDirection = Math.floor(Math.random() * 4);
            switch (randomDirection) {
                case 0:
                    patternXPos > 0 ? patternXPos-- : patternXPos++;
                    break;
                case 1:
                    patternXPos < grid[0].length - 1 ? patternXPos++ : patternXPos--;
                    break;
                case 2:
                    patternYPos > 0 ? patternYPos-- : patternYPos++;
                    break;
                case 3:
                    patternYPos < grid.length - 1 ? patternYPos++ : patternYPos--;
                    break;
                default:
                    break;
            }
            newPatternList.push({ x: patternXPos, y: patternYPos });
            // animate the grid
            gridDispatcher({
                type: GRID_ACTION_TYPES.TOGGLE_PATTERN_ANIMATION_PROPERTIES,
                previousPattern: { x: previousX, y: previousY },
                currentPattern: { x: patternXPos, y: patternYPos }
            });
        }
        for (let a = 1; a <= patternCount; a++) {
            setTimeout(() => {
                if (isCurrentGameOverRef.current) return;
                generateNewPosition();
                // final loop
                if (a === patternCount) {
                    setPatternList(newPatternList);
                    triggerTimer();
                    setTimeout(() => {
                        if (isCurrentGameOverRef.current) return;
                        setShouldDisplayPlayer(true);
                        canPlayerMoveRef.current = true;
                        gridDispatcher({ type: GRID_ACTION_TYPES.RESET_ANIMATION_PROPERTIES });
                        // TODO: bug here if we change this to another value other than 1000. not sure why
                    }, MOVEMENT_DELAY);
                }
            }, MOVEMENT_DELAY * a);
        }

    }, [grid]);
    useEffect(() => {
        setTimeout(() => {
            startPattern();
        }, 2000);
    }, []);

    const handleGameOver = useCallback(() => {
        isCurrentGameOverRef.current = true;
        setShouldDisplayX(true);
        endAllGames(GAME_IDS.PATTERN);
        clearInterval(timerIdRef.current);
        canPlayerMoveRef.current = false;
        handleGameOverAudio();
    }, [endAllGames]);
    const handleSuccessfulPatternClear = () => {
        canPlayerMoveRef.current = false;
        setDisplayCheckmark(true);
        clearInterval(timerIdRef.current);
        setTimeout(() => {
            if (isCurrentGameOverRef.current) return;
            gridDispatcher({ type: GRID_ACTION_TYPES.RESET_ANIMATION_PROPERTIES });
            setDisplayCheckmark(false);
            setIsPlayerMoving(false);
            setShouldDisplayPlayer(false);
            setCurrentPatternIteration(x => x + 1);
            if (currentPatternIteration % 5 === 0) {
                gridDispatcher({ type: GRID_ACTION_TYPES.EXPAND_GRID });
            } else if (currentPatternIteration % 6 === 0) {
                levelRef.current++;
            }
            if (currentPatternIteration === 2 ||
                currentPatternIteration === 6 ||
                currentPatternIteration === 10) displayNextGame();
        }, MOVEMENT_DELAY);
        setTimeout(() => {
            if (isCurrentGameOverRef.current) return;
            startPattern();
        }, MOVEMENT_DELAY + 1000);
    };

    // handler for what happens when the player makes a move
    const handlePatternProcessing = () => {
        let currentPattern = patternList[0];
        const remainingPatterns = patternList.slice(1);
        const isFinalPattern = patternList.length === 1;
        setPatternList(remainingPatterns);
        gridDispatcher({
            type: GRID_ACTION_TYPES.TOGGLE_ALL_ANIMATION_PROPERTIES,
            currentPattern
        });
        // if the player moved to the wrong cell, end the game
        if (xPos !== currentPattern.x || yPos !== currentPattern.y) {
            handleGameOver();
            setIsPlayerOnWrongCell(true);
            return;
        }
        if (isFinalPattern) {
            handleSuccessfulPatternClear();
        } else {
            setTimeout(() => {
                if (isCurrentGameOverRef.current) return;
                canPlayerMoveRef.current = true;
                setIsPlayerMoving(false);
            }, MOVEMENT_DELAY / 1.5 - 100);
        }
    };

    // we need to disable exhaustive-deps here because we only want to run these effects on certain conditions
    useEffect(() => {
        // all patterns completed
        if (patternList.length === 0 || isAnotherGameOver) return;
        // handle player move
        // xpos ypos aren't refs because we use them as dependencies here
        canPlayerMoveRef.current = false;
        setIsPlayerMoving(true);
        handlePatternProcessing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xPos, yPos]);
    useEffect(() => {
        if (timeRemaining === 0) handleGameOver();
        TIMER_ANIMATION.start(TIMER_ANIMATION_PROPERTIES);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRemaining]);

    const setPlayerPosition = (key: string) => {
        switch (key) {
            case 'ArrowUp':
                if (isWithinGridBound(yPosRef.current - 1)) setYPos(y => y - 1);
                break;
            case 'ArrowDown':
                if (isWithinGridBound(yPosRef.current + 1)) setYPos(y => y + 1);
                break;
            case 'ArrowLeft':
                if (isWithinGridBound(xPosRef.current - 1)) setXPos(x => x - 1);
                break;
            case 'ArrowRight':
                if (isWithinGridBound(xPosRef.current + 1)) setXPos(x => x + 1);
                break;
            default:
                break;
        }
    }
    const handleKeyPress = (event: KeyboardEvent) => {
        if (!canPlayerMoveRef.current) return;
        setPlayerPosition(event.key);
    }

    // TODO: if we animate the char moving then we can throttle these
    useKey('ArrowUp', handleKeyPress, { event: 'keydown' });
    useKey('ArrowDown', handleKeyPress, { event: 'keydown' });
    useKey('ArrowLeft', handleKeyPress, { event: 'keydown' });
    useKey('ArrowRight', handleKeyPress, { event: 'keydown' });

    // change position without going out of bounds
    const isWithinGridBound = (value: number) => {
        return (gridLengthRef.current > value && value >= 0);
    };
    const triggerTimer = () => {
        setTimeout(() => {
            if (isCurrentGameOverRef.current) return;
            setTimeRemaining(timeRemaining => timeRemaining - 1);
            const id = window.setInterval(() => {
                // TODO: find out why this is ok but setTimeRemaining(timeRemaining - 1) causes bug
                setTimeRemaining(timeRemaining => timeRemaining - 1);
            }, 1000);
            timerIdRef.current = id;
        }, MOVEMENT_DELAY)
    }
    const shouldDisplayTimer = () => {
        if (displayCheckmark) return false;
        const isPlayerTurn = canPlayerMoveRef.current || isPlayerMoving;
        return isPlayerTurn || (timeRemaining > 0 && isAnotherGameOver);
    };
    return (
        <div className="relative flex items-center justify-center w-full h-full p-8 bg-sky-300">
            {shouldDisplayX && <XMark />}
            <Instructions
                mainText={"Copy the pattern!"}
                controlKeys={['←', '↑', '→', '↓']}
                isLargeScreen={true}
            />
            {
                displayCheckmark &&
                <motion.div
                    className="absolute w-20 h-20 mx-auto top-10"
                    animate={CHECKMARK_ANIMATION}
                    initial={true}
                >
                    <Checkmark />
                </motion.div>
            }
            <div className={`
                absolute flex justify-center
                ${isSmallScreen ? 'top-1/3' : 'top-10'}`
            }>
                {shouldDisplayTimer() &&
                    <motion.div
                        className={`
                            ${isSmallScreen ? 'text-8xl' : 'text-7xl'}
                            ${timeRemaining <= 3 ? 'text-red-500 text-shadow' : ''}
                        `}
                        animate={TIMER_ANIMATION}
                    > {timeRemaining} </motion.div>}
            </div>
            <div className="flex items-center justify-center h-2/3">
                <div>
                    {
                        grid.map((row, rowIndex) => (
                            <div className="flex" key={rowIndex}>
                                {row.map((col, colIndex) =>
                                    <motion.div
                                        className={`
                                            flex items-center justify-center m-4 cell-border
                                            ${col.isCorrect ? 'border-green-500' : ''}
                                            ${col.isWrong ? 'border-red-700' : ''}
                                            ${isSmallScreen ? 'p-4 w-4 h-4' : 'p-6 w-6 h-6'}
                                        `}
                                        key={rowIndex + ' ' + colIndex}
                                        variants={CELL_CONTAINER_VARIANT}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {col.isCorrect &&
                                            <motion.div
                                                className="w-0 h-0 -m-8 bg-green-300"
                                                animate={isSmallScreen ? CELL_ANIMATION_SMALL_PROPERTIES : CELL_ANIMATION_PROPERTIES}
                                            />
                                        }
                                        {/* <motion.div
                                            className={`w-0 h-0 -m-8 bg-red-400 opacity-0`}
                                            initial={true}
                                            animate={WRONG_CELL_ANIMATION}
                                        /> */}
                                        {shouldDisplayPlayer &&
                                            rowIndex === yPos &&
                                            colIndex === xPos &&
                                            <motion.div
                                                layoutId={playerId}
                                                transition={PLAYER_TRANSITION}
                                                className="absolute z-10 w-4 h-4 bg-lime-300"
                                            />
                                        }
                                    </motion.div>)}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div >
    );
}

export default PatternCopier;