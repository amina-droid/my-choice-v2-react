import React, { FC, lazy, Suspense } from 'react';
import Spin from 'antd/es/spin';
import { RulesProps } from './Rules';

export * from './context';

const RulesModal = lazy(() => import('./Rules'));
const LoadingRules: FC<RulesProps> = (props) => (
  <Suspense fallback={<Spin size="large" />}>
    <RulesModal {...props} />
  </Suspense>
);

export default LoadingRules;
