import React, { Component } from 'react'
import './css/tailwind.css'
import './App.css'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'

import Navigation from './components/Navigation'
import Breadcrumb from './components/Breadcrumb'
import Ambitions from './components/Ambitions'
import Login from './components/Login'

import AuthService from './components/Auth'
import withAuth from './components/WithAuth'

// const Auth = new AuthService();



class App extends Component {
  render() {
    return (
      <main className="bg-grey-lighter pb-16 min-h-screen">
        <Navigation  />
        <Breadcrumb />
        <Switch>
          <Route path="/ambities" component={withAuth(Ambitions)} />
          <Route path="/login" component={withRouter(Login)} history={this.props.history} />
          <Route exact path="/" component={() => (<Redirect to="/ambities"/>)}/>
        </Switch>
      </main>
    );
  }
}

export default withRouter(withAuth(App));