import React, { FC } from 'react';
import { Tooltip } from 'antd';

import { ReactComponent as RulesBtn } from './rules.svg';

type Props = {
  className?: string;
  iconClass?: string;
  onClick?: () => void;
}

const CheckRules: FC<Props> = ({ className, onClick, iconClass }) => {
  return (
    <Tooltip title="Правила">
      <button type="button" className={className} onClick={onClick}>
        <RulesBtn className={iconClass} />
      </button>
    </Tooltip>
  );
};

export default CheckRules;
