import moment, { MomentInput } from 'moment';
import { isNil } from 'lodash';
import { useMemo } from 'react';

const useDeadline = (time: MomentInput): string | undefined => {
  return useMemo(() => isNil(time) ? undefined : moment(time)
    .add(window.timeDiff, 'ms')
    .toISOString(), [time])
};

export default useDeadline;
