import React, { FC } from 'react';
import { Tooltip } from 'antd';
import { ReactComponent as ChangerBtn } from './changer.svg';

import s from './ChangeResources.module.sass';

type ChangeResourcesProps = {
  className: string;
};

const ChangeResources: FC<ChangeResourcesProps> = ({ className }) => {
  return (
    <Tooltip title="Обменять ресурсы">
      <button type="button" className={s.btn}>
        <ChangerBtn className={className} />
      </button>
    </Tooltip>
  );
};

export default ChangeResources;
