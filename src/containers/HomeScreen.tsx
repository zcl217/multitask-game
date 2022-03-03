import { motion, useCycle } from "framer-motion";
import AudioControl from "../components/AudioControl";
import Leaderboard from "../components/LeaderBoard";
import LoginModule from "../components/LoginModule";
import MenuButton from "../components/MenuButton";



interface HomeScreenProps {
    onStart: () => void
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
    const { onStart } = props;
    const [isLeaderboardOpen, toggleLeaderboardOpen] = useCycle(false, true);
    const [isLoginOpen, toggleLoginOpen] = useCycle(false, true);

    return (
        <div className="flex flex-col justify-around w-full h-full text-center menu-background">
            <span className="mb-20 font-extrabold text-7xl">
                Multitask 333
            </span>
            <AudioControl isInGame={false} />
            <div>
                <div className="flex flex-col items-center text-3xl" >
                    {/* this is obviously just for testing purposes, make a dedicated login button later */}

                    <MenuButton
                        isButtonOpen={false}
                        toggleButtonOpen={()=>{}}
                        buttonName={"Start"}
                        positionFromTop="30%"
                        content={<div> test </div>}
                    />
                    <MenuButton
                        isButtonOpen={isLoginOpen}
                        toggleButtonOpen={toggleLoginOpen}
                        buttonName={"Leaderboard"}
                        positionFromTop="50%"
                        content={<div> asdf </div>}
                    />
                    
                    <MenuButton
                        isButtonOpen={isLeaderboardOpen}
                        toggleButtonOpen={toggleLeaderboardOpen}
                        buttonName={"Login"}
                        positionFromTop="70%"
                        content={<div> test </div>}
                    />
                </div>
            </div>

            <Leaderboard />
            <LoginModule />
        </div>

    );
}

export default HomeScreen;
