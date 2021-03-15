import React from 'react';
import { ReactComponent as ChangerBtn } from '../changer.svg';

import s from './ChangeResources.module.sass';

const ChangeResources = () => {
  return (
    <button type="button" className={s.btn}>
      <ChangerBtn />
    </button>
  );
};

export default ChangeResources;
