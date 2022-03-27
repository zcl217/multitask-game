import { useAuth0 } from '@auth0/auth0-react';

interface GameOverProps {
    finalScore: number,
    highscore: number
    onRetry: () => void,
    hideGameScreen: () => void,
}

const GameOver: React.FC<GameOverProps> = (props) => {
    const { finalScore, highscore, onRetry, hideGameScreen } = props;
    const { isAuthenticated } = useAuth0();

    return (
        <div className="absolute z-40 flex items-center justify-center w-full h-full bg-black/40">
            {/* modal border */}
            <div className="flex items-center justify-center w-3/4 h-3/4 bg-black/30">
                {/* modal content */}
                <div className="w-5/6 text-center h-5/6 menu-background">
                    <div className="flex flex-col justify-around h-full">
                        <div className="flex flex-col justify-around h-1/2">
                            <div className="flex flex-col">
                                <span className="min-font-size"> Final Score: {finalScore} </span>
                                {isAuthenticated &&
                                    <span className={`text-xl mt-4 ${finalScore <= highscore && 'invisible'}`}>
                                        * New high score *
                                    </span>
                                }
                            </div>
                            <span className="min-font-size">
                                {isAuthenticated ?
                                    `Current Best: ${Math.max(highscore, finalScore)}` :
                                    'Log in to save your score!'
                                }
                            </span>

                        </div>
                        <div className="flex flex-row justify-around">
                            <div
                                className="flex items-center justify-center text-3xl select-none menu-button-round"
                                onClick={onRetry}
                            > Retry </div>
                            <div
                                className="flex items-center justify-center text-3xl select-none menu-button-round"
                                onClick={hideGameScreen}
                            > Home </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default GameOver;