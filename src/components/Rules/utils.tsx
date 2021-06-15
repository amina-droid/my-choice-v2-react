import React, { FC } from 'react';
import { Button } from 'antd';

import { BlockTypes, useRulesContext } from './context';

import s from './Rules.module.sass';

export const NavButton: FC<{ to?: BlockTypes }> = ({
  children,
  to,
}) => {
  const { setBlock } = useRulesContext();
  return (
    <Button type="link" className={s.navButton} onClick={() => setBlock(to)}>{children}</Button>
  );
};
