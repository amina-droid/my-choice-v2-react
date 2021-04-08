import React, { FC, lazy, Suspense } from 'react';
import { Spin } from 'antd';
import { RulesProps } from './Rules';

export * from './context';

const RulesModal = lazy(() => import('./Rules'));
const LoadingRules: FC<RulesProps> = (props) => (
  <Suspense fallback={<Spin size="large" />}>
    <RulesModal {...props} />
  </Suspense>
);

export default LoadingRules;
