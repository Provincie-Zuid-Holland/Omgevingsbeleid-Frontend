import { useCallback, useLayoutEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { NetworkGraph } from '@/components/Network'
import allDimensies from '@/constants/dimensies'
import useAuth from '@/hooks/useAuth'
import {
    Dashboard,
    MijnBeleid,
    VerordeningenStructuurCRUD,
    VerordeningenstructuurDetail,
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
import AreaDetail from '@/pages/public/AreaDetail'
import AreaOverview from '@/pages/public/AreaOverview'
import EnvironmentProgram from '@/pages/public/EnvironmentProgram'
import ThemeDetail from '@/pages/public/ThemeDetail'
import ThemeOverview from '@/pages/public/ThemeOverview'
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
            path: 'verordening',
            element: <Verordening />,
        },
        {
            path: 'omgevingsprogramma',
            children: [
                {
                    index: true,
                    element: <EnvironmentProgram />,
                },
                {
                    path: 'gebiedsprogrammas',
                    children: [
                        {
                            index: true,
                            element: <AreaOverview />,
                        },
                        {
                            path: ':id',
                            element: <AreaDetail />,
                        },
                    ],
                },
                {
                    path: 'thematische-programmas',
                    children: [
                        {
                            index: true,
                            element: <ThemeOverview />,
                        },
                        {
                            path: ':id',
                            element: <ThemeDetail />,
                        },
                    ],
                },
            ],
        },
        ...detailPages
            .filter(page => page.isPublic)
            .map(item => ({
                path: item.slug,
                children: [
                    {
                        index: true,
                        element: (
                            <UniversalObjectOverview
                                {...item}
                                dataEndpoint={item.dataValidEndpoint}
                            />
                        ),
                    },
                    {
                        path: ':id',
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
                            children: [
                                {
                                    index: true,
                                    element: <VerordeningenstructuurDetail />,
                                },
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
                ...detailPages
                    .filter(page => !!page.element)
                    .map(item => ({
                        path: item.slug,
                        children: [
                            {
                                index: true,
                                element: item.element,
                            },
                            ...(item.children || []),
                        ],
                    })),
            ],
        },
    ])

    return routes
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
