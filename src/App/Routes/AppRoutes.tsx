import { Fragment, useCallback, useLayoutEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { NetworkGraph } from '@/components/Network'
import allDimensies, { filteredDimensieConstants } from '@/constants/dimensies'
import useAuth from '@/hooks/useAuth'
import Login from '@/pages/Login'
import MuteerBeleidsmodulesOverview from '@/pages/MuteerBeleidsmodulesOverview'
import MuteerBeleidsrelaties from '@/pages/MuteerBeleidsrelaties'
import MuteerBeleidsrelatiesCRUD from '@/pages/MuteerBeleidsrelatiesCRUD'
import MuteerDashboard from '@/pages/MuteerDashboard'
import MuteerDetail from '@/pages/MuteerDetail'
import MuteerMijnBeleid from '@/pages/MuteerMijnBeleid'
import MuteerOverview from '@/pages/MuteerOverview'
import MuteerUniversalObjectCRUD from '@/pages/MuteerUniversalObjectCRUD'
import MuteerVerordeningenStructuurCRUD from '@/pages/MuteerVerordeningenStructuurCRUD'
import MuteerVerordeningenstructuurDetail from '@/pages/MuteerVerordeningenstructuurDetail'
import MuteerVerordeningenstructuurOverzicht from '@/pages/MuteerVerordeningenstructuurOverzicht'
import RaadpleegDigiToegankelijkheid from '@/pages/RaadpleegDigiToegankelijkheid'
import RaadpleegHome from '@/pages/RaadpleegHome'
import RaadpleegInProgress from '@/pages/RaadpleegInProgress'
import RaadpleegMapSearch from '@/pages/RaadpleegMapSearch'
import RaadpleegObjectDetail from '@/pages/RaadpleegObjectDetail'
import RaadpleegPlanningAndReleases from '@/pages/RaadpleegPlanningAndReleases'
import RaadpleegSearchResults from '@/pages/RaadpleegSearchResults'
import RaadpleegUniversalObjectOverview from '@/pages/RaadpleegUniversalObjectOverview'
import RaadpleegVerordening from '@/pages/RaadpleegVerordening'
import detailPages from '@/utils/detailPages'

import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <Routes>
            {/* Raadpleeg - The homepage where users can search for policies and regulations */}
            <Route index element={<RaadpleegHome />} />

            {/* Raadpleeg - Result page for search */}
            <Route
                path="/zoekresultaten"
                element={<RaadpleegSearchResults />}
            />

            {/* Raadpleeg - Search on map page */}
            <Route path="/zoeken-op-kaart" element={<RaadpleegMapSearch />} />

            <Route
                path={`/detail/verordening`}
                element={<RaadpleegVerordening />}
            />

            {/* Raadpleeg - Overview and Detail pages for all the dimensions */}
            {detailPages.map(item => (
                <Route
                    key={item.slug}
                    path={`/detail/${item.slug}/:id`}
                    element={<RaadpleegObjectDetail {...item} />}
                />
            ))}

            {/* Raadpleeg - Overview and Detail pages for all the dimensions */}
            {detailPages.map(item => (
                <Route
                    key={item.slug}
                    path={`/overzicht/${item.slug}`}
                    element={
                        <RaadpleegUniversalObjectOverview
                            {...item}
                            dataEndpoint={item.dataValidEndpoint}
                        />
                    }
                />
            ))}

            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route
                path="/planning-en-releases"
                element={<RaadpleegPlanningAndReleases />}
            />
            <Route
                path="/digi-toegankelijkheid"
                element={<RaadpleegDigiToegankelijkheid />}
            />
            <Route path="/in-bewerking" element={<RaadpleegInProgress />} />
            <Route path="/netwerkvisualisatie" element={<NetworkGraph />} />

            <Route path="/muteer" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<MuteerDashboard />} />
                <Route path="mijn-beleid" element={<MuteerMijnBeleid />} />

                {/* Verordening */}
                <Route
                    path="nieuwe-verordening"
                    element={
                        <MuteerVerordeningenStructuurCRUD
                            dimensieConstants={
                                allDimensies.VERORDENINGSTRUCTUUR
                            }
                            navigate={navigate}
                        />
                    }
                />
                <Route
                    path="bewerk-verordening/:lineageID/:lineageUUID"
                    element={
                        <MuteerVerordeningenStructuurCRUD
                            dimensieConstants={
                                allDimensies.VERORDENINGSTRUCTUUR
                            }
                            navigate={navigate}
                        />
                    }
                />
                <Route
                    path="verordeningen/:lineageID"
                    element={<MuteerVerordeningenstructuurDetail />}
                />
                <Route
                    path="verordeningen"
                    element={
                        <MuteerVerordeningenstructuurOverzicht
                            dataModel={allDimensies.VERORDENINGSTRUCTUUR}
                        />
                    }
                />

                {/* Beleidskeuzes Pages */}
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

                {/* Beleidsmodules pages */}
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

                {/* Maatregelen pages */}
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

                {/* Beleidsrelaties */}
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

                {/* Overview, Detail en Edit pages for the rest of the objects */}
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

                        const isBeleidsModulePageAndUserIsNotAdmin =
                            dimensie === 'BELEIDSMODULES' &&
                            user?.Rol !== 'Beheerder' &&
                            user?.Rol !== 'Functioneel beheerder' &&
                            user?.Rol !== 'Technisch beheerder' &&
                            user?.Rol !== 'Test runner' &&
                            user?.Rol !== 'Tester'

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
                                        <MuteerOverview
                                            hideAddObject={
                                                isBeleidsModulePageAndUserIsNotAdmin
                                            }
                                            dimensieConstants={
                                                dimensieConstants as filteredDimensieConstants
                                            }
                                        />
                                    }
                                />
                            </Fragment>
                        )
                    })}
            </Route>
        </Routes>
    )
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
