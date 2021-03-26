import { EventHandler, SyntheticEvent, useCallback, useState } from 'react';

type UseOAuthSignProps = {
  onError?: (error: any) => void;
  onComplete?: () => void;
  onCode: (code: string) => Promise<void>;
  redirectLink: string | (() => Promise<string>);
}

type StartHandler<K = any, E extends SyntheticEvent<K> = SyntheticEvent<K>> = EventHandler<E>;
type OAuthLoading = boolean;
type UseOAuthSignTuple = [
  StartHandler,
  OAuthLoading
];

const useOAuthSign = ({
  onError = console.error,
  onCode,
  onComplete,
  redirectLink,
}: UseOAuthSignProps): UseOAuthSignTuple => {
  const [loading, setLoading] = useState(false);

  const OAuthHandler: StartHandler = useCallback((e) => {
    const loginWindow = window.open('', 'OAuth')!;
    e?.preventDefault();
    setLoading(true);

    (async () => {
      async function authHandler(this: Window, event: MessageEvent) {
        // 'this' = children window
        if (/^react-devtools/gi.test(event?.data?.source)) {
          return;
        }

        const code = event.data?.payload?.code;

        if (code) {
          // eslint-disable-next-line react/no-this-in-sfc
          this.close();
          window.removeEventListener('message', authHandler);

          try {
            await onCode(code);
          } catch (error) {
            onError(error);
            throw error;
          } finally {
            setLoading(false);
            if (onComplete) {
              onComplete();
            }
          }
        }
      }

      try {
        loginWindow.location.href = typeof redirectLink === 'string' ? redirectLink : await redirectLink();
        window.addEventListener('message', authHandler.bind(loginWindow));
      } catch (error) {
        onError(error);
        throw error;
      }
    })();
  }, [setLoading, onError, onCode, redirectLink, onComplete]);

  return [
    OAuthHandler,
    loading,
  ];
};

export default useOAuthSign;
