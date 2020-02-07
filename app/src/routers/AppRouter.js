import React, { Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from '../components/Login/Login'

const AppRouter = () => (
  <BrowserRouter>
  <Fragment>
    <Route />
      <div className="main-content">
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    </Fragment>
    </BrowserRouter>
)

export default AppRouter