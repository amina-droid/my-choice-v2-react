import { useEffect, useRef } from 'react';
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
function useNotificationTimeout(
  key: string,
  timeoutMessage: string,
  description: string,
): UseNotificationTimeoutHandlers {
  const ref = useRef<NodeJS.Timeout>();

  return [
    () => {
      ref.current = addTimeout(key, timeoutMessage, description);
    },
    () => {
      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = undefined;
        notification.close(key);
      }
    },
  ];
}

export default useNotificationTimeout;
