import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import LoginHomeScreen from './screens/LoginHomeScreen';

Auth.propTypes = {};

function Auth(props) {
  return (
    <Switch>
      <Route path="dang-nhap" element={<LoginHomeScreen />}></Route>
      <Route path="dang-ky" element={<LoginHomeScreen />}></Route>
    </Switch>
  );
}

export default Auth;
