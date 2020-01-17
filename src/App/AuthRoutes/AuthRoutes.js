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
import MuteerVerordeningenstructuurOverzicht from './../../pages/MuteerVerordeningenstructuurOverzicht'
import MuteerVerordeningenstructuurDetail from './../../pages/MuteerVerordeningenstructuurDetail'
import MuteerBeleidsrelatiesOverzicht from './../../pages/MuteerBeleidsrelatiesOverzicht'
import MuteerBeleidsrelatiesCRUD from './../../pages/MuteerBeleidsrelatiesCRUD'

function BeheerRoutes(props) {
    const beheerRoutesList = [
        {
            slug: 'beleidsregels',
            dataModelProperty: 'Beleidsregels',
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

    const authUser = props.authUser

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
                                authUser={authUser}
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
                                authUser={authUser}
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
                                authUser={authUser}
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
        if (!this.props.loggedIn) {
            this.redirectToLogin()
        }
    }

    render() {
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

                    {/* Verordeningen */}
                    <Route
                        path="/muteer/verordeningen/:ID"
                        exact
                        render={() => (
                            <MuteerVerordeningenstructuurDetail
                                dataModel={dataModel.Verordeningen}
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/verordeningen"
                        exact
                        render={() => (
                            <MuteerVerordeningenstructuurOverzicht
                                dataModel={dataModel.Verordeningen}
                                history={this.props.history}
                            />
                        )}
                    />

                    {/* Beleidsrelaties */}
                    <Route
                        path="/muteer/beleidsrelaties/:UUID/nieuwe-relatie"
                        exact
                        render={() => (
                            <MuteerBeleidsrelatiesCRUD
                                dataModel={dataModel.Beleidsrelaties}
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
                        authUser={this.props.authUser}
                        history={this.props.history}
                    />
                </Switch>
            </React.Fragment>
        )
    }
}

// Export with authentication layer
export default AuthRoutes
