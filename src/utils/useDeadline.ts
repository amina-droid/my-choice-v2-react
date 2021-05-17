import moment, { MomentInput } from 'moment';
import { useMemo } from 'react';

const useDeadline = (time: MomentInput): string | undefined => {
  return useMemo(() => {
    if (!time) {
      return undefined;
    }

    return moment(time)
      .add(window.timeDiff, 'ms')
      .toISOString();
  }, [time]);
};

export default useDeadline;
