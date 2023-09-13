import { useCallback, useLayoutEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import ModuleProvider from '@/context/ModuleContext'
import ObjectProvider from '@/context/ObjectContext'
import useAuth from '@/hooks/useAuth'
import {
    Dashboard,
    DynamicOverview,
    ModuleCreate,
    ModuleDetail,
    ModuleEdit,
    ObjectCreate,
    ObjectDetail,
    ObjectEdit,
    ObjectWrite,
} from '@/pages/protected'
// import Regulations from '@/pages/protected/Regulations/Regulations'
import {
    Accessibility,
    AreaDetail,
    AreaOverview,
    DynamicObject as DynamicObjectPublic,
    DynamicOverview as DynamicOverviewPublic,
    EnvironmentProgram,
    Home,
    Login,
    MapSearch,
    Network,
    NotFoundPage,
    PlanningAndReleases,
    SearchResults,
    ThemeDetail,
    ThemeOverview,
} from '@/pages/public'
import AtemportalObject from '@/pages/public/AtemportalObject/AtemportalObject'
import Revisions from '@/pages/public/Revisions/Revisions'

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
            path: 'beleidsnetwerk',
            element: <Network />,
        },
        {
            path: 'herzieningen',
            element: <Revisions />,
        },
        // {
        //     path: 'verordening',
        //     element: <Verordening />,
        // },
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
                            path: ':uuid',
                            children: [
                                {
                                    index: true,
                                    element: <AreaDetail />,
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
                            path: ':uuid',
                            children: [
                                {
                                    index: true,
                                    element: <ThemeDetail />,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        ...Object.keys(models)
            .filter(model => !!models[model as ModelType].defaults.slugOverview)
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
                        path: !models[model as ModelType].defaults.atemporal
                            ? ':uuid'
                            : ':id',
                        element: !models[model as ModelType].defaults
                            .atemporal ? (
                            <DynamicObjectPublic
                                model={models[model as ModelType]}
                            />
                        ) : (
                            <AtemportalObject
                                model={models[model as ModelType]}
                            />
                        ),
                    },
                    ...(!models[model as ModelType].defaults.atemporal
                        ? [
                              {
                                  path: 'ontwerpversie',
                                  children: [
                                      {
                                          path: ':moduleId/:uuid',
                                          element: (
                                              <DynamicObjectPublic
                                                  model={
                                                      models[model as ModelType]
                                                  }
                                                  isRevision
                                              />
                                          ),
                                      },
                                  ],
                              },
                          ]
                        : []),
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
                                    element: <ModuleEdit />,
                                },
                                ...Object.keys(models)
                                    .filter(
                                        model =>
                                            !models[model as ModelType].defaults
                                                .atemporal
                                    )
                                    .map(model => ({
                                        path: models[model as ModelType]
                                            .defaults.singular,
                                        element: (
                                            <ObjectProvider
                                                model={
                                                    models[model as ModelType]
                                                }
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
                            children: [
                                {
                                    index: true,
                                    element: (
                                        <ObjectProvider
                                            model={models[model as ModelType]}>
                                            <ObjectDetail
                                                model={
                                                    models[model as ModelType]
                                                }
                                            />
                                        </ObjectProvider>
                                    ),
                                },
                                ...((models[model as ModelType].defaults
                                    .atemporal && [
                                    {
                                        path: 'bewerk',
                                        element: (
                                            <ProtectedRoute
                                                permissions={{
                                                    canCreateModule: true,
                                                }}
                                                redirectTo={`/muteer/${
                                                    models[model as ModelType]
                                                        .defaults.plural
                                                }`}>
                                                <ObjectWrite
                                                    model={
                                                        models[
                                                            model as ModelType
                                                        ]
                                                    }
                                                />
                                            </ProtectedRoute>
                                        ),
                                    },
                                ]) ||
                                    []),
                            ],
                        },
                        ...((models[model as ModelType].defaults.atemporal && [
                            {
                                path: 'nieuw',
                                element: (
                                    <ProtectedRoute
                                        permissions={{
                                            canCreateModule: true,
                                        }}
                                        redirectTo={`/muteer/${
                                            models[model as ModelType].defaults
                                                .plural
                                        }`}>
                                        <ObjectCreate
                                            model={models[model as ModelType]}
                                        />
                                    </ProtectedRoute>
                                ),
                            },
                        ]) ||
                            []),
                    ],
                })),
                // {
                //     path: 'verordening',
                //     element: <Regulations />,
                // },
            ],
        },
        {
            path: '*',
            element: <NotFoundPage />,
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
