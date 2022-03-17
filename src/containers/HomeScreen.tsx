import { motion, useCycle } from "framer-motion";
import AudioControl from "../components/AudioControl";
import Leaderboard from "../components/LeaderBoard";
import LoginModule from "../components/UserInfoModule";
import MenuButton from "../components/MenuButton";
import { useAuth0 } from "@auth0/auth0-react";

interface HomeScreenProps {
    onStart: () => void
}

// https://auth0.com/docs/quickstart/spa/react/01-login#add-login-to-your-application
// https://hasura.io/docs/latest/graphql/core/auth/authorization/basics.html#auth-basics

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
    const { onStart } = props;
    const { loginWithRedirect, logout, user, isAuthenticated, error } = useAuth0();
    const [isLeaderboardOpen, toggleLeaderboardOpen] = useCycle(false, true);
    const [isLoginOpen, toggleLoginOpen] = useCycle(false, true);
    console.log(isAuthenticated);
    console.log(user);
    console.log(error);

    return (
        <div className="flex flex-col justify-around w-full h-full text-center menu-background">
            <span className="mb-20 font-extrabold text-7xl">
                Multitask 333
            </span>
            <AudioControl isInGame={false} />
            <div className="absolute top-0">
                {error?.toString()}
            </div>
            <div>
                <div className="flex flex-col items-center text-3xl" >
                    {/* this is obviously just for testing purposes, make a dedicated login button later */}

                    <MenuButton
                        isButtonOpen={false}
                        handleButtonClick={() => { }}
                        buttonName={"Start"}
                        positionFromTop="30%"
                        content={<div> test </div>}
                    />

                    <MenuButton
                        isButtonOpen={isLoginOpen}
                        handleButtonClick={() => loginWithRedirect()}
                        buttonName={"Login"}
                        positionFromTop="50%"
                        content={<LoginModule />}
                    />
                    <MenuButton
                        isButtonOpen={isLeaderboardOpen}
                        handleButtonClick={toggleLeaderboardOpen}
                        buttonName={"Leaderboard"}
                        positionFromTop="70%"
                        content={ <Leaderboard />}
                    />

                </div>
            </div>

            <Leaderboard />
        </div>

    );
}

export default HomeScreen;
