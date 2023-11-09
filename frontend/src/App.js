import React, { Suspense,  } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import GuestRoute from 'shared/components/Routes/GuestRoute';
import PrivateRoute from 'shared/components/Routes/PrivateRoute';

import Login from 'pages/Login';
import Signup from 'pages/Signup';

import AppToast from 'shared/components/AppToast';

import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Redirect exact from="/" to="/ban-lam-viec" />

          <GuestRoute path="/dang-nhap" component={Login} />
          <GuestRoute path="/dang-ky" component={Signup} />

          {/* <PrivateRoute path="/ban-lam-viec" component={Dashboard} /> */}

          <Route path="*" element={<div>404 not found</div>} />
        </Switch>
      </Suspense>

      <AppToast/>
    </>
  );
}

export default App;
