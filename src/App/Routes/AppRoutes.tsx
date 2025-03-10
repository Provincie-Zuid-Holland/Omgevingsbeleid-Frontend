import { useCallback, useLayoutEffect } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
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
    PublicationTemplateCreate,
    PublicationTemplateEdit,
    PublicationTemplateOverview,
    Regulations,
    UserDetail,
    UsersOverview,
} from '@/pages/protected'
import TabDecisions, {
    Packages,
    Publications,
} from '@/pages/protected/Modules/ModuleDetail/components/TabDecisions'
import TabObjects from '@/pages/protected/Modules/ModuleDetail/components/TabObjects'
import ModulesOverview from '@/pages/protected/Modules/ModulesOverview'
import {
    Accessibility,
    AreaDetail,
    AreaOverview,
    AtemportalObject,
    DynamicObject as DynamicObjectPublic,
    DynamicOverview as DynamicOverviewPublic,
    EnvironmentProgram,
    Home,
    Login,
    MapSearch,
    Network,
    NotFoundPage,
    Revisions,
    SearchResults,
    ThemeDetail,
    ThemeOverview,
} from '@/pages/public'
import About from '@/pages/public/About'
import EnvironmentVision from '@/pages/public/EnvironmentVision'
import MaintenancePage from '@/pages/public/MaintenancePage/MaintenancePage'
import globalErrorBoundary from '@/utils/globalErrorBoundary'

import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
    const { showBoundary } = useErrorBoundary()
    globalErrorBoundary.showBoundary = showBoundary

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
            path: 'over-dit-platform',
            element: <About />,
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
            path: 'omgevingsvisie',
            element: <EnvironmentVision />,
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
                            path: ':uuid',
                            children: [
                                {
                                    index: true,
                                    element: <AreaDetail />,
                                },
                            ],
                        },
                        {
                            path: 'ontwerpversie',
                            children: [
                                {
                                    path: ':moduleId/:uuid',
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
                path: `${models[model as ModelType].defaults.slugOverview}/${
                    models[model as ModelType].defaults.plural
                }`,
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
                            index: true,
                            element: <ModulesOverview />,
                        },
                        {
                            path: ':moduleId',
                            element: <ModuleProvider />,
                            children: [
                                {
                                    element: <ModuleDetail />,
                                    children: [
                                        {
                                            index: true,
                                            element: <TabObjects />,
                                        },
                                        {
                                            path: ':tab',
                                            element: (
                                                <ProtectedRoute
                                                    permissions={{
                                                        canCreatePublication:
                                                            true,
                                                    }}
                                                    redirectTo="/muteer/modules">
                                                    <TabDecisions />
                                                </ProtectedRoute>
                                            ),
                                            children: [
                                                {
                                                    index: true,
                                                    element: <Publications />,
                                                },
                                                {
                                                    path: ':versionUUID/leveringen',
                                                    element: <Packages />,
                                                },
                                            ],
                                        },
                                    ],
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
                {
                    path: 'verordening',
                    element: <Regulations />,
                },
                {
                    path: 'gebruikers',
                    element: (
                        <ProtectedRoute
                            permissions={{
                                canCreateUser: true,
                            }}
                            redirectTo="/muteer"
                        />
                    ),
                    children: [
                        {
                            index: true,
                            element: <UsersOverview />,
                        },
                        {
                            path: ':uuid',
                            element: <UserDetail />,
                        },
                    ],
                },
                {
                    path: 'publicatietemplates',
                    children: [
                        {
                            index: true,
                            element: (
                                <ProtectedRoute
                                    permissions={{
                                        canViewPublicationTemplate: true,
                                    }}
                                    redirectTo="/muteer">
                                    <PublicationTemplateOverview />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: ':uuid',
                            element: (
                                <ProtectedRoute
                                    permissions={{
                                        canViewPublicationTemplate: true,
                                    }}
                                    redirectTo="/muteer">
                                    <PublicationTemplateEdit />
                                </ProtectedRoute>
                            ),
                        },
                        {
                            path: 'nieuw',
                            element: (
                                <ProtectedRoute
                                    permissions={{
                                        canCreatePublicationTemplate: true,
                                    }}
                                    redirectTo="/muteer">
                                    <PublicationTemplateCreate />
                                </ProtectedRoute>
                            ),
                        },
                    ],
                },
            ],
        },
        {
            path: '500',
            element: <MaintenancePage />,
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
