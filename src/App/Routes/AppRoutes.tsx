import { useCallback, useLayoutEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { NetworkGraph } from '@/components/Network'
import * as models from '@/config/objects'
import useAuth from '@/hooks/useAuth'
import {
    Dashboard,
    DynamicObject,
    DynamicOverview,
    ModuleCreate,
    ModuleDetail,
    ModuleEdit,
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
                            children: [
                                {
                                    index: true,
                                    element: <AreaDetail />,
                                },
                                {
                                    path: ':id',
                                    element: (
                                        <ObjectDetail
                                            {...detailPages.find(
                                                page =>
                                                    page.slug === 'maatregelen'
                                            )}
                                        />
                                    ),
                                },
                            ],
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
                            children: [
                                {
                                    index: true,
                                    element: <ThemeDetail />,
                                },
                                {
                                    path: ':id',
                                    element: (
                                        <ObjectDetail
                                            {...detailPages.find(
                                                page =>
                                                    page.slug === 'maatregelen'
                                            )}
                                        />
                                    ),
                                },
                            ],
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
                    index: true,
                    element: <Dashboard />,
                },
                {
                    path: 'modules',
                    children: [
                        {
                            path: ':moduleId',
                            children: [
                                {
                                    index: true,
                                    element: <ModuleDetail />,
                                },
                                {
                                    path: 'bewerk',
                                    element: <ModuleEdit />,
                                },
                                ...Object.keys(models).map(model => ({
                                    path: models[model as keyof typeof models]
                                        .defaults.singular,
                                    children: [
                                        {
                                            path: ':objectId',
                                            element: (
                                                <DynamicObject
                                                    model={
                                                        models[
                                                            model as keyof typeof models
                                                        ]
                                                    }
                                                />
                                            ),
                                        },
                                    ],
                                })),
                            ],
                        },
                        {
                            path: 'nieuw',
                            element: <ModuleCreate />,
                        },
                    ],
                },
                ...Object.keys(models).map(model => ({
                    path: models[model as keyof typeof models].defaults.plural,
                    element: (
                        <DynamicOverview
                            model={models[model as keyof typeof models]}
                        />
                    ),
                })),
                // ...detailPages
                //     .filter(page => !!page.element)
                //     .map(item => ({
                //         path: item.slug,
                //         children: [
                //             {
                //                 index: true,
                //                 element: item.element,
                //             },
                //             ...(item.children || []),
                //         ],
                //     })),
            ],
        },
    ])

    return routes
}

const Logout = () => {
    const navigate = useNavigate()
    const { signout } = useAuth()

    const cleanup = useCallback(
        () => signout(() => navigate('/')),
        [signout, navigate]
    )

    useLayoutEffect(() => cleanup(), [cleanup])

    return null
}

export default AppRoutes
