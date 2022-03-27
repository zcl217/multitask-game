import { motion, useCycle } from "framer-motion";
import AudioControl from "../components/AudioControl";
import Leaderboard from "../components/LeaderBoard";
import MenuButton from "../components/MenuButton";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileModule from "../components/ProfileModule";

interface HomeScreenProps {
    isInGame: boolean,
    onStart: () => void,
    username: string,
    highscore: number
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
    const { onStart, isInGame, username, highscore } = props;
    const { loginWithRedirect, isLoading, isAuthenticated, error } = useAuth0();
    const [isLeaderboardOpen, toggleLeaderboardOpen] = useCycle(false, true);
    const [isProfileOpen, toggleProfileOpen] = useCycle(false, true);

    return (
        <div className={`flex flex-col w-full h-full text-center menu-background ${isInGame ? 'pointer-events-none' : ''}`}>
            <div className="absolute flex justify-center w-full text-3xl text-red-600 bottom-10">
                {error?.toString() !== 'Error: Invalid state' && error?.toString()}
            </div>
            <div className="relative top-0 flex flex-col items-center w-full h-full text-3xl" >
                <AudioControl isInGame={false} />
                <span className="my-20 font-extrabold text-7xl">
                    Multitask 333
                </span>
                <MenuButton
                    isButtonOpen={false}
                    isLoading={false}
                    handleButtonClick={() => onStart()}
                    buttonName={"Start"}
                    positionFromTop="30%"
                />
                {isAuthenticated ?
                    <MenuButton
                        isButtonOpen={isProfileOpen}
                        isLoading={false}
                        handleButtonClick={toggleProfileOpen}
                        buttonName={"Profile"}
                        positionFromTop="50%"
                        content={
                            <ProfileModule
                                initialUsername={username}
                                highscore={highscore}
                            />
                        }
                    /> :
                    <MenuButton
                        isButtonOpen={false}
                        isLoading={isLoading}
                        handleButtonClick={loginWithRedirect}
                        buttonName={"Login"}
                        positionFromTop="50%"
                    />
                }
                <MenuButton
                    isButtonOpen={isLeaderboardOpen}
                    isLoading={isLoading}
                    handleButtonClick={toggleLeaderboardOpen}
                    buttonName={"Leaderboard"}
                    positionFromTop="70%"
                    content={<Leaderboard isLeaderboardOpen={isLeaderboardOpen} />}
                />
            </div>
        </div>
    );
}

export default HomeScreen;