import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import apolloConfig from './config';
import Token from '../../utils/token';

const client = new SubscriptionClient(apolloConfig.WS_URL, {
  reconnect: true,
  connectionParams: () => ({
    authToken: Token.getAccessToken(),
  }),
});

client.onDisconnected(() => {
  console.log('onDisconnected');
});
client.onConnecting(() => {
  console.log('onConnecting');
});
client.onConnected(() => {
  console.log('onConnected');
});
client.onError(() => {
  console.log('onError');
});
client.onReconnected(() => {
  console.log('onReconnected');
});
client.onReconnecting(() => {
  console.log('onReconnecting');
});

const wsLink = new WebSocketLink(client);

export default wsLink;
