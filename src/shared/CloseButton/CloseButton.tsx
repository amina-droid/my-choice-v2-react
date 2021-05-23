import React, { FC } from 'react';
import cn from 'classnames';

import Button from 'antd/es/button';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';

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
