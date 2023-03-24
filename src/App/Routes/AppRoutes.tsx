import { useCallback, useLayoutEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import { NetworkGraph } from '@/components/Network'
import * as models from '@/config/objects'
import ModuleProvider from '@/context/ModuleContext'
import useAuth from '@/hooks/useAuth'
import {
    Dashboard,
    ObjectEdit,
    DynamicOverview,
    ModuleCreate,
    ModuleDetail,
    ModuleEdit,
} from '@/pages/protected'
import ObjectDetail from '@/pages/protected/DynamicObject/ObjectDetail'
import {
    Accessibility,
    Home,
    InProgress,
    Login,
    MapSearch,
    PlanningAndReleases,
    SearchResults,
    Verordening,
    DynamicOverview as DynamicOverviewPublic,
    DynamicObject as DynamicObjectPublic,
} from '@/pages/public'
import AreaDetail from '@/pages/public/AreaDetail'
import AreaOverview from '@/pages/public/AreaOverview'
import EnvironmentProgram from '@/pages/public/EnvironmentProgram'
import ThemeDetail from '@/pages/public/ThemeDetail'
import ThemeOverview from '@/pages/public/ThemeOverview'

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
                                        <DynamicObjectPublic
                                            model={models['maatregel']}
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
                                        <DynamicObjectPublic
                                            model={models['maatregel']}
                                        />
                                    ),
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        ...Object.keys(models)
            .filter(
                model =>
                    !!models[model as keyof typeof models].defaults.slugOverview
            )
            .map(model => ({
                path: models[model as keyof typeof models].defaults
                    .slugOverview,
                children: [
                    {
                        index: true,
                        element: (
                            <DynamicOverviewPublic
                                model={models[model as keyof typeof models]}
                            />
                        ),
                    },
                    {
                        path: ':uuid',
                        element: (
                            <DynamicObjectPublic
                                model={models[model as keyof typeof models]}
                            />
                        ),
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
                            element: <ModuleProvider />,
                            children: [
                                {
                                    index: true,
                                    element: <ModuleDetail />,
                                },
                                {
                                    path: 'bewerk',
                                    element: (
                                        <ProtectedRoute roles={['Beheerder']}>
                                            <ModuleEdit />
                                        </ProtectedRoute>
                                    ),
                                },
                                ...Object.keys(models).map(model => ({
                                    path: models[model as keyof typeof models]
                                        .defaults.singular,
                                    children: [
                                        {
                                            path: ':objectId',
                                            children: [
                                                {
                                                    path: 'bewerk',
                                                    element: (
                                                        <ObjectEdit
                                                            model={
                                                                models[
                                                                    model as keyof typeof models
                                                                ]
                                                            }
                                                        />
                                                    ),
                                                },
                                            ],
                                        },
                                    ],
                                })),
                            ],
                        },
                        {
                            path: 'nieuw',
                            element: (
                                <ProtectedRoute roles={['Beheerder']}>
                                    <ModuleCreate />
                                </ProtectedRoute>
                            ),
                        },
                    ],
                },
                ...Object.keys(models).map(model => ({
                    path: models[model as keyof typeof models].defaults.plural,
                    children: [
                        {
                            index: true,
                            element: (
                                <DynamicOverview
                                    model={models[model as keyof typeof models]}
                                />
                            ),
                        },
                        {
                            path: ':objectId',
                            element: (
                                <ObjectDetail
                                    model={models[model as keyof typeof models]}
                                />
                            ),
                        },
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
        () => signout(() => navigate('/')),
        [signout, navigate]
    )

    useLayoutEffect(() => cleanup(), [cleanup])

    return null
}

export default AppRoutes
