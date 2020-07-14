import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

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
import MuteerVerordeningenStructuurCRUD from './../../pages/MuteerVerordeningenStructuurCRUD'
import MuteerBeleidsrelatiesOverzicht from './../../pages/MuteerBeleidsrelatiesOverzicht'
import MuteerBeleidsrelatiesCRUD from './../../pages/MuteerBeleidsrelatiesCRUD'
import MuteerBeleidsbeslissingenDetail from '../../pages/MuteerBeleidsbeslissingenDetail'

// Import All the dimension constants. These contain the dimensions and there variables, e.g. API_ENDPOINT and TITEL_ENKELVOUD
import allDimensies from './../../constants/dimensies'

// Component to generate a general overview View, a detail view and a CRUD view to edit and create
const BeheerRoutes = (props) => {
    const BeheerRouteJSX = Object.keys(allDimensies).map((dimensie) => {
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
                                authUser={props.authUser}
                                dimensieConstants={dimensieConstants}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/edit/:single/:version`}
                        render={() => (
                            <MuteerUniversalObjectCRUD
                                authUser={props.authUser}
                                dimensieConstants={dimensieConstants}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/edit/:single`}
                        render={() => (
                            <MuteerUniversalObjectCRUD
                                authUser={props.authUser}
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
        localStorage.removeItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN)
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

                    {/* Verordening */}
                    <Route
                        exact
                        path="/muteer/nieuwe-verordening"
                        render={() => (
                            <MuteerVerordeningenStructuurCRUD
                                authUser={this.props.authUser}
                                dimensieConstants={
                                    allDimensies.VERORDENINGSTRUCTUUR
                                }
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/muteer/verordeningen/:lineageID"
                        render={() => (
                            <MuteerVerordeningenstructuurDetail
                                dataModel={allDimensies.Verordeningen}
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/verordeningen"
                        exact
                        render={() => (
                            <MuteerVerordeningenstructuurOverzicht
                                dataModel={allDimensies.VERORDENINGSTRUCTUUR}
                                history={this.props.history}
                            />
                        )}
                    />

                    {/* Beleidsbeslissingen */}
                    <Route
                        exact
                        path={`/muteer/beleidsbeslissingen/nieuwe-beleidsbeslissing`}
                        render={() => (
                            <MuteerUniversalObjectCRUD
                                authUser={this.props.authUser}
                                dimensieConstants={
                                    allDimensies.BELEIDSBESLISSINGEN
                                }
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/beleidsbeslissingen/edit/:single/:version`}
                        render={() => (
                            <MuteerUniversalObjectCRUD
                                authUser={this.props.authUser}
                                dimensieConstants={
                                    allDimensies.BELEIDSBESLISSINGEN
                                }
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/beleidsbeslissingen/edit/:single`}
                        render={() => (
                            <MuteerUniversalObjectCRUD
                                authUser={this.props.authUser}
                                dimensieConstants={
                                    allDimensies.BELEIDSBESLISSINGEN
                                }
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/beleidsbeslissingen/:single/:version`}
                        render={() => (
                            <MuteerBeleidsbeslissingenDetail
                                dimensieConstants={
                                    allDimensies.BELEIDSBESLISSINGEN
                                }
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/beleidsbeslissingen/:single`}
                        render={() => (
                            <MuteerBeleidsbeslissingenDetail
                                dimensieConstants={
                                    allDimensies.BELEIDSBESLISSINGEN
                                }
                            />
                        )}
                    />
                    <Route
                        path={`/muteer/beleidsbeslissingen`}
                        exact
                        render={() => (
                            <MuteerUniversalObjectOverzicht
                                dimensieConstants={
                                    allDimensies.BELEIDSBESLISSINGEN
                                }
                            />
                        )}
                    />

                    {/* Beleidsrelaties */}
                    <Route
                        path="/muteer/beleidsrelaties/:UUID/nieuwe-relatie"
                        exact
                        render={() => (
                            <MuteerBeleidsrelatiesCRUD
                                dataModel={allDimensies.BELEIDSRELATIES}
                                history={this.props.history}
                            />
                        )}
                    />
                    <Route
                        path="/muteer/beleidsrelaties/:UUID"
                        exact
                        render={() => <MuteerBeleidsrelatiesOverzicht />}
                    />
                    <Route
                        path="/muteer/beleidsrelaties"
                        render={() => <MuteerBeleidsrelatiesOverzicht />}
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
