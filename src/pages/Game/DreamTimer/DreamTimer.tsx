import React, { FC } from 'react';

import { Statistic } from 'antd';

import useDeadline from 'utils/useDeadline';

import s from './DreamTimer.module.sass';

type Props = {
  serverTimer?: string| null
  className?: string;
}

const DreamTimer: FC<Props> = ({ serverTimer }) => {
  const deadline = useDeadline(serverTimer);
  return (
    <div>
      {serverTimer && <Statistic.Countdown
        className={s.dreamContainer}
        value={deadline}
        title="Выбор мечты"
        format="mm:ss"
      />}
    </div>
  );
};

export default DreamTimer;
