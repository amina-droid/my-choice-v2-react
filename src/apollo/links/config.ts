const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'xn--72-9kcd8arods1i.xn--p1ai'
  // : 'sharp-cobra-53.loca.lt';
  : 'my-choice.loca.lt';

const HTTP_URL = `https://${BASE_URL}/graphql`;
const WS_URL = `wss://${BASE_URL}/graphql`;

export default {
  HTTP_URL,
  WS_URL,
};
