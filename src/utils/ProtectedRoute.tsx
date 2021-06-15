import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from 'context/auth';

const ProtectedRoute: FC<RouteProps> = ({ component: Component, ...rest }) => {
  const { token } = useAuth();

  return (
    <Route
      {...rest}
      render={
        // @ts-ignore
        props => (!token ? <Redirect to="/" /> : <Component {...props} />)
      }
    />
  );
};

export default ProtectedRoute;
