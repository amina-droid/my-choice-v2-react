import React from 'react';

import s from './Statistic.module.sass';
import { withPageAccess } from '../../shared/PageAccessHOC/PageAccessHOC';
import { UserRole } from '../../types';

const Statistic = () => {
  return (
    <div>
      <div>Statistic</div>
    </div>
  );
};

export default withPageAccess([UserRole.Admin])(Statistic);
