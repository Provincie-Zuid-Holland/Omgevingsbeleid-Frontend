import React from "react"
import { Route, Switch, useHistory } from "react-router-dom"
import { toast } from "react-toastify"

// Import Pages
import MuteerDashboard from "./../../pages/MuteerDashboard"
import MuteerMijnBeleid from "./../../pages/MuteerMijnBeleid"
import MuteerVerordeningenstructuurOverzicht from "./../../pages/MuteerVerordeningenstructuurOverzicht"
import MuteerVerordeningenstructuurDetail from "./../../pages/MuteerVerordeningenstructuurDetail"
import MuteerVerordeningenStructuurCRUD from "./../../pages/MuteerVerordeningenStructuurCRUD"
import MuteerBeleidsrelaties from "./../../pages/MuteerBeleidsrelaties"
import MuteerBeleidsrelatiesCRUD from "./../../pages/MuteerBeleidsrelatiesCRUD"
import MuteerUniversalObjectOverzicht from "./../../pages/MuteerUniversalObjectOverzicht"
import MuteerUniversalObjectDetail from "./../../pages/MuteerUniversalObjectDetail"
import MuteerUniversalObjectDetailWithStatuses from "./../../pages/MuteerUniversalObjectDetailWithStatuses"
import MuteerUniversalObjectCRUD from "./../../pages/MuteerUniversalObjectCRUD"
import MuteerBeleidsmodulesOverview from "./../../pages/MuteerBeleidsmodulesOverview"

// Import All the dimension constants. These contain the dimensions and there variables, e.g. API_ENDPOINT and TITLE_SINGULAR
import allDimensies from "./../../constants/dimensies"

const AuthRoutes = ({ authUser, loggedIn }) => {
    const history = useHistory()

    const redirectToLogin = React.useCallback(() => {
        localStorage.removeItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN)
        toast("Voor deze actie moet je ingelogd zijn")
        history.push("/login")
    }, [history])

    React.useEffect(() => {
        if (!loggedIn) {
            redirectToLogin()
        }
    }, [loggedIn, redirectToLogin])

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

            {/* Beleidskeuzes Pages */}
            <Route
                exact
                path={`/muteer/beleidskeuzes/nieuwe-beleidskeuze`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSKEUZES}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/edit/:single/:version`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSKEUZES}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/edit/:single`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSKEUZES}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/:single/:version`}
                render={() => (
                    <MuteerUniversalObjectDetailWithStatuses
                        dimensieConstants={allDimensies.BELEIDSKEUZES}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/:single`}
                render={() => (
                    <MuteerUniversalObjectDetailWithStatuses
                        dimensieConstants={allDimensies.BELEIDSKEUZES}
                    />
                )}
            />

            {/* Beleidsmodules pages */}
            <Route
                exact
                path={`/muteer/${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}/${allDimensies.BELEIDSMODULES.SLUG_CREATE_NEW}`}
                render={() => (
                    <MuteerUniversalObjectCRUD
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSMODULES}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}/:single`}
                render={() => (
                    <MuteerBeleidsmodulesOverview
                        dimensieConstants={allDimensies.BELEIDSKEUZES}
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

            {/* Overview, Detail en Edit pages for the rest of the objects */}
            <BeheerRoutes authUser={authUser} history={history} />
        </Switch>
    )
}

// Component to generate a general overview View, a detail view and a CRUD view to edit and create
const BeheerRoutes = (props) => {
    const BeheerRouteJSX = Object.keys(allDimensies)
        .filter((dimensie) => allDimensies[dimensie].SLUG_CREATE_NEW)
        .map((dimensie) => {
            // There are custom detail pages for beleidskeuzes, maatregelen and beleidsmodules
            const returnDetailPage =
                dimensie !== "BELEIDSKEUZES" &&
                dimensie !== "MAATREGELEN" &&
                dimensie !== "BELEIDSMODULES"

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
                        {returnDetailPage ? (
                            <Route
                                exact
                                path={`/muteer/${overzichtSlug}/:single/:version`}
                                render={() => (
                                    <MuteerUniversalObjectDetail
                                        authUser={props.authUser}
                                        dimensieConstants={dimensieConstants}
                                    />
                                )}
                            />
                        ) : null}
                        {returnDetailPage ? (
                            <Route
                                exact
                                path={`/muteer/${overzichtSlug}/:single`}
                                render={() => (
                                    <MuteerUniversalObjectDetail
                                        authUser={props.authUser}
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
