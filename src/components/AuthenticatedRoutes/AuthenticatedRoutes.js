import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import withAuth from './../WithAuth'

// Import Data Model voor conditioneel renderen van de pagina's
import dataModel from './../../dataModel/ApiModel.js'

// Import Components
import Navigation from './../Navigation'
import Login from './../Login'
import ApiTest from './../ApiTest'
import Dashboard from './../Dashboard'
import Maatregelen from './../Maatregelen'
import BeleidsRegels from './../Beleidsregels'
import Verordening from './../Verordening'
import APITestRoutes from './../APITest/APITestRoutes'
import APITestDetail from './../APITest/APITestDetail'
import APITestCRUD from './../APITest/APITestCRUD'

function AuthenticatedRoutes(props) {
    return (
        <React.Fragment>
            <Route path="/login" component={Login} />
            <Route
                path="/api-test/ambities"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.Ambitie}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route
                path="/api-test/opgaven"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.Opgaven}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route
                path="/api-test/beleidsregels"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.BeleidsRegel}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route
                path="/api-test/doelen"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.Doel}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route
                path="/api-test/provinciale-belangen"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.ProvincialeBelangen}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route
                path="/api-test/beleidsrelaties"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.BeleidsRelatie}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route
                path="/api-test/maatregelen"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.Maatregelen}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route
                path="/api-test/themas"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.Themas}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route
                path="/api-test/verordeningen"
                render={() => (
                    <APITestRoutes
                        apiTest={true}
                        dataModel={dataModel.Verordening}
                        hoofdOnderdeelSlug="api-test"
                        history={props.history}
                    />
                )}
            />
            <Route apiTest={true} path="/api-test" exact component={ApiTest} />

            {/* Beleids Pagina Routes */}
            <Route
                exact
                path={`/beleidsregels/${
                    dataModel.BeleidsRegel.variables.Create_New_Slug
                }`}
                render={({ match }) => (
                    <APITestCRUD
                        dataModel={dataModel.BeleidsRegel}
                        ApiEndpoint={
                            dataModel.BeleidsRegel.variables.Api_Endpoint
                        }
                        overzichtSlug={
                            dataModel.BeleidsRegel.variables.Overzicht_Slug
                        }
                        history={props.history}
                        match={match}
                    />
                )}
            />
            <Route
                exact
                path={`/beleidsregels/:single`}
                render={({ match }) => (
                    <APITestDetail
                        dataModel={dataModel.BeleidsRegel}
                        history={props.history}
                        match={match}
                        hoofdOnderdeelSlug="maatregelen"
                    />
                )}
            />
            <Route
                path="/beleidsregels"
                exact
                render={() => (
                    <BeleidsRegels
                        dataModel={dataModel.BeleidsRegel}
                        history={props.history}
                    />
                )}
            />

            {/* Maatregelen Pagina Routes */}
            <Route
                exact
                path={`/maatregelen/${
                    dataModel.Maatregelen.variables.Create_New_Slug
                }`}
                render={({ match }) => (
                    <APITestCRUD
                        dataModel={dataModel.Maatregelen}
                        ApiEndpoint={
                            dataModel.Maatregelen.variables.Api_Endpoint
                        }
                        overzichtSlug={
                            dataModel.Maatregelen.variables.Overzicht_Slug
                        }
                        history={props.history}
                        match={match}
                    />
                )}
            />
            <Route
                exact
                path={`/maatregelen/edit/:single`}
                render={({ match }) => (
                    <APITestCRUD
                        dataModel={dataModel.Maatregelen}
                        ApiEndpoint={
                            dataModel.Maatregelen.variables.Api_Endpoint
                        }
                        overzichtSlug={
                            dataModel.Maatregelen.variables.Overzicht_Slug
                        }
                        history={props.history}
                        match={match}
                    />
                )}
            />
            <Route
                exact
                path={`/maatregelen/:single/:version`}
                render={({ match }) => (
                    <APITestDetail
                        apiTest={false}
                        dataModel={dataModel.Maatregelen}
                        history={props.history}
                        match={match}
                        hoofdOnderdeelSlug="maatregelen"
                    />
                )}
            />
            <Route
                exact
                path={`/maatregelen/:single`}
                render={({ match }) => (
                    <APITestDetail
                        dataModel={dataModel.Maatregelen}
                        history={props.history}
                        match={match}
                        hoofdOnderdeelSlug="maatregelen"
                    />
                )}
            />
            <Route
                path="/maatregelen"
                exact
                render={() => (
                    <Maatregelen
                        dataModel={dataModel.Maatregelen}
                        history={props.history}
                    />
                )}
            />
            {/* Verordening Pagina Routes */}
            <Route
                path="/verordening"
                exact
                render={() => (
                    <Verordening
                        dataModel={dataModel.Verordening}
                        history={props.history}
                    />
                )}
            />
            <Route exact path="/dashboard" component={Dashboard} />
        </React.Fragment>
    )
}

export default withAuth(AuthenticatedRoutes)
