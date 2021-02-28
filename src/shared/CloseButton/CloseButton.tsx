import React, { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import cn from 'classnames';

import s from './CloseButton.module.sass';

type CloseButtonProps = {
  onClose: () => void;
  className: string;
};

const CloseButton: FC<CloseButtonProps> = ({ onClose, className }) => {
  return (
    <Button icon={<CloseOutlined />} className={cn(className, s.closeBtn)} onClick={onClose} />
  );
};

export default CloseButton;
