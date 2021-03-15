import React from 'react';
import { ReactComponent as LeaveGameBtn } from './leave.svg';

import s from './LeaveGame.module.sass';

const LeaveGame = () => {
  return (
    <button type="button" className={s.btn}>
      <LeaveGameBtn />
    </button>
  );
};

export default LeaveGame;
