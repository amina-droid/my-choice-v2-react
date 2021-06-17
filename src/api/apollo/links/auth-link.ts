import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ApolloLink, Observable } from '@apollo/client';

import Token from 'utils/token';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Token.getAccessToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token || undefined,
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let i = 0; i < graphQLErrors.length; i + 1) {
        const err = graphQLErrors[i];
        if (err.extensions?.exception.name === 'TokenExpiredError') {
          return new Observable(observer => {
            Token.refresh()
              .then(tokens => {
                if (!tokens) {
                  throw new Error('Unable to fetch new access token');
                }

                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    Authorization: tokens.access || undefined,
                  },
                }));
              })
              .then(() => {
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };

                forward(operation).subscribe(subscriber);
              })
              .catch(error => {
                observer.error(error);
              });
          });
        }
      }
    }

    return forward(operation);
  },
);

export default ApolloLink.from([errorLink, authLink]);
