import { useCallback, useLayoutEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import * as regulations from '@/config/regulations'
import { ModelType as RegulationType } from '@/config/regulations/types'
import ModuleProvider from '@/context/ModuleContext'
import ObjectProvider from '@/context/ObjectContext'
import useAuth from '@/hooks/useAuth'
import {
    Dashboard,
    ObjectEdit,
    DynamicOverview,
    ModuleCreate,
    ModuleDetail,
    ModuleEdit,
    RegulationCreate,
    RegulationEdit,
    RegulationOverview,
} from '@/pages/protected'
import ObjectDetail from '@/pages/protected/DynamicObject/ObjectDetail'
import {
    Accessibility,
    Home,
    Login,
    PlanningAndReleases,
    DynamicOverview as DynamicOverviewPublic,
    DynamicObject as DynamicObjectPublic,
    Network,
} from '@/pages/public'

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
        // {
        //     path: 'zoekresultaten',
        //     element: <SearchResults />,
        // },
        // { path: 'zoeken-op-kaart', element: <MapSearch /> },
        {
            path: 'planning-en-releases',
            element: <PlanningAndReleases />,
        },
        {
            path: 'digi-toegankelijkheid',
            element: <Accessibility />,
        },
        // {
        //     path: 'in-bewerking',
        //     element: <InProgress />,
        // },
        {
            path: 'beleidsnetwerk',
            element: <Network />,
        },
        // {
        //     path: 'verordening',
        //     element: <Verordening />,
        // },
        // {
        //     path: 'omgevingsprogramma',
        //     children: [
        //         {
        //             index: true,
        //             element: <EnvironmentProgram />,
        //         },
        //         {
        //             path: 'gebiedsprogrammas',
        //             children: [
        //                 {
        //                     index: true,
        //                     element: <AreaOverview />,
        //                 },
        //                 {
        //                     path: ':id',
        //                     children: [
        //                         {
        //                             index: true,
        //                             element: <AreaDetail />,
        //                         },
        //                         {
        //                             path: ':id',
        //                             element: (
        //                                 <DynamicObjectPublic
        //                                     model={models['maatregel']}
        //                                 />
        //                             ),
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //         {
        //             path: 'thematische-programmas',
        //             children: [
        //                 {
        //                     index: true,
        //                     element: <ThemeOverview />,
        //                 },
        //                 {
        //                     path: ':id',
        //                     children: [
        //                         {
        //                             index: true,
        //                             element: <ThemeDetail />,
        //                         },
        //                         {
        //                             path: ':id',
        //                             element: (
        //                                 <DynamicObjectPublic
        //                                     model={models['maatregel']}
        //                                 />
        //                             ),
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        // },
        {
            path: 'omgevingsvisie',
            children: [
                ...Object.keys(models)
                    .filter(
                        model =>
                            !!models[model as ModelType].defaults.slugOverview
                    )
                    .map(model => ({
                        path: models[model as ModelType].defaults.slugOverview,
                        children: [
                            {
                                index: true,
                                element: (
                                    <DynamicOverviewPublic
                                        model={models[model as ModelType]}
                                    />
                                ),
                            },
                            {
                                path: ':uuid',
                                element: (
                                    <DynamicObjectPublic
                                        model={models[model as ModelType]}
                                    />
                                ),
                            },
                        ],
                    })),
            ],
        },
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
                                        <ProtectedRoute
                                            permissions={{
                                                canEditModule: true,
                                            }}>
                                            <ModuleEdit />
                                        </ProtectedRoute>
                                    ),
                                },
                                ...Object.keys(models).map(model => ({
                                    path: models[model as ModelType].defaults
                                        .singular,
                                    element: (
                                        <ObjectProvider
                                            model={models[model as ModelType]}
                                        />
                                    ),
                                    children: [
                                        {
                                            path: ':objectId',
                                            children: [
                                                {
                                                    index: true,
                                                    element: (
                                                        <ObjectDetail
                                                            model={
                                                                models[
                                                                    model as ModelType
                                                                ]
                                                            }
                                                        />
                                                    ),
                                                },
                                                {
                                                    path: 'bewerk',
                                                    element: (
                                                        <ObjectEdit
                                                            model={
                                                                models[
                                                                    model as ModelType
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
                                <ProtectedRoute
                                    permissions={{
                                        canCreateModule: true,
                                    }}>
                                    <ModuleCreate />
                                </ProtectedRoute>
                            ),
                        },
                    ],
                },
                ...Object.keys(models).map(model => ({
                    path: models[model as ModelType].defaults.plural,
                    children: [
                        {
                            index: true,
                            element: (
                                <DynamicOverview
                                    model={models[model as ModelType]}
                                />
                            ),
                        },
                        {
                            path: ':objectId',
                            element: (
                                <ObjectProvider
                                    model={models[model as ModelType]}>
                                    <ObjectDetail
                                        model={models[model as ModelType]}
                                    />
                                </ObjectProvider>
                            ),
                        },
                    ],
                })),
                ...Object.keys(regulations)
                    .filter(e => e !== 'default')
                    .map(model => ({
                        path: regulations[model as RegulationType].defaults
                            .plural,
                        children: [
                            {
                                index: true,
                                element: (
                                    <RegulationOverview
                                        model={
                                            regulations[model as RegulationType]
                                        }
                                    />
                                ),
                            },
                            {
                                path: ':objectUuid',
                                children: [
                                    {
                                        path: 'bewerk',
                                        element: (
                                            <ProtectedRoute
                                                permissions={{
                                                    canCreateModule: true,
                                                }}
                                                redirectTo={`/muteer/${
                                                    regulations[
                                                        model as RegulationType
                                                    ].defaults.plural
                                                }`}>
                                                <RegulationEdit
                                                    model={
                                                        regulations[
                                                            model as RegulationType
                                                        ]
                                                    }
                                                />
                                            </ProtectedRoute>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'nieuw',
                                element: (
                                    <ProtectedRoute
                                        permissions={{
                                            canCreateModule: true,
                                        }}
                                        redirectTo={`/muteer/${
                                            regulations[model as RegulationType]
                                                .defaults.plural
                                        }`}>
                                        <RegulationCreate
                                            model={
                                                regulations[
                                                    model as RegulationType
                                                ]
                                            }
                                        />
                                    </ProtectedRoute>
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
