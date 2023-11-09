import React from 'react';
import { Route, Redirect } from 'react-router-dom';


function GuestRoute(props) {
  const isAuth = false;

  return isAuth
    ? <Redirect to='/' />
    : <Route {...props} />
}

export default GuestRoute;
