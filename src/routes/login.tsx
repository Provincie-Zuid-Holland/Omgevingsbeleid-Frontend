import { Route } from '@tanstack/react-router'

import { Login } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <Login />,
})
