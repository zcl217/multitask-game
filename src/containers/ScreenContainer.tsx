import { useEffect, useState } from "react";
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';
import { motion } from "framer-motion";
import { getTopAnimation } from "../constants/animations/CommonAnimations";

const ScreenContainer: React.FC = () => {
    const [isInGame, setIsInGame] = useState(false);
    const [displayGameScreen, setDisplayGameScreen] = useState(false);

    useEffect(() => {
        if (isInGame) setTimeout(() => {
            setIsInGame(false);
            setTimeout(() => {
                setDisplayGameScreen(false);
            }, 1000);
        }, 5000);
    }, [isInGame])
    const handleStart = () => {
        setIsInGame(true);
        setDisplayGameScreen(true);
    }
    // TODO: if loading, then show a spinner
    // TODO: disable buttons based on in the isInGameProp
    return (
        <div className="w-screen h-screen min-w-[800px] min-h-[600px] relative overflow-x-auto overflow-y-hidden">
            <motion.div
                className="absolute w-full h-full"
                animate={isInGame ? getTopAnimation(-100) : getTopAnimation(0)}
            >
                <HomeScreen
                    onStart={handleStart}
                // isInGame={isInGame}
                />
            </motion.div>
            {displayGameScreen &&
                <motion.div
                    className="absolute w-full h-full top-[100vh]"
                    animate={isInGame ? getTopAnimation(0) : getTopAnimation(100)}
                >
                    <GameScreen
                        hideGameScreen={() => setIsInGame(false)}
                    // isInGame={isInGame}
                    />
                </motion.div>
            }

        </div>
    );
}

export default ScreenContainer;