
import { ReactComponent as GrandStaff } from '../../assets/staff.svg';
import { ReactComponent as WholeNote } from '../../assets/wholeNote.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useKey } from 'react-use';
import { CHECKMARK_ANIMATION_PROPERTIES, getNoteAnimationProperties, HITZONE_ANIMATION_PROPERTIES, NOTE_FADE_VARIANT } from '../../constants/animations/PianoPlayerAnimations';
import { checkIfIntersecting, handleGameOverAudio } from '../../helpers/helpers';
import { times } from 'lodash';
import { ReactComponent as Checkmark } from '../../assets/checkmark.svg';
import XMark from '../XMark';
import { GAME_IDS } from '../../constants/common';
import Instructions from '../Instructions';

interface PianoPlayerProps {
    endAllGames: (gameId: number) => void,
    isAnotherGameOver: boolean,
    isSmallScreen: boolean
}

const PianoPlayer: React.FC<PianoPlayerProps> = (props) => {
    const { endAllGames, isAnotherGameOver, isSmallScreen } = props;
    const [noteDelay, setNoteDelay] = useState(5500);
    const [noteAnimationSpeed, setNoteAnimationSpeed] = useState(5);
    const [wrongNoteLanes, setWrongNoteLanes] = useState([] as number[]);
    const [correctlyPlayedNotes] = useState(new Set());
    const [isMissedNote, setIsMissedNote] = useState(false);
    const [hiddenNotes, setHiddenNotes] = useState([true, true, true]);
    const [shouldDisplayX, setShouldDisplayX] = useState(false);

    const hiddenNotesRef = useRef([true, true, true]);
    const playedNotesCountRef = useRef(0);
    const isCurrentGameOverRef = useRef(false);

    const NOTE_ANIMATION_1 = useAnimation();
    const NOTE_ANIMATION_2 = useAnimation();
    const NOTE_ANIMATION_3 = useAnimation();
    const HITZONE_ANIMATION_1 = useAnimation();
    const HITZONE_ANIMATION_2 = useAnimation();
    const HITZONE_ANIMATION_3 = useAnimation();
    const CHECKMARK_ANIMATION_1 = useAnimation();
    const CHECKMARK_ANIMATION_2 = useAnimation();
    const CHECKMARK_ANIMATION_3 = useAnimation();

    const handleCurrentGameEnd = useCallback(() => {
        isCurrentGameOverRef.current = true;
        NOTE_ANIMATION_1.stop();
        NOTE_ANIMATION_2.stop();
        NOTE_ANIMATION_3.stop();
        handleGameOverAudio();
    }, [NOTE_ANIMATION_1, NOTE_ANIMATION_2, NOTE_ANIMATION_3]);
    // if another game ends
    useEffect(() => {
        if (isAnotherGameOver) handleCurrentGameEnd();
    }, [isAnotherGameOver, handleCurrentGameEnd]);

    const getNoteAnimation = (index: number) => {
        switch (index) {
            case 0:
                return NOTE_ANIMATION_1;
            case 1:
                return NOTE_ANIMATION_2;
            case 2:
                return NOTE_ANIMATION_3;
            default:
                return null;
        }
    }
    const getHitzoneAnimation = (index: number) => {
        switch (index) {
            case 0:
                return HITZONE_ANIMATION_1;
            case 1:
                return HITZONE_ANIMATION_2;
            case 2:
                return HITZONE_ANIMATION_3;
            default:
                return null;
        }
    }
    const getCheckmarkAnimation = (index: number) => {
        switch (index) {
            case 0:
                return CHECKMARK_ANIMATION_1;
            case 1:
                return CHECKMARK_ANIMATION_2;
            case 2:
                return CHECKMARK_ANIMATION_3;
            default:
                return null;
        }
    }

    const beginNoteTimeout = () => {
        correctlyPlayedNotes.clear();
        const isNegative = Math.round(Math.random()) === 1;
        const randomizer = 500 * Math.random() * (isNegative ? - 1 : 1);
        setTimeout(() => {
            generateNote();
        }, noteDelay + randomizer)
    };

    const generateNote = () => {
        if (isCurrentGameOverRef.current) return;
        // starting from the 10th note, start spawning two notes each time
        const noteCount = playedNotesCountRef.current < 10 ? 1 : 2;
        const targetLanes = new Set<number>();
        // randomly pick which lanes to spawn the notes in
        for (let a = 0; a < noteCount; a++) {
            let randomIndex = Math.floor(Math.random() * 3);
            while (true) {
                randomIndex = Math.floor(Math.random() * 3);
                if (!targetLanes.has(randomIndex)) {
                    targetLanes.add(randomIndex);
                    break;
                }
            }
            targetLanes.add(randomIndex);
            if (targetLanes.size >= 3) break;
        }
        // spawn the notes
        const noteAnimationProperties = getNoteAnimationProperties(noteAnimationSpeed);
        targetLanes.forEach(index => {
            hiddenNotesRef.current[index] = false;
            setHiddenNotes([...hiddenNotesRef.current]);
            getNoteAnimation(index)?.start(noteAnimationProperties).then(() => {
                // after the note has completed its animation (reached the bottom),
                // we check if the player was able to play it.
                // (we use a set because it's easier to access in a callback)
                if (!correctlyPlayedNotes.has(index)) {
                    isCurrentGameOverRef.current = true;
                    setShouldDisplayX(true);
                    setIsMissedNote(true);
                    handleCurrentGameEnd();
                    endAllGames(GAME_IDS.PIANO);
                    setWrongNoteLanes(lanes => {
                        return [...lanes, index];
                    });
                }
            });
        });
        // increase speed every 10 notes
        if (playedNotesCountRef.current % 10 === 0 && noteDelay > 1000) {
            setNoteDelay(delay => delay - 500);
            setNoteAnimationSpeed(speed => speed - 500);
        }
        playedNotesCountRef.current++;
        beginNoteTimeout();
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            beginNoteTimeout();
        }, 2000);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleHitzoneCheck = (index: number) => {
        getHitzoneAnimation(index)?.start(HITZONE_ANIMATION_PROPERTIES);
        const hitzone = document.getElementsByClassName('hitzone')[index].getBoundingClientRect();
        const quarterNote = document.getElementsByClassName('quarter-note')[index].getBoundingClientRect();
        const isIntersecting = checkIfIntersecting(hitzone, quarterNote);
        // if the hitzone is intersecting and the note is currently being displayed
        if (isIntersecting && !hiddenNotesRef.current[index]) {
            getCheckmarkAnimation(index)?.start(CHECKMARK_ANIMATION_PROPERTIES);
            correctlyPlayedNotes.add(index);
            hiddenNotesRef.current[index] = true;
            setHiddenNotes([...hiddenNotesRef.current]);
        } else {
            isCurrentGameOverRef.current = true;
            setShouldDisplayX(true);
            handleCurrentGameEnd();
            endAllGames(GAME_IDS.PIANO);
            handleGameOverAudio();
            setWrongNoteLanes(lanes => {
                return [...lanes, index];
            });
        }
    }
    const handleKeyPress = (event: KeyboardEvent) => {
        if (isCurrentGameOverRef.current) return;
        let index = 0;
        switch (event.key) {
            case 'a':
            case 'A':
                index = 0;
                break;
            case 's':
            case 'S':
                index = 1;
                break;
            case 'd':
            case 'D':
                index = 2;
                break;
            default:
                return;
        }
        handleHitzoneCheck(index);
    };
    useKey('a', handleKeyPress, { event: 'keydown' });
    useKey('s', handleKeyPress, { event: 'keydown' });
    useKey('d', handleKeyPress, { event: 'keydown' });
    useKey('A', handleKeyPress, { event: 'keydown' });
    useKey('S', handleKeyPress, { event: 'keydown' });
    useKey('D', handleKeyPress, { event: 'keydown' });

    return (
        <div className="relative flex justify-around w-full h-full bg-grey" data-type="piano-player-container">
            {shouldDisplayX && <XMark />}
            <Instructions
                mainText={"Play the notes when they enter the circles!"}
                controlKeys={['A', 'S', 'D']}
                controlKeyText={['Left', 'Middle', 'Right']}
            />
            {/* <div className="absolute z-30 w-full h-full" data-type="piano-background">
                <Piano className="absolute w-full h-full opacity-30 " />
            </div> */}
            {times(3, (i) =>
                <div
                    key={'piano-staff' + i}
                    className="relative flex items-end justify-center w-full h-full overflow-hidden flex-end" data-type="playing-field"
                >
                    <div className="relative flex w-auto h-full">
                        <GrandStaff className="w-full h-full staff" />
                        <div className={`
                            absolute z-10 flex items-center justify-center w-full opacity-90 hitzone-layout
                            ${isSmallScreen ? 'left-[6px]' : 'left-[4px]'}
                        `}>
                            <motion.div
                                animate={getHitzoneAnimation(i) || {}}
                                className="absolute z-10 w-1/2 h-full hitzone"
                                data-type="hit-zone"
                            />
                            <motion.div
                                className="absolute z-20 flex items-center justify-center h-full mx-auto opacity-0"
                                animate={getCheckmarkAnimation(i) || {}}
                                data-type="checkmark"
                            >
                                <Checkmark className="w-full h-full" />
                            </motion.div>
                            {wrongNoteLanes.includes(i) &&
                                <div className="absolute z-20 flex items-center justify-center w-full h-full mx-auto">
                                    {isMissedNote ?
                                        <div className="text-red-600"> Missed <br /> Note </div> :
                                        <div className="text-red-600"> Wrong <br /> Timing </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>

                    <motion.div
                        className="absolute z-30 opacity-0 quarter-note"
                        animate={getNoteAnimation(i) || {}}
                    >
                        <motion.div
                            variants={NOTE_FADE_VARIANT}
                            animate={hiddenNotes[i] ? "hidden" : "display"}
                        >
                            <WholeNote className="w-10 h-10" />
                        </motion.div>
                    </motion.div>
                </div>
            )
            }
        </div>
    );
}

export default PianoPlayer;
