import { useState } from "react";
import HomeScreen from './containers/HomeScreen';
import GameScreen from './containers/GameScreen';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';

const createApolloClient = (authToken: string) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://multitask-333.hasura.app/v1/graphql',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }),
    cache: new InMemoryCache(),
  });
};

const App: React.FC = ({ idToken }: any) => {
  console.log('idTOken : ' + idToken);

  const [isInGame, setIsInGame] = useState(false);
  const [client] = useState(createApolloClient(idToken ? idToken : '123'));

  // TODO: homescreen will just lift up to reveal the game below
  // (like a curtain rising)
  // IMPORTANT TODO: get the min width and min height here working

  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
}

export default App;
