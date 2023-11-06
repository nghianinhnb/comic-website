import UserHelper from 'general/helpers/UserHelper';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';


function GuestRoute(props) {
  const isAuth = UserHelper.checkAccessTokenValid();;

  return isAuth
    ? <Redirect to='/' />
    : <Route {...props} />
}

export default GuestRoute;
