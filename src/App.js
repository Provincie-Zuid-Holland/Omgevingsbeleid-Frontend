import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import './css/tailwind.css'
import './css/styles.scss'

import Navigation from './components/Navigation'
import TerugNaarOverzicht from './components/TerugNaarOverzicht'
import Ambitions from './components/ambitions/Ambitions'
import Opgaven from './components/opgaven/Opgaven'
import Login from './components/Login'
import Home from './components/Home'

import withAuth from './components/WithAuth'

// const Auth = new AuthService();



class App extends Component {
  render() {
    return (
      <main className="bg-gray-100 min-h-screen pt-12" id="main-container">
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