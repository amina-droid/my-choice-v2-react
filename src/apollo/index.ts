import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

export * from './queries';
export * from './mutations';
export * from './subscriptions';

const GRAPHQL_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://api.finfest-tyumen.ru/graphql'
    : 'https://my-choice.loca.lt/graphql';

const WS_GRAPHQL_URL =
  process.env.NODE_ENV === 'production'
    ? 'ws://api.finfest-tyumen.ru/graphql'
    : 'wss://my-choice.loca.lt/graphql';

const wsLink = new WebSocketLink({
  uri: WS_GRAPHQL_URL,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('token'),
    },
  },
});

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? token : '',
    },
  };
});

const link = authLink.concat(splitLink);

export const client = new ApolloClient({
  link,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV !== 'production',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
