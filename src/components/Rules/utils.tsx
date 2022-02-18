import React, { FC } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { BlockTypes, useRulesContext } from './context';

import s from './Rules.module.sass';

export const NavButton: FC<{ to: BlockTypes }> = ({
  children,
  to,
}) => {
  const { setBlock } = useRulesContext();
  return (
    <Button type="link" className={s.navButton} onClick={() => setBlock(to)}>{children}</Button>
  );
};

export const BackButton: FC = () => {
  const { backBlock, history } = useRulesContext();
  if (!history) return null;
  return (
    <Button type="link" className={s.navButton} onClick={() => backBlock()}><ArrowLeftOutlined /> Назад</Button>
  );
};
