import { WebSocketLink } from '@apollo/client/link/ws';
import apolloConfig from './config';

const wsLink = new WebSocketLink({
  uri: apolloConfig.WS_URL,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('token'),
    },
  },
});

export default wsLink;
