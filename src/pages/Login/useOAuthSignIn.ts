import { EventHandler, SyntheticEvent, useCallback, useState } from 'react';

type UseOAuthSignProps = {
  onError?: (error: any) => void;
  onComplete?: () => void;
  onCode: (code: string) => Promise<void>;
  redirectLink: string | (() => (Promise<string> | string));
}

type StartHandler<K = any, E extends SyntheticEvent<K> = SyntheticEvent<K>> = EventHandler<E>;
type OAuthLoading = boolean;
type UseOAuthSignTuple<Handler = StartHandler> = [
  Handler,
  OAuthLoading
];

const useOAuthSignIn = ({
  onError = console.error,
  onCode,
  onComplete,
  redirectLink,
}: UseOAuthSignProps) => {
  const [loading, setLoading] = useState(false);

  const OAuthHandler = useCallback(<T, E>(event?: SyntheticEvent<T, E>) => {
    const loginWindow = window.open('', 'OAuth')!;
    event?.preventDefault();
    setLoading(true);

    (async () => {
      async function authCodeListener(this: Window, e: MessageEvent) {
        // 'this' = children window
        if (/^react-devtools/gi.test(e?.data?.source)) {
          return;
        }

        const code = e.data?.payload?.code;

        if (code) {
          // eslint-disable-next-line react/no-this-in-sfc
          this.close();
          window.removeEventListener('message', authCodeListener);

          try {
            await onCode(code);
          } catch (error) {
            onError(error);
            throw error;
          } finally {
            setLoading(false);
            onComplete?.();
          }
        }
      }

      try {
        loginWindow.location.href = typeof redirectLink === 'string' ? redirectLink : await redirectLink();
        window.addEventListener('message', authCodeListener.bind(loginWindow));
      } catch (error) {
        onError(error);
        throw error;
      }
    })();
  }, [setLoading, onError, onCode, redirectLink, onComplete]);

  return [
    OAuthHandler,
    loading,
  ] as UseOAuthSignTuple<typeof OAuthHandler>;
};

export default useOAuthSignIn;
