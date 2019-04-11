import React, { Component } from 'react';
// import logo from './logo.svg';
import './css/tailwind.css';
import './App.css';

import { Route, Switch, Redirect } from 'react-router-dom';

import Navigation from './components/Navigation';
import Breadcrumb from './components/Breadcrumb';
import Ambitions from './components/Ambitions';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <main className="bg-grey-lighter pb-16 min-h-screen">
        <Navigation />
        <Breadcrumb />
        <Switch>
          <Route path="/ambities" component={Ambitions} />
          <Route path="/login" component={Login} />
          <Route path="/" component={() => (<Redirect to="/ambities"/>)}/>
        </Switch>
      </main>
    );
  }
}

export default App;