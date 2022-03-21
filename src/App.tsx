import { useEffect, useState } from "react";
import HomeScreen from './containers/HomeScreen';
import GameScreen from './containers/GameScreen';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';

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

const App: React.FC = () => {

  const { user, isAuthenticated } = useAuth0();
  console.log('is authenticated ' + isAuthenticated);
  console.log('token: ' + user?.sub);
  const { getAccessTokenSilently } = useAuth0();
  const [isInGame, setIsInGame] = useState(false);
  const [client, setClient] = useState({} as any);

  useEffect(() => {
    // i dont think this is right, because we don't always want to have a token
    // (Ex. in the case of anonymous user, there's no need to log in/have auth tokens)
    /*
      so my shower thought was to have two ApolloProviders (one for authorized users
        and one for anonymous users), but now that I look at it, why can't we just
        have an undefined authtoken or something? would an error come from that?
        I guess my task is to just understand what the authtoken is actually
        being used for)
    */
    if (!isAuthenticated) return;
    (async () => {
      const token = await getAccessTokenSilently({
        audience: 'https://multitask333-endpoint.com/api/'
      });
      setClient(createApolloClient(token));
    })();
  }, [getAccessTokenSilently, isAuthenticated]);


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
