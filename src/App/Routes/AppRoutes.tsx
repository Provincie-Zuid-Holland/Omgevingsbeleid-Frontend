import { Fragment, useCallback, useLayoutEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { NetworkGraph } from '@/components/Network'
import allDimensies, { filteredDimensieConstants } from '@/constants/dimensies'
import useAuth from '@/hooks/useAuth'
import {
    Dashboard,
    MijnBeleid,
    VerordeningenStructuurCRUD,
    VerordeningenstructuurDetail,
    VerordeningenstructuurOverzicht,
} from '@/pages/protected'
import {
    Accessibility,
    Home,
    InProgress,
    Login,
    MapSearch,
    ObjectDetail,
    PlanningAndReleases,
    SearchResults,
    UniversalObjectOverview,
    Verordening,
} from '@/pages/public'
import detailPages from '@/utils/detailPages'

import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
    const navigate = useNavigate()

    const routes = useRoutes([
        /**
         * Public pages
         */
        {
            path: '/',
            element: <Home />,
        },
        { path: 'login', element: <Login /> },
        { path: 'logout', element: <Logout /> },
        {
            path: 'zoekresultaten',
            element: <SearchResults />,
        },
        { path: 'zoeken-op-kaart', element: <MapSearch /> },
        {
            path: 'planning-en-releases',
            element: <PlanningAndReleases />,
        },
        {
            path: 'digi-toegankelijkheid',
            element: <Accessibility />,
        },
        {
            path: 'in-bewerking',
            element: <InProgress />,
        },
        {
            path: 'netwerkvisualisatie',
            element: <NetworkGraph />,
        },
        {
            path: 'detail/verordening',
            element: <Verordening />,
        },
        ...detailPages.map(item => ({
            path: item.slug,
            element: (
                <UniversalObjectOverview
                    {...item}
                    dataEndpoint={item.dataValidEndpoint}
                />
            ),
            children: [
                {
                    path: `${item.slug}/:id`,
                    element: <ObjectDetail {...item} />,
                },
            ],
        })),

        /**
         * Protected pages
         */
        {
            path: 'muteer',
            element: <ProtectedRoute />,
            children: [
                {
                    path: 'dashboard',
                    element: <Dashboard />,
                },
                {
                    path: 'mijn-beleid',
                    element: <MijnBeleid />,
                },
                {
                    path: 'verordeningen',
                    element: (
                        <VerordeningenstructuurOverzicht
                            dataModel={allDimensies.VERORDENINGSTRUCTUUR}
                        />
                    ),
                    children: [
                        {
                            path: 'nieuw',
                            element: (
                                <VerordeningenStructuurCRUD
                                    dimensieConstants={
                                        allDimensies.VERORDENINGSTRUCTUUR
                                    }
                                    navigate={navigate}
                                />
                            ),
                        },
                        {
                            path: ':lineageID',
                            element: <VerordeningenstructuurDetail />,
                            children: [
                                {
                                    path: ':lineageUUID/bewerk',
                                    element: (
                                        <VerordeningenStructuurCRUD
                                            dimensieConstants={
                                                allDimensies.VERORDENINGSTRUCTUUR
                                            }
                                            navigate={navigate}
                                        />
                                    ),
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ])

    return routes

    /*
    return (
        <Routes>
            <Route path="/muteer" element={<ProtectedRoute />}>
                <Route
                    path={`beleidskeuzes/nieuwe-beleidskeuze`}
                    element={
                        <MuteerUniversalObjectCRUD
                            dimensieConstants={allDimensies.BELEIDSKEUZES}
                        />
                    }
                />
                <Route
                    path={`beleidskeuzes/edit/:single`}
                    element={
                        <MuteerUniversalObjectCRUD
                            dimensieConstants={allDimensies.BELEIDSKEUZES}
                        />
                    }
                />
                <Route
                    path={`beleidskeuzes/:single`}
                    element={
                        <MuteerDetail
                            dimensieConstants={allDimensies.BELEIDSKEUZES}
                        />
                    }
                />

                <Route
                    path={`${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}/${allDimensies.BELEIDSMODULES.SLUG_CREATE_NEW}`}
                    element={
                        <MuteerUniversalObjectCRUD
                            dimensieConstants={allDimensies.BELEIDSMODULES}
                        />
                    }
                />
                <Route
                    path={`${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}/:single`}
                    element={<MuteerBeleidsmodulesOverview />}
                />

                <Route
                    path={`maatregelen/nieuwe-maatregel`}
                    element={
                        <MuteerUniversalObjectCRUD
                            dimensieConstants={allDimensies.MAATREGELEN}
                        />
                    }
                />
                <Route
                    path={`maatregelen/edit/:single`}
                    element={
                        <MuteerUniversalObjectCRUD
                            dimensieConstants={allDimensies.MAATREGELEN}
                        />
                    }
                />
                <Route
                    path={`maatregelen/:single`}
                    element={
                        <MuteerDetail
                            dimensieConstants={allDimensies.MAATREGELEN}
                        />
                    }
                />

                <Route
                    path="beleidsrelaties/:UUID/nieuwe-relatie"
                    element={
                        <MuteerBeleidsrelatiesCRUD
                            dataModel={allDimensies.BELEIDSRELATIES}
                        />
                    }
                />
                <Route
                    path="beleidsrelaties/:UUID"
                    element={<MuteerBeleidsrelaties />}
                />
                <Route
                    path="beleidsrelaties"
                    element={<MuteerBeleidsrelaties />}
                />

                {Object.keys(allDimensies)
                    .filter(
                        dimensie =>
                            allDimensies[dimensie as keyof typeof allDimensies]
                                .SLUG_CREATE_NEW
                    )
                    .map(dimensie => {
                        const dimensieConstants =
                            allDimensies[dimensie as keyof typeof allDimensies]
                        const overzichtSlug =
                            allDimensies[dimensie as keyof typeof allDimensies]
                                .SLUG_OVERVIEW
                        const createNewSlug =
                            allDimensies[dimensie as keyof typeof allDimensies]
                                .SLUG_CREATE_NEW

                        return (
                            <Fragment key={createNewSlug}>
                                <Route
                                    path={`${overzichtSlug}/${createNewSlug}`}
                                    element={
                                        <MuteerUniversalObjectCRUD
                                            dimensieConstants={
                                                dimensieConstants
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path={`${overzichtSlug}/edit/:single`}
                                    element={
                                        <MuteerUniversalObjectCRUD
                                            dimensieConstants={
                                                dimensieConstants
                                            }
                                        />
                                    }
                                />

                                <Route
                                    path={`${overzichtSlug}`}
                                    element={
                                        <ProtectedRoute
                                            redirectTo="/muteer/dashboard"
                                            roles={
                                                dimensie === 'BELEIDSMODULES'
                                                    ? [
                                                          'Beheerder',
                                                          'Functioneel beheerder',
                                                          'Technisch beheerder',
                                                          'Test runner',
                                                          'Tester',
                                                          'Behandelend Ambtenaar',
                                                          'Portefeuillehouder',
                                                          'Ambtelijk opdrachtgever',
                                                      ]
                                                    : [
                                                          'Beheerder',
                                                          'Functioneel beheerder',
                                                          'Technisch beheerder',
                                                          'Test runner',
                                                          'Tester',
                                                      ]
                                            }>
                                            <MuteerOverview
                                                dimensieConstants={
                                                    dimensieConstants as filteredDimensieConstants
                                                }
                                            />
                                        </ProtectedRoute>
                                    }
                                />
                            </Fragment>
                        )
                    })}
            </Route>
        </Routes>
    )
    */
}

const Logout = () => {
    const navigate = useNavigate()
    const { signout } = useAuth()

    const cleanup = useCallback(
        () => signout(() => navigate('/', { replace: true })),
        [signout, navigate]
    )

    useLayoutEffect(() => cleanup(), [cleanup])

    return null
}

export default AppRoutes
