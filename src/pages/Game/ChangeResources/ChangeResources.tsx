import React, { FC } from 'react';
import { ReactComponent as ChangerBtn } from '../changer.svg';

import s from './ChangeResources.module.sass';
import LeaveGame from '../LeaveGame/LeaveGame';

type ChangeResourcesProps = {
  className: string;
};

const ChangeResources: FC<ChangeResourcesProps> = ({ className }) => {
  return (
    <button type="button" className={s.btn}>
      <ChangerBtn className={className} />
    </button>
  );
};

export default ChangeResources;
