import { client, REFRESH_TOKENS, RefreshTokens, RefreshTokensVariables } from '../../apollo';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

export type Tokens = {
  access: string;
  refresh: string;
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN) || '';
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN) || '';
}

function getTokens() {
  return ({
    access: getAccessToken(),
    refresh: getRefreshToken(),
  });
}

function clearTokens(reload: boolean = false) {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);

  document.dispatchEvent(new CustomEvent<null>('token:update', {
    detail: null,
  }));

  if (reload) {
    window.location.reload();
  }
}

function setTokens(tokens: Tokens, reload: boolean = false) {
  localStorage.setItem(ACCESS_TOKEN, tokens.access);
  localStorage.setItem(REFRESH_TOKEN, tokens.refresh);

  document.dispatchEvent(new CustomEvent<Tokens>('token:update', {
    detail: tokens,
  }));

  if (reload) {
    window.location.reload();
  }
}

async function getNewTokens() {
  const tokens = getTokens();

  try {
    const response = await client.mutate<RefreshTokens, RefreshTokensVariables>({
      mutation: REFRESH_TOKENS,
      variables: tokens,
    });
    if (!response.data?.refreshTokens) {
      throw new Error('NOT TOKENS!');
    }
    setTokens(response.data?.refreshTokens);
    return response.data?.refreshTokens;
  } catch (e) {
    clearTokens(true);
    throw new Error('NOT TOKENS!');
  }
}

export default {
  clear: clearTokens,
  set: setTokens,
  get: getTokens,
  refresh: getNewTokens,
  getAccessToken,
  getRefreshToken,
};
