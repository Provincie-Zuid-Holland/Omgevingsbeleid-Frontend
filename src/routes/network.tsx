import { Route } from '@tanstack/react-router'

import { Network } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const networkRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/beleidsnetwerk',
    component: () => <Network />,
})
