import { useEffect, useState } from "react";

interface ScoreProps {
    isAnotherGameOver: boolean,
    handleSetScore: (score: number) => void
}

const Score: React.FC<ScoreProps> = (props) => {
    const { isAnotherGameOver, handleSetScore } = props;
    const [score, setScore] = useState(0);
    const [scoreInterval, setScoreInterval] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => setScore(score => score + 1), 1000);
        setScoreInterval(interval);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (isAnotherGameOver) {
            clearInterval(scoreInterval);
            handleSetScore(score);
        }
    }, [isAnotherGameOver, scoreInterval, handleSetScore, score]);

    return (
        <div className="absolute z-10 text-[5vw] w-full text-center">
            <div className="mx-auto">
                {score}
            </div>
        </div>
    );
}

export default Score;
