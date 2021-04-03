import { useCallback, useEffect, useMemo, useRef } from 'react';
import { notification } from 'antd';

const addTimeout = (key: string, timeoutMessage: string, description: string) => {
  return setTimeout(() => {
    notification.info({
      key,
      message: timeoutMessage,
      description,
      duration: 0,
    });
  }, 3000);
};
type CallNotification = () => void;
type ClearNotification = () => void;
type UseNotificationTimeoutHandlers = [CallNotification, ClearNotification];
type Options = {
  key: string,
  timeoutMessage: string,
  description: string,
}
function useNotificationTimeout({
  key,
  timeoutMessage,
  description,
}: Options): UseNotificationTimeoutHandlers {
  const ref = useRef<NodeJS.Timeout>();
  const clearNotification = useCallback(() => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = undefined;
      notification.close(key);
    }
  }, [key]);

  useEffect(() => clearNotification, [clearNotification]);

  return useMemo(() => ([
    () => {
      ref.current = addTimeout(key, timeoutMessage, description);
    },
    clearNotification,
  ]), [key, timeoutMessage, description, clearNotification]);
}

export default useNotificationTimeout;
