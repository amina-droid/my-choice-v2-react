import { ApolloLink, HttpLink } from '@apollo/client';
import apolloConfig from './config';

const httpLink = new HttpLink({
  uri: apolloConfig.HTTP_URL,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
});

const operationNameLink = new ApolloLink((operation, forward) => {
  const { operationName } = operation;

  operation.setContext({
    uri: `${apolloConfig.HTTP_URL}?__${operationName}__`,
  });

  return forward(operation);
});

const apolloLink = ApolloLink.from([operationNameLink, httpLink]);
export default apolloLink;
