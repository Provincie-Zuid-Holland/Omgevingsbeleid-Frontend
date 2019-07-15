import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import withAuth from './components/WithAuth'

// Import Styling
import './css/tailwind.css'
import './css/styles.scss'

// Import Components
import Navigation from './components/Navigation'
import Login from './components/Login'
import ApiTest from './components/ApiTest'
import Dashboard from './components/Dashboard'
import Maatregelen from './components/Maatregelen'
import Verordening from './components/Verordening'
import APITestRoutes from './components/APITest/APITestRoutes'
import APITestDetail from './components/APITest/APITestDetail'
import APITestCRUD from './components/APITest/APITestCRUD'

// Import Notification Library
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import Data Model voor conditioneel renderen van de pagina's
import dataModel from './dataModel/ApiModel.js'


class App extends Component {

  render() {
    return (
      <main className="body-bg-color min-h-screen pt-12" id="main-container">
        <Navigation  />
        <Switch>
          <Route 
            path="/login" 
            component={Login}
          />
          <Route 
            path="/api-test/ambities" 
            render={() => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.Ambitie}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />}
          />
          <Route 
            path="/api-test/opgaven"
            render={ () => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.Opgaven}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          <Route 
            path="/api-test/beleidsregels"
            render={ () => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.BeleidsRegel}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          <Route 
            path="/api-test/doelen"
            render={ () => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.Doel}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          <Route 
            path="/api-test/provinciale-belangen"
            render={ () => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.ProvincialeBelangen}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          <Route 
            path="/api-test/beleidsrelaties"
            render={ () =>
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.BeleidsRelatie}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          <Route 
            path="/api-test/maatregelen"
            render={ () => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.Maatregelen}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          <Route 
            path="/api-test/themas"
            render={ () => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.Themas}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          <Route 
            path="/api-test/verordeningen"
            render={ () => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.Verordening}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          <Route 
            apiTest={true}
            path="/api-test"
            exact
            component={ApiTest} 
          />
          <Route 
            path="/api-test/maatregelen"
            render={ () => 
            <APITestRoutes
              apiTest={true}
              dataModel={dataModel.Maatregelen}
              hoofdOnderdeelSlug="api-test"
              history={this.props.history}
            />} 
          />
          {/* Maatregelen Pagina Routes */}
          <Route 
            exact 
            path={`/maatregelen/${dataModel.Maatregelen.variables.Create_New_Slug}`} 
						render={ ({match}) => <APITestCRUD 
							dataModel={dataModel.Maatregelen}
							ApiEndpoint={dataModel.Maatregelen.variables.Api_Endpoint} 
							overzichtSlug={dataModel.Maatregelen.variables.Overzicht_Slug} 
							history={this.props.history} 
							match={match}/> 
						} 
					/>
          <Route 
            exact 
            path={`/maatregelen/:single`} 
						render={ ({match}) =>
              <APITestDetail 
                dataModel={dataModel.Maatregelen} 
                history={this.props.history} 
                match={match}
                hoofdOnderdeelSlug="maatregelen"
              /> 
						}
					/>
          <Route 
            path="/maatregelen"
            exact
            render={ () => 
              <Maatregelen
                dataModel={dataModel.Maatregelen}
                history={this.props.history}
              />} 
          />
          <Route 
            path="/verordening"
            exact
            render={ () => 
              <Verordening
                dataModel={dataModel.Verordening}
                history={this.props.history}
              />} 
          />
          <Route exact path="/" component={Dashboard}/>
        </Switch>
        <ToastContainer />
      </main>
    );
  }

}

export default withRouter(withAuth(App))