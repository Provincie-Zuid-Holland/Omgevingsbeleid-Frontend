import React from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

// Import Pages
import MuteerDashboard from './../../pages/MuteerDashboard'
import MuteerMijnBeleid from './../../pages/MuteerMijnBeleid'
import MuteerMijnAccount from './../../pages/MuteerMijnAccount'
import MuteerMeldingen from './../../pages/MuteerMeldingen'
import MuteerVerordeningenstructuurOverzicht from './../../pages/MuteerVerordeningenstructuurOverzicht'
import MuteerVerordeningenstructuurDetail from './../../pages/MuteerVerordeningenstructuurDetail'
import MuteerVerordeningenStructuurCRUD from './../../pages/MuteerVerordeningenStructuurCRUD'
import MuteerBeleidsrelaties from './../../pages/MuteerBeleidsrelaties'
import MuteerBeleidsrelatiesCRUD from './../../pages/MuteerBeleidsrelatiesCRUD'
import MuteerUniversalObjectOverzicht from './../../pages/MuteerUniversalObjectOverzicht'
import MuteerUniversalObjectDetail from './../../pages/MuteerUniversalObjectDetail'
import MuteerUniversalObjectDetailWithStatuses from './../../pages/MuteerUniversalObjectDetailWithStatuses'
import MuteerUniversalObjectCRUD from './../../pages/MuteerUniversalObjectCRUD'

// Import All the dimension constants. These contain the dimensions and there variables, e.g. API_ENDPOINT and TITLE_SINGULAR
import allDimensies from './../../constants/dimensies'

const AuthRoutes = ({ authUser, loggedIn }) => {
    const history = useHistory()

    /*const redirectToLogin = React.useCallback(() => {
        localStorage.removeItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN)
        history.push('/login')
    }, [history])

    React.useEffect(() => {
        if (!loggedIn) {
            redirectToLogin()
        }
    }, [loggedIn, redirectToLogin])*/

    return (
        <Switch>
            <Route
                exact
                path="/muteer/dashboard"
                render={() => <MuteerDashboard authUser={authUser} />}
            />
            <Route
                exact
                path="/muteer/mijn-beleid"
                render={() => <MuteerMijnBeleid authUser={authUser} />}
            />
            <Route
                exact
                path="/muteer/mijn-account"
                render={() => <MuteerMijnAccount authUser={authUser} />}
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
                        authUser={authUser}
                        dimensieConstants={allDimensies.VERORDENINGSTRUCTUUR}
                    />
                )}
            />
            <Route
                exact
                path="/muteer/bewerk-verordening/:lineageID/:lineageUUID"
                render={() => (
                    <MuteerVerordeningenStructuurCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.VERORDENINGSTRUCTUUR}
                    />
                )}
            />
            <Route
                exact
                path="/muteer/verordeningen/:lineageID"
                render={() => (
                    <MuteerVerordeningenstructuurDetail
                        dataModel={allDimensies.Verordeningen}
                        history={history}
                    />
                )}
            />
            <Route
                path="/muteer/verordeningen"
                exact
                render={() => (
                    <MuteerVerordeningenstructuurOverzicht
                        dataModel={allDimensies.VERORDENINGSTRUCTUUR}
                        history={history}
                    />
                )}
            />

            {/* Beleidsbeslissingen Pages */}
            <Route
                exact
                path={`/muteer/beleidskeuzes/nieuwe-beleidskeuze`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSBESLISSINGEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/edit/:single/:version`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSBESLISSINGEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/edit/:single`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSBESLISSINGEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/:single/:version`}
                render={() => (
                    <MuteerUniversalObjectDetailWithStatuses
                        dimensieConstants={allDimensies.BELEIDSBESLISSINGEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/:single`}
                render={() => (
                    <MuteerUniversalObjectDetailWithStatuses
                        dimensieConstants={allDimensies.BELEIDSBESLISSINGEN}
                    />
                )}
            />

            {/* Maatregelen pages */}
            <Route
                exact
                path={`/muteer/maatregelen/nieuwe-maatregel`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.MAATREGELEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/maatregelen/edit/:single/:version`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.MAATREGELEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/maatregelen/edit/:single`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.MAATREGELEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/maatregelen/:single/:version`}
                render={() => (
                    <MuteerUniversalObjectDetailWithStatuses
                        dimensieConstants={allDimensies.MAATREGELEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/maatregelen/:single`}
                render={() => (
                    <MuteerUniversalObjectDetailWithStatuses
                        dimensieConstants={allDimensies.MAATREGELEN}
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
                        history={history}
                    />
                )}
            />
            <Route
                path="/muteer/beleidsrelaties/:UUID"
                exact
                render={() => <MuteerBeleidsrelaties />}
            />
            <Route
                path="/muteer/beleidsrelaties"
                render={() => <MuteerBeleidsrelaties />}
            />
            <BeheerRoutes authUser={authUser} history={history} />
        </Switch>
    )
}

// Component to generate a general overview View, a detail view and a CRUD view to edit and create
const BeheerRoutes = (props) => {
    const BeheerRouteJSX = Object.keys(allDimensies).map((dimensie) => {
        // We have custom detail pages for beleidsbeslissingen (beleidskeuzes) en maatregelen
        const returnDetailPages =
            dimensie !== 'BELEIDSBESLISSINGEN' && dimensie !== 'MAATREGELEN'
        const dimensieConstants = allDimensies[dimensie]
        const overzichtSlug = allDimensies[dimensie].SLUG_OVERVIEW
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
                    {returnDetailPages ? (
                        <Route
                            exact
                            path={`/muteer/${overzichtSlug}/:single/:version`}
                            render={() => (
                                <MuteerUniversalObjectDetail
                                    dimensieConstants={dimensieConstants}
                                />
                            )}
                        />
                    ) : null}
                    {returnDetailPages ? (
                        <Route
                            exact
                            path={`/muteer/${overzichtSlug}/:single`}
                            render={() => (
                                <MuteerUniversalObjectDetail
                                    dimensieConstants={dimensieConstants}
                                />
                            )}
                        />
                    ) : null}
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

// Export with authentication layer
export default AuthRoutes
