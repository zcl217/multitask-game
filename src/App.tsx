import { useState } from "react";
import HomeScreen from './containers/HomeScreen';
import GameScreen from './containers/GameScreen';


const App: React.FC = () => {

  const [isInGame, setIsInGame] = useState(true);

  return (
    <div className="w-screen h-screen min-w-[800px] min-h-[500px] overflow-x-auto">
      {isInGame ?
        <GameScreen
          hideGameScreen={() => setIsInGame(false)}
        /> :
        <HomeScreen
          onStart={() => setIsInGame(true)}
        />
      }

    </div>
  );
}

export default App;
