import { useEffect, useRef, useState } from "react";
import GameOver from "../components/GameOver";
import PianoPlayer from "../components/games/PianoPlayer";
import PatternCopier from "../components/games/PatternCopier";
import { motion } from "framer-motion";
import TokyoDrift from "../components/games/TokyoDrift";
import AudioControl from "../components/AudioControl";
import { HEIGHT_ANIMATION, WIDTH_ANIMATION } from "../constants/animations/GameScreenAnimations";
import Skateboarder from "../components/games/Skateboarder";

interface GameScreenProps {
    isInGame: boolean
    highscore: number
    hideGameScreen: () => void,
    shiftGameScreens: () => void,
    updateHighscore: (newHighscore: number) => void
}

const GameScreen: React.FC<GameScreenProps> = (props) => {
    const { isInGame, highscore, hideGameScreen, shiftGameScreens, updateHighscore } = props;

    const [gamesDisplayed, setGamesDisplayed] = useState(1);
    const [isAnotherGameOver, setIsAnotherGameOver] = useState(false);
    const [scoreInterval, setScoreInterval] = useState(0);
    // use state if we decide to always display the score
    // const [finalScore, setFinalScore] = useState(0);
    const finalScoreRef = useRef(0);

    useEffect(() => {
        const interval = window.setInterval(() => finalScoreRef.current++, 1000);
        setScoreInterval(interval);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (isAnotherGameOver) {
            clearInterval(scoreInterval);
            if (finalScoreRef.current > highscore) updateHighscore(finalScoreRef.current);
        }
    }, [isAnotherGameOver, scoreInterval]);

    const endAllGames = (gameId: number) => {
        setIsAnotherGameOver(true);
    }
    // TODO: we could have a score component to always display the score in game
    // const handleSetScore = (score: number) => setFinalScore(score);
    return (
        <div className={`flex flex-col w-full h-full select-none ${isInGame ? '' : 'pointer-events-none'}`}>
            <AudioControl isInGame={true} />
            {/* <Score isAnotherGameOver={isAnotherGameOver} handleSetScore={handleSetScore} /> */}
            {isAnotherGameOver &&
                <motion.div
                    className="z-50 opacity-0"
                    animate={{ opacity: 1, transition: { duration: 3 } }}
                >
                    <GameOver
                        finalScore={finalScoreRef.current}
                        highscore={highscore}
                        onRetry={shiftGameScreens}
                        hideGameScreen={hideGameScreen}
                    />
                </motion.div>
            }
            <motion.div
                className="flex flex-row justify-between w-full h-full"
                animate={gamesDisplayed > 2 ? HEIGHT_ANIMATION : ''}
                data-type="top-game-container"
            >
                <motion.div
                    className="w-full h-full"
                    animate={gamesDisplayed > 1 ? WIDTH_ANIMATION : ''}
                >
                    {/* <Skateboarder
                        endAllGames={endAllGames}
                        isAnotherGameOver={isAnotherGameOver}
                        isSmallScreen={gamesDisplayed > 2}
                    /> */}
                    {/* <PianoPlayer
                        endAllGames={endAllGames}
                        isAnotherGameOver={isAnotherGameOver}
                        isSmallScreen={false}
                    /> */}
                    {/* <TokyoDrift
                        endAllGames={endAllGames}
                        isAnotherGameOver={isAnotherGameOver}
                        isSmallScreen={gamesDisplayed > 2}
                    /> */}
                    <PatternCopier
                        endAllGames={endAllGames}
                        isAnotherGameOver={isAnotherGameOver}
                        isSmallScreen={gamesDisplayed > 2}
                        displayNextGame={() => setGamesDisplayed(count => count + 1)}
                    />
                </motion.div>
                {gamesDisplayed > 1 &&
                    <motion.div
                        className="w-0"
                        animate={gamesDisplayed > 1 ? WIDTH_ANIMATION : ''}
                    >
                        <Skateboarder
                            endAllGames={endAllGames}
                            isAnotherGameOver={isAnotherGameOver}
                            isSmallScreen={gamesDisplayed > 2}
                        />
                    </motion.div>}
            </motion.div>
            <motion.div
                className="flex flex-row justify-between w-full h-0"
                animate={gamesDisplayed > 2 ? HEIGHT_ANIMATION : ''}
                data-type="bottom-game-container"
            >
                {
                    gamesDisplayed > 2 &&
                    <motion.div
                        className="w-full h-full"
                        animate={gamesDisplayed > 3 ? WIDTH_ANIMATION : ''}
                    >
                        <PianoPlayer
                            endAllGames={endAllGames}
                            isAnotherGameOver={isAnotherGameOver}
                            isSmallScreen={gamesDisplayed > 3}
                        />
                    </motion.div>
                }
                {
                    gamesDisplayed > 3 &&
                    <motion.div
                        className="w-0"
                        animate={WIDTH_ANIMATION}
                    >
                        <TokyoDrift
                            endAllGames={endAllGames}
                            isAnotherGameOver={isAnotherGameOver}
                            isSmallScreen={gamesDisplayed > 3}
                        />
                    </motion.div>
                }
            </motion.div>
        </div >
    );
}

export default GameScreen;
