import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, useRouteMatch } from 'react-router';
import DashboardHomeScreen from './screens/DashboardHomeScreen';

Dashboard.propTypes = {};

function Dashboard(props) {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={DashboardHomeScreen} />
    </Switch>
  );
}

export default Dashboard;
