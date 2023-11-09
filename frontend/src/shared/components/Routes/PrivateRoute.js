import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute(props) {
  const isAuth = true;

  return isAuth ? <Route {...props} /> : <Redirect to="/dang-nhap" />;
}

export default PrivateRoute;
