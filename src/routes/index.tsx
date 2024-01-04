import { Route } from '@tanstack/react-router'

import { Home } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Home />,
})
