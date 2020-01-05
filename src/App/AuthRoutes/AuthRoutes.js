import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

// Import Data Model
import dataModel from './../dataModel'

// Import HTTP Client
import axios from './../../API/axios'

// Import Pages
import MuteerDashboard from './../../pages/MuteerDashboard'
import MuteerMijnBeleid from './../../pages/MuteerMijnBeleid'
import MuteerMijnAccount from './../../pages/MuteerMijnAccount'
import MuteerMeldingen from './../../pages/MuteerMeldingen'
import MuteerUniversalObjectOverzicht from './../../pages/MuteerUniversalObjectOverzicht'
import MuteerUniversalObjectDetail from './../../pages/MuteerUniversalObjectDetail'
import MuteerUniversalObjectCRUD from './../../pages/MuteerUniversalObjectCRUD'
import MuteerVerordening from './../../pages/MuteerVerordening'
import MuteerBeleidsrelatiesOverzicht from './../../pages/MuteerBeleidsrelatiesOverzicht'
import MuteerBeleidsrelatiesCRUD from './../../pages/MuteerBeleidsrelatiesCRUD'

// Import Components
import AuthenticationWrapper from './../../components/AuthenticationWrapper'

function BeheerRoutes(props) {
    const beheerRoutesList = props.beheerRoutesList

    const BeheerRouteJSX = beheerRoutesList.map(item => {
        const dataModelProperty = item.dataModelProperty

        // Variables
        const overzichtSlug =
            dataModel[dataModelProperty].variables.Overzicht_Slug
        const apiEndpoint = dataModel[dataModelProperty].variables.Api_Endpoint
        const filteredDataModel = dataModel[dataModelProperty]
        const createNewSlug =
            dataModel[dataModelProperty].variables.Create_New_Slug

        return (
            <React.Fragment key={item.slug}>
                <Switch>
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/${createNewSlug}`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                dataModel={filteredDataModel}
                                ApiEndpoint={apiEndpoint}
                                overzichtSlug={overzichtSlug}
                                history={props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/edit/:single/:version`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                ApiEndpoint={apiEndpoint}
                                dataModel={filteredDataModel}
                                overzichtSlug={overzichtSlug}
                                history={props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/edit/:single`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                ApiEndpoint={apiEndpoint}
                                dataModel={filteredDataModel}
                                overzichtSlug={overzichtSlug}
                                history={props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/:single/:version`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                dataModel={filteredDataModel}
                                overzichtSlug={overzichtSlug}
                                history={props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/:single`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                dataModel={filteredDataModel}
                                history={props.history}
                                overzichtSlug={overzichtSlug}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        path={`/muteer/${overzichtSlug}`}
                        exact
                        render={() => (
                            <MuteerUniversalObjectOverzicht
                                dataModel={filteredDataModel}
                                history={props.history}
                            />
                        )}
                    />
                </Switch>
            </React.Fragment>
        )
    })

    return BeheerRouteJSX
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
            // this.redirectToLogin()
        })
    }

    render() {
        const beheerRoutesList = [
            {
                slug: 'beleidsregels',
                dataModelProperty: 'BeleidsRegels',
            },
            {
                slug: 'maatregelen',
                dataModelProperty: 'Maatregelen',
            },
            {
                slug: 'opgaven',
                dataModelProperty: 'Opgaven',
            },
            {
                slug: 'ambities',
                dataModelProperty: 'Ambities',
            },
            {
                slug: 'belangen',
                dataModelProperty: 'Belangen',
            },
            {
                slug: 'themas',
                dataModelProperty: "Thema's",
            },
            {
                slug: 'beleidsbeslissingen',
                dataModelProperty: 'Beleidsbeslissingen',
            },
        ]

        return (
            <React.Fragment>
                <Switch>
                    <Route
                        exact
                        path="/muteer/dashboard"
                        render={() => (
                            <MuteerDashboard authUser={this.props.authUser} />
                        )}
                    />
                    <Route
                        exact
                        path="/muteer/mijn-beleid"
                        render={() => (
                            <MuteerMijnBeleid authUser={this.props.authUser} />
                        )}
                    />
                    <Route
                        exact
                        path="/muteer/mijn-account"
                        render={() => (
                            <MuteerMijnAccount authUser={this.props.authUser} />
                        )}
                    />
                    <Route
                        exact
                        path="/muteer/mijn-meldingen"
                        component={MuteerMeldingen}
                    />
                    <Route
                        path="/muteer/verordening"
                        exact
                        render={() => (
                            <MuteerVerordening
                                dataModel={dataModel.Verordening}
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/beleidsrelaties/:UUID/nieuwe-relatie"
                        exact
                        render={() => (
                            <MuteerBeleidsrelatiesCRUD
                                dataModel={dataModel.BeleidsRelatie}
                                history={this.props.history}
                                authUser={this.props.authUser}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/beleidsrelaties/:UUID"
                        exact
                        render={() => (
                            <MuteerBeleidsrelatiesOverzicht
                                dataModel={dataModel.BeleidsRelatie}
                                history={this.props.history}
                                authUser={this.props.authUser}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/beleidsrelaties"
                        render={() => (
                            <MuteerBeleidsrelatiesOverzicht
                                dataModel={dataModel.BeleidsRelatie}
                                history={this.props.history}
                                authUser={this.props.authUser}
                            />
                        )}
                    />
                    <BeheerRoutes
                        beheerRoutesList={beheerRoutesList}
                        history={this.props.history}
                    />
                </Switch>
            </React.Fragment>
        )
    }
}

// Export with authentication layer
export default AuthenticationWrapper(AuthRoutes)
