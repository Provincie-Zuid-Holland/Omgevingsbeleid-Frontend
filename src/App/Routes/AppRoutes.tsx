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
import TabTimeline from '@/pages/protected/Modules/ModuleDetail/components/TabTimeline'
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

const generatePublicModelRoutes = () =>
    Object.keys(models)
        .filter(model => !!models[model as ModelType].defaults.slugOverview)
        .map(model => {
            const config = models[model as ModelType]
            const { slugOverview, plural, atemporal } = config.defaults

            return {
                path: `${slugOverview}/${plural}`,
                children: [
                    {
                        index: true,
                        element: <DynamicOverviewPublic model={config} />,
                    },
                    {
                        path: atemporal ? ':id' : ':uuid',
                        element: atemporal ? (
                            <AtemportalObject model={config} />
                        ) : (
                            <DynamicObjectPublic model={config} />
                        ),
                    },
                    ...(!atemporal
                        ? [
                              {
                                  path: 'ontwerpversie/:moduleId/:uuid',
                                  element: (
                                      <DynamicObjectPublic
                                          model={config}
                                          isRevision
                                      />
                                  ),
                              },
                          ]
                        : []),
                ],
            }
        })

const generateProtectedModelRoutes = () =>
    Object.keys(models).map(model => {
        const config = models[model as ModelType]
        const { plural, atemporal } = config.defaults

        return {
            path: plural,
            children: [
                {
                    index: true,
                    element: <DynamicOverview model={config} />,
                },
                {
                    path: ':objectId',
                    children: [
                        {
                            index: true,
                            element: (
                                <ObjectProvider model={config}>
                                    <ObjectDetail model={config} />
                                </ObjectProvider>
                            ),
                        },
                        ...(atemporal
                            ? [
                                  {
                                      path: 'bewerk',
                                      element: (
                                          <ProtectedRoute
                                              permissions={{
                                                  canCreateModule: true,
                                              }}
                                              redirectTo={`/muteer/${plural}`}>
                                              <ObjectWrite model={config} />
                                          </ProtectedRoute>
                                      ),
                                  },
                              ]
                            : []),
                    ],
                },
                ...(atemporal
                    ? [
                          {
                              path: 'nieuw',
                              element: (
                                  <ProtectedRoute
                                      permissions={{ canCreateModule: true }}
                                      redirectTo={`/muteer/${plural}`}>
                                      <ObjectCreate model={config} />
                                  </ProtectedRoute>
                              ),
                          },
                      ]
                    : []),
            ],
        }
    })

const generateModuleObjectRoutes = () =>
    Object.keys(models)
        .filter(model => !models[model as ModelType].defaults.atemporal)
        .map(model => {
            const config = models[model as ModelType]
            const singular = config.defaults.singular

            return {
                path: singular,
                element: <ObjectProvider model={config} />,
                children: [
                    {
                        path: ':objectId',
                        children: [
                            {
                                index: true,
                                element: <ObjectDetail model={config} />,
                            },
                            {
                                path: 'bewerk',
                                element: <ObjectEdit model={config} />,
                            },
                        ],
                    },
                ],
            }
        })

const AppRoutes = () => {
    const { showBoundary } = useErrorBoundary()
    globalErrorBoundary.showBoundary = showBoundary

    const routes = useRoutes([
        /** Public Routes */
        {
            path: '/',
            element: <Home />,
        },
        { path: 'login', element: <Login /> },
        { path: 'logout', element: <Logout /> },
        { path: 'zoekresultaten', element: <SearchResults /> },
        { path: 'zoeken-op-kaart', element: <MapSearch /> },
        { path: 'over-dit-platform', element: <About /> },
        { path: 'digi-toegankelijkheid', element: <Accessibility /> },
        { path: 'beleidsnetwerk', element: <Network /> },
        { path: 'herzieningen', element: <Revisions /> },
        { path: 'omgevingsvisie', element: <EnvironmentVision /> },
        {
            path: 'omgevingsprogramma',
            children: [
                { index: true, element: <EnvironmentProgram /> },
                {
                    path: 'gebiedsprogrammas',
                    children: [
                        { index: true, element: <AreaOverview /> },
                        { path: ':uuid', element: <AreaDetail /> },
                        {
                            path: 'ontwerpversie/:moduleId/:uuid',
                            element: <AreaDetail />,
                        },
                    ],
                },
                {
                    path: 'thematische-programmas',
                    children: [
                        { index: true, element: <ThemeOverview /> },
                        { path: ':uuid', element: <ThemeDetail /> },
                    ],
                },
            ],
        },
        ...generatePublicModelRoutes(),

        /** Protected Routes */
        {
            path: 'muteer',
            element: <ProtectedRoute />,
            children: [
                { index: true, element: <Dashboard /> },
                {
                    path: 'modules',
                    children: [
                        { index: true, element: <ModulesOverview /> },
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
                                            path: 'besluiten',
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
                                        {
                                            path: 'tijdlijn',
                                            element: <TabTimeline />,
                                        },
                                    ],
                                },
                                { path: 'bewerk', element: <ModuleEdit /> },
                                ...generateModuleObjectRoutes(),
                            ],
                        },
                        {
                            path: 'nieuw',
                            element: (
                                <ProtectedRoute
                                    permissions={{ canCreateModule: true }}>
                                    <ModuleCreate />
                                </ProtectedRoute>
                            ),
                        },
                    ],
                },
                ...generateProtectedModelRoutes(),
                {
                    path: 'verordening',
                    element: <Regulations />,
                },
                {
                    path: 'gebruikers',
                    element: (
                        <ProtectedRoute
                            permissions={{ canCreateUser: true }}
                            redirectTo="/muteer"
                        />
                    ),
                    children: [
                        { index: true, element: <UsersOverview /> },
                        { path: ':uuid', element: <UserDetail /> },
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
        { path: '500', element: <MaintenancePage /> },
        { path: '*', element: <NotFoundPage /> },
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
