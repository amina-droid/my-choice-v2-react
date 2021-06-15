import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

import httpLink from './http-link';
import wsLink from './ws-link';
import authLink from './auth-link';

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const link = authLink.concat(splitLink);

export default link;
