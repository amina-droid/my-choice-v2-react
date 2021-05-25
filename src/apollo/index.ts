import { ApolloClient, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { PlayerPolicy } from './fragments';
import link from './links';

export * from './queries';
export * from './mutations';
export * from './subscriptions';
export * from './fragments';

export const client = new ApolloClient({
  link,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  cache: new InMemoryCache({
    possibleTypes: {
      Card: ['ChoiceCard', 'Incident', 'Opportunity'],
    },
    typePolicies: {
      Player: PlayerPolicy,
    },
  }),
  connectToDevTools: process.env.NODE_ENV !== 'production',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
