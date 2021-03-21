import React, { FC } from 'react';
import { ReactComponent as LeaveGameBtn } from './Leave.svg';

import s from './LeaveGame.module.sass';

type LeaveGameProps = {
  className: string;
};

const LeaveGame: FC<LeaveGameProps> = ({ className }) => {
  return (
    <button type="button" className={s.btn}>
      <LeaveGameBtn className={className} />
    </button>
  );
};

export default LeaveGame;
