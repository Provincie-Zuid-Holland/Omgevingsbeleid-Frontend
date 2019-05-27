import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import './css/tailwind.css'
import './css/styles.scss'

import Navigation from './components/Navigation'
import Opgaven from './components/opgaven/Opgaven'
import Login from './components/Login'
import Home from './components/Home'

import APITestRoutes from './components/APITest/APITestRoutes'

import withAuth from './components/WithAuth'

// Field model geeft aan welke data de view en edit page verwachten
import dataModel from './dataModel/ApiModel.js'


class App extends Component {

  render() {
    return (
      <main className="bg-gray-100 min-h-screen pt-12" id="main-container">
        <Navigation  />
        <Switch>
          <Route 
            path="/ambities" 
            render={() => <APITestRoutes 
            dataModel={dataModel.Ambitie}
            history={this.props.history}
          />} />
          <Route path="/opgaven" component={Opgaven} />
          <Route path="/login" component={Login} history={this.props.history} />
          <Route exact path="/" component={Home}/>
        </Switch>
      </main>
    );
  }
}

export default withRouter(withAuth(App));