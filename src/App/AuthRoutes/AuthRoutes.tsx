import { Fragment, useCallback, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'
import allDimensies from '@/constants/dimensies'
import MutatePolicyPage from '@/pages/MutatePolicyPage'
import MuteerBeleidsmodulesOverview from '@/pages/MuteerBeleidsmodulesOverview'
import MuteerBeleidsrelaties from '@/pages/MuteerBeleidsrelaties'
import MuteerBeleidsrelatiesCRUD from '@/pages/MuteerBeleidsrelatiesCRUD'
import MuteerDashboard from '@/pages/MuteerDashboard'
import MuteerMijnBeleid from '@/pages/MuteerMijnBeleid'
import MuteerUniversalObjectDetail from '@/pages/MuteerUniversalObjectDetail'
import MuteerUniversalObjectDetailWithStatuses from '@/pages/MuteerUniversalObjectDetailWithStatuses'
import MuteerUniversalObjectOverzicht from '@/pages/MuteerUniversalObjectOverzicht'
import MuteerVerordeningenStructuurCRUD from '@/pages/MuteerVerordeningenStructuurCRUD'
import MuteerVerordeningenstructuurDetail from '@/pages/MuteerVerordeningenstructuurDetail'
import MuteerVerordeningenstructuurOverzicht from '@/pages/MuteerVerordeningenstructuurOverzicht'

// Import All the dimension constants. These contain the dimensions and there variables, e.g. API_ENDPOINT and TITLE_SINGULAR

interface AuthRoutesProps {
    authUser?: GetTokeninfo200Identifier
    loggedIn?: boolean
}

const AuthRoutes = ({ authUser, loggedIn }: AuthRoutesProps) => {
    const history = useHistory()

    const redirectToLogin = useCallback(() => {
        localStorage.removeItem(
            process.env.REACT_APP_KEY_API_ACCESS_TOKEN || ''
        )
        toast('Voor deze actie moet je ingelogd zijn')
        history.push('/login')
    }, [history])

    useEffect(() => {
        if (!loggedIn) {
            redirectToLogin()
        }
    }, [loggedIn, redirectToLogin])

    return (
        <Switch>
            <Route
                exact
                path="/muteer/dashboard"
                render={() => <MuteerDashboard />}
            />
            <Route
                exact
                path="/muteer/mijn-beleid"
                render={() => <MuteerMijnBeleid />}
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
                render={() => <MuteerVerordeningenstructuurDetail />}
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
                    <MutatePolicyPage
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSKEUZES}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/beleidskeuzes/edit/:single`}
                render={() => (
                    <MutatePolicyPage
                        authUser={authUser}
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
                    <MutatePolicyPage
                        authUser={authUser}
                        dimensieConstants={allDimensies.BELEIDSMODULES}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}/:single`}
                render={() => <MuteerBeleidsmodulesOverview />}
            />

            {/* Maatregelen pages */}
            <Route
                exact
                path={`/muteer/maatregelen/nieuwe-maatregel`}
                render={() => (
                    <MutatePolicyPage
                        authUser={authUser}
                        dimensieConstants={allDimensies.MAATREGELEN}
                    />
                )}
            />
            <Route
                exact
                path={`/muteer/maatregelen/edit/:single`}
                render={() => (
                    <MutatePolicyPage
                        authUser={authUser}
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
            {console.log('TEST')}
            {/* Overview, Detail en Edit pages for the rest of the objects */}
            <BeheerRoutes authUser={authUser} />
        </Switch>
    )
}

// Component to generate a general overview View, a detail view and a CRUD view to edit and create
const BeheerRoutes = ({ authUser }: Pick<AuthRoutesProps, 'authUser'>) => {
    const skipDimensies = ['VERORDENINGSARTIKEL', 'BELEIDSRELATIES'] as const
    const skipDetailPageDimensies = [
        'BELEIDSKEUZES',
        'MAATREGELEN',
        'BELEIDSMODULES',
    ]
    type skip = typeof skipDimensies[number]
    type test = keyof typeof allDimensies
    const DimensieKeys = Object.keys(allDimensies) as Array<
        keyof typeof allDimensies
    >
    type filteredKeys = Exclude<test, skip>

    // allDimensies[dimensie].SLUG_CREATE_NEW &&
    const filteredDimensions: filteredKeys[] = DimensieKeys.filter(
        (dimensie): dimensie is filteredKeys =>
            !(skipDimensies as readonly string[]).includes(dimensie)
    )

    // ("AMBITIES" | "BELANGEN" | "BELEIDSKEUZES" | "BELEIDSREGELS" | "BELEIDSRELATIES" | "BELEIDSPRESTATIES" | "BELEIDSMODULES" | "BELEIDSDOELEN" | "MAATREGELEN" | "THEMAS" | "VERORDENINGSTRUCTUUR" | "VERORDENINGSARTIKEL")[]
    // ("BELANGEN" | "BELEIDSKEUZES" | "BELEIDSREGELS" | "BELEIDSRELATIES" | "BELEIDSPRESTATIES" | "BELEIDSMODULES" | "BELEIDSDOELEN" | "MAATREGELEN" | "THEMAS" | "VERORDENINGSTRUCTUUR" | "VERORDENINGSARTIKEL")[]
    console.log('filteredDimensions', filteredDimensions)

    return (
        <>
            {filteredDimensions.map(dimensie => {
                const returnDetailPage =
                    !skipDetailPageDimensies.includes(dimensie)
                const dimensieConstants = allDimensies[dimensie]
                const overzichtSlug = allDimensies[dimensie].SLUG_OVERVIEW
                const createNewSlug = allDimensies[dimensie].SLUG_CREATE_NEW

                const isBeleidsModulePageAndUserIsNotAdmin =
                    dimensie === 'BELEIDSMODULES' &&
                    authUser?.Rol !== 'Beheerder' &&
                    authUser?.Rol !== 'Functioneel beheerder' &&
                    authUser?.Rol !== 'Technisch beheerder' &&
                    authUser?.Rol !== 'Test runner' &&
                    authUser?.Rol !== 'Tester'

                return (
                    <Fragment key={createNewSlug}>
                        <Switch>
                            <Route
                                exact
                                path={`/muteer/${overzichtSlug}/${createNewSlug}`}
                                render={() => (
                                    <MutatePolicyPage
                                        authUser={authUser}
                                        dimensieConstants={
                                            allDimensies[dimensie] as any
                                        }
                                    />
                                )}
                            />
                            <Route
                                exact
                                path={`/muteer/${overzichtSlug}/edit/:single`}
                                render={() => (
                                    <MutatePolicyPage
                                        authUser={authUser}
                                        dimensieConstants={
                                            allDimensies[dimensie] as any
                                        }
                                    />
                                )}
                            />
                            {returnDetailPage ? (
                                <Route
                                    exact
                                    path={`/muteer/${overzichtSlug}/:single/:version`}
                                    render={() => (
                                        <MuteerUniversalObjectDetail
                                            authUser={authUser}
                                            dimensieConstants={
                                                dimensieConstants
                                            }
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
                                            authUser={authUser}
                                            dimensieConstants={
                                                dimensieConstants
                                            }
                                        />
                                    )}
                                />
                            ) : null}
                            <Route
                                path={`/muteer/${overzichtSlug}`}
                                exact
                                render={() => (
                                    <MuteerUniversalObjectOverzicht
                                        hideAddObject={
                                            isBeleidsModulePageAndUserIsNotAdmin
                                        }
                                        dimensieConstants={dimensieConstants}
                                    />
                                )}
                            />
                        </Switch>
                    </Fragment>
                )
            })}
        </>
    )
}

// Export with authentication layer
export default AuthRoutes
