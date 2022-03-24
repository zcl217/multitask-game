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

const createDefaultClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://multitask-333.hasura.app/v1/graphql',
    }),
    cache: new InMemoryCache(),
  });
};

const App: React.FC = () => {

  const { user, isAuthenticated } = useAuth0();
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  const [isInGame, setIsInGame] = useState(false);
  const [client, setClient] = useState(createDefaultClient());

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      // TODO: find out why getAccessTokenSilently returns the wrong token
      // const token = await getAccessTokenSilently({
      //   audience: 'https://multitask333-endpoint.com/api/'
      // });
      const tokenClaims = await getIdTokenClaims();
      setClient(createApolloClient(tokenClaims?.__raw || ''));
    })();
  }, [getAccessTokenSilently, isAuthenticated]);

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
