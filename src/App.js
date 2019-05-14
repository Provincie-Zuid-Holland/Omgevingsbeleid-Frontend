import React, { Component } from 'react'
import './css/tailwind.css'
import './App.css'
import { Route, Switch, withRouter } from 'react-router-dom'

import Navigation from './components/Navigation'
import Breadcrumb from './components/Breadcrumb'
import Ambitions from './components/ambitions/Ambitions'
import Opgaven from './components/opgaven/Opgaven'
import Login from './components/Login'
import Home from './components/Home'

import withAuth from './components/WithAuth'

// const Auth = new AuthService();



class App extends Component {
  render() {
    return (
      <main className="bg-grey-lighter pb-8 min-h-screen">
        <Navigation  />
        <Switch>
          <Route path="/ambities" component={withAuth(Ambitions)} />
          <Route path="/opgaven" component={withAuth(Opgaven)} />
          <Route path="/login" component={withRouter(Login)} history={this.props.history} />
          <Route exact path="/" component={withAuth(Home)}/>
        </Switch>
      </main>
    );
  }
}

export default withRouter(withAuth(App));