import React from 'react';
import Spin from 'antd/es/spin';

import { UserRole } from '../../types';

import { useAuth } from '../../context/auth';
import NotFound from '../../pages/NotFound/NotFound';

export const access = (currentRole: UserRole | undefined, accessedRoles: UserRole[]) => {
  switch (currentRole) {
  case UserRole.Admin:
    return true;
  case UserRole.Moderator:
    return accessedRoles.some(role => role === UserRole.Moderator || role === UserRole.User);
  case UserRole.User:
    return accessedRoles.some(role => role === UserRole.User);
  default:
    return false;
  }
};

export const withAccess = <T extends {}>(
  userRoles: UserRole[] = [UserRole.User],
  seeNotFound = false,
) => {
  return (WrappedComponent: React.ComponentType<T>) => {
    return (props: T) => {
      const { user, userLoad } = useAuth();
      if (userLoad) return <Spin size="large" />;
      return access(user?.role, userRoles)
        ? <WrappedComponent {...props} />
        : seeNotFound
          ? <NotFound />
          : null;
    };
  };
};
