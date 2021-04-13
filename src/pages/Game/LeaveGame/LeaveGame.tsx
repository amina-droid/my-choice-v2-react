import React, { FC } from 'react';
import { Tooltip } from 'antd';
import { ReactComponent as LeaveGameBtn } from './Leave.svg';

import s from './LeaveGame.module.sass';

type LeaveGameProps = {
  className: string;
};

const LeaveGame: FC<LeaveGameProps> = ({ className }) => {
  return (
    <Tooltip title="Покинуть игру">
      <button type="button" className={s.btn}>
        <LeaveGameBtn className={className} />
      </button>
    </Tooltip>
  );
};

export default LeaveGame;
