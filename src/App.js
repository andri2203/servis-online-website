import React from 'react';
import { Switch, Route } from "react-router-dom"


import pageRoutes from './router';
import Login from "./pages/auth"
import PrivateRoute from './router/privateRoute';
import Cetak from './pages/Cetak';
import Page404 from './pages/404';


const App = function () {

  return (
    <Switch>
      {pageRoutes.map((data, i) => {
        return <PrivateRoute key={i} index={i} exact path={data.path} component={data.component} />
      })}
      <Route exact path='/login' component={Login} />
      <Route exact path='/cetak/:bulan' component={Cetak} />
      <Route path="" component={Page404} />
    </Switch>
  );
}

export default App;
