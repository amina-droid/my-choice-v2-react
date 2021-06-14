import jwtDecode from 'jwt-decode';

import { client, REFRESH_TOKENS, RefreshTokens, RefreshTokensVariables } from '../../apollo';
import { CustomEventDict } from '../../types';
import { getTime } from '../getTime';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

const UPDATE_EVENT = 'token:update';
export type Tokens = {
  access: string;
  refresh: string;
}

export type UpdateEvent = CustomEventDict<typeof UPDATE_EVENT, Tokens | null, Token>;

class Token extends EventTarget {
  public decodedData: any;

  constructor(
    private readonly accessKey: string,
    private readonly refreshKey: string,
  ) {
    super();

    const token = this.getAccessToken();

    if (token) {
      this.decodedData = jwtDecode(token) as any;

      const isExpired = this.decodedData.exp < getTime() / 1000;

      if (isExpired) {
        this.refresh();
      }
    }
  }

  private dispatchTokenUpdate(detail: Tokens | null = null, reload: boolean = false) {
    this.dispatchEvent(new CustomEvent<Tokens | null>(UPDATE_EVENT, {
      detail,
    }));

    if (reload) {
      window.location.reload();
    }
  }

  getAccessToken() {
    return localStorage.getItem(this.accessKey) || '';
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshKey) || '';
  }

  get() {
    return ({
      access: this.getAccessToken(),
      refresh: this.getRefreshToken(),
    });
  }

  clear(reload: boolean = false) {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    this.dispatchTokenUpdate(null, reload);
  }

  set(tokens: Tokens, reload: boolean = false) {
    localStorage.setItem(ACCESS_TOKEN, tokens.access);
    localStorage.setItem(REFRESH_TOKEN, tokens.refresh);

    this.decodedData = jwtDecode(tokens.access) as any;

    this.dispatchTokenUpdate(tokens, reload);
  }

  async refresh() {
    const tokens = this.get();

    try {
      const response = await client.mutate<RefreshTokens, RefreshTokensVariables>({
        mutation: REFRESH_TOKENS,
        variables: tokens,
      });
      if (!response.data?.refreshTokens) {
        throw new Error('NOT TOKENS!');
      }
      this.set(response.data?.refreshTokens);
      return response.data?.refreshTokens;
    } catch (e) {
      this.clear(true);
      throw new Error('NOT TOKENS!');
    }
  }
}

export default new Token(ACCESS_TOKEN, REFRESH_TOKEN);
