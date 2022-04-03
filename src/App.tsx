import { useEffect, useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import ScreenContainer from "./containers/ScreenContainer";

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
  const { isAuthenticated } = useAuth0();
  const { getIdTokenClaims } = useAuth0();
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
  }, [getIdTokenClaims, isAuthenticated]);

  return (
    <ApolloProvider client={client}>
      <ScreenContainer />
    </ApolloProvider>
  );
}

export default App;
