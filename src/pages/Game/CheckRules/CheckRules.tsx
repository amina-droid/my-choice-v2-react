import React, { FC } from 'react';
import { Tooltip } from 'antd';

import { ReactComponent as RulesBtn } from './rules.svg';

import s from './CheckRules.module.sass';

type Props = {
  className?: string;
  onClick?: () => void;
}

const CheckRules: FC<Props> = ({ className, onClick }) => {
  return (
    <Tooltip title="Правила">
      <button type="button" className={s.btn} onClick={onClick}>
        <RulesBtn className={className} />
      </button>
    </Tooltip>
  );
};

export default CheckRules;
