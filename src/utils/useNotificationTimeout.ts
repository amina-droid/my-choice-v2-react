import { useCallback, useEffect, useMemo, useRef } from 'react';
import { notification } from 'antd';

type NotificationType = 'info' | 'warning' | 'error' | 'success';

const addTimeout = (
  key: string,
  timeoutMessage: string,
  description: string,
  type: NotificationType = 'info',
  timeout: number = 3000,
) => {
  return setTimeout(() => {
    notification[type]({
      key,
      message: timeoutMessage,
      description,
      duration: 0,
    });
  }, timeout);
};
type CallNotification = () => void;
type ClearNotification = () => void;
type UseNotificationTimeoutHandlers = [CallNotification, ClearNotification];
type Options = {
  key: string,
  timeoutMessage: string,
  description: string,
  type?: NotificationType,
  timeout?: number;
}
function useNotificationTimeout({
  key,
  timeoutMessage,
  description,
  type,
  timeout,
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
      ref.current = addTimeout(key, timeoutMessage, description, type, timeout);
    },
    clearNotification,
  ]), [key, timeoutMessage, description, clearNotification, type, timeout]);
}

export default useNotificationTimeout;
