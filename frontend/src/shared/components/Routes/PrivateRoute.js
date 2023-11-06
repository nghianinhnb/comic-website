import UserHelper from 'general/helpers/UserHelper';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute(props) {
  const isAuth = UserHelper.checkAccessTokenValid();

  return isAuth ? <Route {...props} /> : <Redirect to="/dang-nhap" />;
}

export default PrivateRoute;
