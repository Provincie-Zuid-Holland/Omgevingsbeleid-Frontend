import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

// Import Data Model
import dataModel from './../dataModel'

// Import HTTP Client
import axios from './../../API/axios'

// Import Pages
import MuteerDashboard from './../../pages/MuteerDashboard'
import MuteerMaatregelen from './../../pages/MuteerMaatregelen'
import MuteerBeleidsbeslissingen from './../../pages/MuteerBeleidsbeslissingen'
import MuteerBeleidsRegels from './../../pages/MuteerBeleidsRegels'
import MuteerVerordening from './../../pages/MuteerVerordening'
import MuteerApiTest from './../../pages/MuteerApiTest'
import MuteerUniversalObjectDetail from './../../pages/MuteerUniversalObjectDetail'
import MuteerUniversalObjectCRUD from './../../pages/MuteerUniversalObjectCRUD'
import MuteerApiTestOverzicht from './../../pages/MuteerApiTestOverzicht'

// Import Components
import AuthenticationWrapper from './../../components/AuthenticationWrapper'

// This component renders the appropriate view to the the object in the DataModel
// This component is rendered with the following URL /api-test/${object} in AuthRoutes
function APITestRoutes(props) {
    // The dataModel prop consists of the specified Object from the datamodel (e.g. dataModel.Ambitie)
    // Based on this we declare the variables
    const overzichtSlug = props.dataModel.variables.Overzicht_Slug
    const ApiEndpoint = props.dataModel.variables.Api_Endpoint
    const createNewSlug = props.dataModel.variables.Create_New_Slug
    const hoofdOnderdeelSlug = props.hoofdOnderdeelSlug
    const apiTest = props.apiTest

    return (
        <div>
            <Switch>
                <Route
                    exact
                    path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/${createNewSlug}`}
                    render={({ match }) => (
                        <MuteerUniversalObjectCRUD
                            dataModel={props.dataModel}
                            ApiEndpoint={ApiEndpoint}
                            overzichtSlug={overzichtSlug}
                            history={props.history}
                            match={match}
                        />
                    )}
                />
                <Route
                    exact
                    path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/edit/:single`}
                    render={({ match }) => (
                        <MuteerUniversalObjectCRUD
                            dataModel={props.dataModel}
                            ApiEndpoint={ApiEndpoint}
                            overzichtSlug={overzichtSlug}
                            history={props.history}
                            match={match}
                        />
                    )}
                />
                <Route
                    exact
                    path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/:single/:version`}
                    render={({ match }) => (
                        <MuteerUniversalObjectDetail
                            apiTest={apiTest}
                            dataModel={props.dataModel}
                            history={props.history}
                            match={match}
                            hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                        />
                    )}
                />
                <Route
                    exact
                    path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/:single`}
                    render={({ match }) => (
                        <MuteerUniversalObjectDetail
                            apiTest={apiTest}
                            dataModel={props.dataModel}
                            history={props.history}
                            match={match}
                            hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                        />
                    )}
                />
                <Route
                    exact
                    path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/`}
                    render={() => (
                        <MuteerApiTestOverzicht
                            hoofdOnderdeelSlug={props.hoofdOnderdeelSlug}
                            dataModel={props.dataModel}
                            history={props.history}
                        />
                    )}
                />
            </Switch>
        </div>
    )
}

class AuthRoutes extends Component {
    constructor(props) {
        super(props)
        this.redirectToLogin = this.redirectToLogin.bind(this)
    }

    redirectToLogin() {
        localStorage.removeItem('access_token')
        this.props.history.push('/login')
    }

    componentDidMount() {
        // Als de app gemount wordt, wordt de huidige token gechecked
        axios.get('/tokeninfo').catch(error => {
            this.redirectToLogin()
        })
    }

    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route
                        path="/api-test/ambities"
                        render={() => (
                            <APITestRoutes
                                apiTest={true}
                                dataModel={dataModel.Ambitie}
                                hoofdOnderdeelSlug="api-test"
                                history={this.props.history}
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
                                history={this.props.history}
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
                                history={this.props.history}
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
                                history={this.props.history}
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
                                history={this.props.history}
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
                                history={this.props.history}
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
                                history={this.props.history}
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
                                history={this.props.history}
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
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        apiTest={true}
                        path="/api-test"
                        exact
                        component={MuteerApiTest}
                    />
                    {/* Beleids Pagina Routes */}
                    <Route
                        exact
                        path={`/beleidsregels/${dataModel.BeleidsRegel.variables.Create_New_Slug}`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                dataModel={dataModel.BeleidsRegel}
                                ApiEndpoint={
                                    dataModel.BeleidsRegel.variables
                                        .Api_Endpoint
                                }
                                overzichtSlug={
                                    dataModel.BeleidsRegel.variables
                                        .Overzicht_Slug
                                }
                                history={this.props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/beleidsregels/:single`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                dataModel={dataModel.BeleidsRegel}
                                history={this.props.history}
                                match={match}
                                hoofdOnderdeelSlug="beleidsregels"
                            />
                        )}
                    />
                    <Route
                        path="/beleidsregels"
                        exact
                        render={() => (
                            <MuteerBeleidsRegels
                                dataModel={dataModel.BeleidsRegel}
                                history={this.props.history}
                            />
                        )}
                    />
                    {/* Maatregelen Pagina Routes */}
                    <Route
                        exact
                        path={`/maatregelen/${dataModel.Maatregelen.variables.Create_New_Slug}`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                dataModel={dataModel.Maatregelen}
                                ApiEndpoint={
                                    dataModel.Maatregelen.variables.Api_Endpoint
                                }
                                overzichtSlug={
                                    dataModel.Maatregelen.variables
                                        .Overzicht_Slug
                                }
                                history={this.props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/maatregelen/edit/:single`}
                        render={({ match }) => {
                            return (
                                <MuteerUniversalObjectCRUD
                                    dataModel={dataModel.Maatregelen}
                                    ApiEndpoint={
                                        dataModel.Maatregelen.variables
                                            .Api_Endpoint
                                    }
                                    overzichtSlug={
                                        dataModel.Maatregelen.variables
                                            .Overzicht_Slug
                                    }
                                    history={this.props.history}
                                    match={match}
                                />
                            )
                        }}
                    />
                    <Route
                        exact
                        path={`/maatregelen/:single/:version`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                apiTest={false}
                                dataModel={dataModel.Maatregelen}
                                history={this.props.history}
                                match={match}
                                hoofdOnderdeelSlug="maatregelen"
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/maatregelen/:single`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                dataModel={dataModel.Maatregelen}
                                history={this.props.history}
                                match={match}
                                hoofdOnderdeelSlug="maatregelen"
                            />
                        )}
                    />
                    <Route
                        path="/maatregelen"
                        exact
                        render={() => (
                            <MuteerMaatregelen
                                dataModel={dataModel.Maatregelen}
                                history={this.props.history}
                            />
                        )}
                    />
                    {/* Beleidsbeslissingen Pagina Routes */}
                    <Route
                        exact
                        path={`/beleidsbeslissingen/${dataModel.Beleidsbeslissingen.variables.Create_New_Slug}`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                dataModel={dataModel.Beleidsbeslissingen}
                                ApiEndpoint={
                                    dataModel.Beleidsbeslissingen.variables
                                        .Api_Endpoint
                                }
                                overzichtSlug={
                                    dataModel.Beleidsbeslissingen.variables
                                        .Overzicht_Slug
                                }
                                history={this.props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/beleidsbeslissingen/edit/:single`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                dataModel={dataModel.Beleidsbeslissingen}
                                ApiEndpoint={
                                    dataModel.Beleidsbeslissingen.variables
                                        .Api_Endpoint
                                }
                                overzichtSlug={
                                    dataModel.Beleidsbeslissingen.variables
                                        .Overzicht_Slug
                                }
                                history={this.props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/beleidsbeslissingen/:single/:version`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                apiTest={false}
                                dataModel={dataModel.Beleidsbeslissingen}
                                history={this.props.history}
                                match={match}
                                hoofdOnderdeelSlug="beleidsbeslissingen"
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/beleidsbeslissingen/:single`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                dataModel={dataModel.Beleidsbeslissingen}
                                history={this.props.history}
                                match={match}
                                hoofdOnderdeelSlug="beleidsbeslissingen"
                            />
                        )}
                    />
                    <Route
                        path="/beleidsbeslissingen"
                        exact
                        render={() => (
                            <MuteerBeleidsbeslissingen
                                dataModel={dataModel.Beleidsbeslissingen}
                                history={this.props.history}
                            />
                        )}
                    />
                    {/* Verordening Pagina Routes */}
                    <Route
                        path="/verordening"
                        exact
                        render={() => (
                            <MuteerVerordening
                                dataModel={dataModel.Verordening}
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/dashboard"
                        component={MuteerDashboard}
                    />
                </Switch>
            </React.Fragment>
        )
    }
}

// Export with authentication layer
export default AuthenticationWrapper(AuthRoutes)
