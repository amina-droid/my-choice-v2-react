import React from 'react';

import { withAccess } from '../../shared/AccessHOC/AccessHOC';
import { UserRole } from '../../types';

import s from './Statistic.module.sass';

const Statistic = () => {
  return (
    <div>
      <div>Statistic</div>
    </div>
  );
};

export default withAccess([UserRole.Admin], true)(Statistic);
