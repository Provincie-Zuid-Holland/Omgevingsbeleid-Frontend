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
import MuteerVerordeningenCRUD from '../../pages/MuteerVerordeningenCRUD'
import MuteerVerordeningenStructuurCRUD from '../../pages/MuteerVerordeningenStructuurCRUD'
import MuteerVerordeningenDetail from '../../pages/MuteerVerordeningenDetail'

// Import Constants
import allDimensies from './../../constants/dimensies'
import allVerordeningen from './../../constants/verordeningen'

function BeheerRoutes(props) {
    const dimensies = [
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

    const authUser = props.authUser

    const BeheerRouteJSX = Object.keys(allDimensies).map(dimensie => {
        const dimensieConstants = allDimensies[dimensie]
        const overzichtSlug = allDimensies[dimensie].SLUG_OVERZICHT
        const createNewSlug = allDimensies[dimensie].SLUG_CREATE_NEW
        return (
            <React.Fragment key={createNewSlug}>
                <Switch>
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/${createNewSlug}`}
                        render={() => (
                            <MuteerUniversalObjectCRUD
                                authUser={authUser}
                                dimensieConstants={dimensieConstants}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/edit/:single/:version`}
                        render={() => (
                            <MuteerUniversalObjectCRUD
                                authUser={authUser}
                                dimensieConstants={dimensieConstants}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/edit/:single`}
                        render={() => (
                            <MuteerUniversalObjectCRUD
                                authUser={authUser}
                                dimensieConstants={dimensieConstants}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/:single/:version`}
                        render={() => (
                            <MuteerUniversalObjectDetail
                                dimensieConstants={dimensieConstants}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/:single`}
                        render={() => (
                            <MuteerUniversalObjectDetail
                                dimensieConstants={dimensieConstants}
                            />
                        )}
                    />
                    <Route
                        path={`/muteer/${overzichtSlug}`}
                        exact
                        render={() => (
                            <MuteerUniversalObjectOverzicht
                                dimensieConstants={dimensieConstants}
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
                        path="/muteer/verordeningen/nieuwe-verordening"
                        exact
                        render={() => (
                            <MuteerVerordeningenStructuurCRUD
                                dimensieConstants={
                                    allDimensies.VERORDENINGSTRUCTUUR
                                }
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/verordeningen/bewerk-verordening/:lineageID/:lineageUUID"
                        exact
                        render={() => (
                            <MuteerVerordeningenStructuurCRUD
                                dimensieConstants={
                                    allDimensies.VERORDENINGSTRUCTUUR
                                }
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/verordeningen/:lineageID/nieuw/:type"
                        render={() => (
                            <MuteerVerordeningenCRUD
                                dimensieConstants={allVerordeningen}
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/verordeningen/:lineageID/bewerk/:type/:verordeningsUUID/:verordeningsID"
                        render={() => (
                            <MuteerVerordeningenCRUD
                                editState={true}
                                dimensieConstants={allVerordeningen}
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/verordeningen/:lineageID/:type/:single"
                        exact
                        render={() => (
                            <MuteerVerordeningenDetail
                                dimensieConstants={allVerordeningen}
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/verordeningen/:lineageID"
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
