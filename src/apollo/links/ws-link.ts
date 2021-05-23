import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import apolloConfig from './config';

const client = new SubscriptionClient(apolloConfig.WS_URL, {
  reconnect: true,
  connectionParams: {
    authToken: localStorage.getItem('token'),
  },
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
