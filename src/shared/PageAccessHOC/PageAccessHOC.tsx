import React, { useContext } from 'react';
import { UserRole } from '../../types';

import { AuthContext } from '../../context/auth';
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

export const withPageAccess = <T extends {}>(userRoles: UserRole[] = [UserRole.User]) => {
  return (WrappedComponent: React.ComponentType<T>) => {
    return (props: T) => {
      const { user } = useContext(AuthContext);

      return access(user?.role, userRoles) ? <WrappedComponent {...props} /> : <NotFound />;
    };
  };
};
