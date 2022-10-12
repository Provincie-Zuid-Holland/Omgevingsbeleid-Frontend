import { useCallback, useLayoutEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { NetworkGraph } from '@/components/Network'
import policyObjects from '@/constants/policyObjects'
import useAuth from '@/hooks/useAuth'
import { Dashboard, MijnBeleid } from '@/pages/protected'
import MutatePolicy from '@/pages/protected/MutatePolicy'
import VerordeningEdit from '@/pages/protected/VerordeningEdit'
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
                                <MutatePolicy
                                    policyConstants={policyObjects.VERORDENING}
                                />
                            ),
                        },
                        {
                            path: ':single',
                            children: [
                                {
                                    index: true,
                                    element: <VerordeningEdit />,
                                },
                                {
                                    path: 'bewerk',
                                    element: (
                                        <MutatePolicy
                                            policyConstants={
                                                policyObjects.VERORDENING
                                            }
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
