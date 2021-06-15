import { ApolloClient } from '@apollo/client/core/ApolloClient';
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache';
import { offsetLimitPagination } from '@apollo/client/utilities/policies/pagination';

import { PlayerPolicy } from './fragments/ActivePlayer';
import link from './links';

const client = new ApolloClient({
  link,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  cache: new InMemoryCache({
    possibleTypes: {
      Card: ['ChoiceCard', 'Incident', 'Opportunity'],
    },
    typePolicies: {
      Query: {
        fields: {
          messages: offsetLimitPagination(['topic']),
        },
      },
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

export default client;
