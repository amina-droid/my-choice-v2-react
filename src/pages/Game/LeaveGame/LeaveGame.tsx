import React, { FC } from 'react';
import { Tooltip } from 'antd';
import cn from 'classnames';
import { ReactComponent as LeaveGameBtn } from './Leave.svg';

import s from './LeaveGame.module.sass';

type LeaveGameProps = {
  className?: string;
  iconClass?: string;
};

const LeaveGame: FC<LeaveGameProps> = ({ className, iconClass }) => {
  return (
    <Tooltip title="Покинуть игру">
      <button type="button" className={cn(className, s.btn)}>
        <LeaveGameBtn className={iconClass} />
      </button>
    </Tooltip>
  );
};

export default LeaveGame;
