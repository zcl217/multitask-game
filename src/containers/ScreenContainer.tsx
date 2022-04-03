import { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';
import { motion } from "framer-motion";
import { getVerticalShiftAnimation, HORIZONTAL_DISPLAY_ANIMATION, HORIZONTAL_HIDE_ANIMATION } from "../constants/animations/CommonAnimations";
import { FETCH_CURRENT_USER, INSERT_NEW_USER_MUTATION, UPDATE_USER_SCORE_MUTATION } from "../queries/queries";
import { uniqueId } from "lodash";
import { GAME_SCREEN_SHIFT_DURATION } from "../constants/common";
import AudioControl from "../components/AudioControl";

const ScreenContainer: React.FC = () => {
    const { user } = useAuth0();
    const [isInGame, setIsInGame] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(false);
    const [isGameDisplayed, setIsGameDisplayed] = useState(false);
    // changing the keys will reset the component
    const [firstGameKey, setFirstGameKey] = useState(uniqueId());
    const [secondGameKey, setSecondGameKey] = useState(uniqueId());
    const [isFirstGameScreenHidden, setIsFirstGameScreenHidden] = useState(true);
    const [isGameScreenShifting, setIsGameScreenShifting] = useState(false);
    const [username, setUsername] = useState('anonymous');
    const [highscore, setHighscore] = useState(0);
    const [fetchCurrentUser, { loading, data: userData, refetch }] = useLazyQuery(FETCH_CURRENT_USER, {});
    const [updateUserScore] = useMutation(UPDATE_USER_SCORE_MUTATION, {});
    const [insertNewUser] = useMutation(INSERT_NEW_USER_MUTATION, {});

    useEffect(() => {
        if (!user?.sub) return;
        fetchCurrentUser({
            variables: {
                userId: user.sub
            }
        });
    }, [user]);
    useEffect(() => {
        if (userData?.user === undefined || !user?.sub) return;
        if (userData.user.length > 0) {
            setUsername(userData.user[0].username);
            setHighscore(userData.user[0].highscore);
        } else {
            // insert new user if none found
            insertNewUser({
                variables: {
                    userId: user.sub,
                    email: user.email
                }
            });
        }
    }, [userData, user]);

    const handleStart = () => {
        setIsInGame(true);
        setIsGameDisplayed(true);
    }
    const hideGameScreen = () => {
        setIsInGame(false);
        // after the shift animation finishes, we reset both game components
        setTimeout(() => {
            setFirstGameKey(uniqueId());
            setSecondGameKey(uniqueId());
            setIsGameDisplayed(false);
        }, GAME_SCREEN_SHIFT_DURATION * 1000);
    }
    // reset the incoming game component by assigning a new ky
    const shiftGameScreens = () => {
        isFirstGameScreenHidden ?
            setFirstGameKey(uniqueId()) :
            setSecondGameKey(uniqueId());
        setIsGameScreenShifting(true);
        setIsFirstGameScreenHidden(val => !val);
        setTimeout(() => {
            setIsGameScreenShifting(false);
        }, GAME_SCREEN_SHIFT_DURATION * 1000);
    }
    const updateHighscore = (newHighscore: number) => {
        setHighscore(newHighscore);
        if (!user?.sub) return;
        updateUserScore({
            variables: {
                userId: user.sub,
                highscore: newHighscore
            }
        });
    }
    return (
        <div className="w-screen h-screen min-w-[800px] min-h-[600px] relative overflow-x-auto overflow-y-hidden">
            <motion.div
                className="absolute w-full h-full"
                animate={isInGame ? getVerticalShiftAnimation(-100) : getVerticalShiftAnimation(0)}
            >
                <HomeScreen
                    onStart={handleStart}
                    isInGame={isInGame}
                    username={username}
                    highscore={highscore}
                />
            </motion.div>
            {isGameDisplayed &&
                <motion.div
                    className="absolute w-full h-full top-[100vh] overflow-x-hidden"
                    animate={isInGame ? getVerticalShiftAnimation(0) : getVerticalShiftAnimation(100)}
                >
                    <motion.div
                        className={`absolute w-full h-full ${isFirstGameScreenHidden && 'left-[100vw]'}`}
                        animate={isFirstGameScreenHidden ? HORIZONTAL_HIDE_ANIMATION : HORIZONTAL_DISPLAY_ANIMATION}
                        initial={false}
                        data-type="game-screen-one"
                    >
                        {(!isFirstGameScreenHidden || isGameScreenShifting) &&
                            <>
                                <AudioControl
                                    isInGame={true}
                                    isAudioOn={isAudioOn}
                                    setIsAudioOn={setIsAudioOn}
                                />
                                <GameScreen
                                    isInGame={isInGame}
                                    highscore={highscore}
                                    hideGameScreen={hideGameScreen}
                                    shiftGameScreens={shiftGameScreens}
                                    updateHighscore={updateHighscore}
                                    key={firstGameKey}
                                />
                            </>
                        }
                    </motion.div>
                    <motion.div
                        className={`absolute w-full h-full ${!isFirstGameScreenHidden && 'left-[100vw]'}`}
                        animate={isFirstGameScreenHidden ? HORIZONTAL_DISPLAY_ANIMATION : HORIZONTAL_HIDE_ANIMATION}
                        initial={false}
                        data-type="game-screen-two"
                    >
                        {(isFirstGameScreenHidden || isGameScreenShifting) &&
                            <>
                                <AudioControl
                                    isInGame={true}
                                    isAudioOn={isAudioOn}
                                    setIsAudioOn={setIsAudioOn}
                                />
                                <GameScreen
                                    isInGame={isInGame}
                                    highscore={highscore}
                                    hideGameScreen={hideGameScreen}
                                    shiftGameScreens={shiftGameScreens}
                                    updateHighscore={updateHighscore}
                                    key={secondGameKey}
                                />
                            </>
                        }
                    </motion.div>
                </motion.div>
            }
        </div>
    );
}

export default ScreenContainer;