import { Outlet, Router, rootRouteWithContext } from '@tanstack/react-router'

import { indexRoute } from '@/routes'
import { notFoundRoute } from '@/routes/404'
import { accessibilityRoute } from '@/routes/accessibility'
import { environmentProgramRoute } from '@/routes/environmentProgram'
import { areasRoute } from '@/routes/environmentProgram/areas'
import { areaDetailRoute } from '@/routes/environmentProgram/areas/detail'
import { areaVersionRoute } from '@/routes/environmentProgram/areas/version'
import { themesRoute } from '@/routes/environmentProgram/themes'
import { themeDetailRoute } from '@/routes/environmentProgram/themes/detail'
import { loginRoute } from '@/routes/login'
import { logoutRoute } from '@/routes/logout'
import { networkRoute } from '@/routes/network'
import { releasesRoute } from '@/routes/releases'
import { revisionsRoute } from '@/routes/revisions'
import { searchResultsRoute } from '@/routes/searchResults'

import { queryClient } from './queryClient'

const rootRoute = rootRouteWithContext<{
    queryClient: typeof queryClient
}>()({
    component: () => <Outlet />,
})

// Route tree
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    logoutRoute,
    searchResultsRoute,
    releasesRoute,
    networkRoute,
    accessibilityRoute,
    revisionsRoute,
    environmentProgramRoute.addChildren([
        areasRoute.addChildren([areaDetailRoute, areaVersionRoute]),
        themesRoute.addChildren([themeDetailRoute]),
    ]),
])

// Set up a Router instance
const router = new Router({
    routeTree,
    notFoundRoute,
    defaultPreload: 'intent',
    context: {
        queryClient,
    },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export { rootRoute, routeTree, router }
