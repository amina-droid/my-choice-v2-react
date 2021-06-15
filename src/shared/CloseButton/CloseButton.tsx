import React, { FC } from 'react';
import cn from 'classnames';

import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import s from './CloseButton.module.sass';

type CloseButtonProps = {
  className: string;
  onClose?: () => void;
};

const CloseButton: FC<CloseButtonProps> = ({ onClose, className }) => {
  return (
    <Button icon={<CloseOutlined />} className={cn(className, s.closeBtn)} onClick={onClose} />
  );
};

export default CloseButton;
